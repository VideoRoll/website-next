import {
	ALL_FORMATS,
	AdtsOutputFormat,
	AudioCodec,
	BlobSource,
	BufferTarget,
	canEncodeAudio,
	Conversion,
	FlacOutputFormat,
	getEncodableAudioCodecs,
	getEncodableVideoCodecs,
	Input,
	type InputAudioTrack,
	type InputTrack,
	type InputVideoTrack,
	MkvOutputFormat,
	MovOutputFormat,
	Mp3OutputFormat,
	Mp4OutputFormat,
	OggOutputFormat,
	Output,
	type OutputFormat,
	type Quality,
	WavOutputFormat,
	WebMOutputFormat,
} from 'mediabunny';
import { registerMp3Encoder } from '@mediabunny/mp3-encoder';

export type ContainerFormat =
	| 'mp4'
	| 'webm'
	| 'mkv'
	| 'mov'
	| 'mp3'
	| 'wav'
	| 'flac'
	| 'ogg'
	| 'adts';

export type ConvertStage =
	| 'idle'
	| 'preparing'
	| 'converting'
	| 'completed'
	| 'error'
	| 'cancelled';

export type ConvertProgress = {
	stage: ConvertStage;
	fraction: number; // 0..1
	message: string;
};

export type AudioTrackAction =
	| { type: 'copy' }
	| {
		type: 'reencode';
		codec?: AudioCodec;
		bitrate?: number | Quality;
		sampleRate?: number;
	}
	| { type: 'drop' }
	| { type: 'fail'; reason?: string };

export type VideoTrackAction =
	| { type: 'copy' }
	| { type: 'reencode'; codec?: string; bitrate?: number | Quality; rotate?: number }
	| { type: 'drop' }
	| { type: 'fail'; reason?: string };

export type ConvertController = {
	cancel: () => void;
	getProgress: () => ConvertProgress;
	signal: AbortSignal;
};

type ControllerInternal = ConvertController & {
	_setProgress: (p: ConvertProgress) => void;
};

export const DEFAULT_CONTAINERS: readonly ContainerFormat[] = [
	'mp4',
	'webm',
	'mkv',
	'mov',
	'mp3',
	'wav',
	'flac',
	'ogg',
	'adts',
] as const;

const MIME_BY_CONTAINER: Record<ContainerFormat, string> = {
	mp4: 'video/mp4',
	webm: 'video/webm',
	mkv: 'video/x-matroska',
	mov: 'video/quicktime',
	mp3: 'audio/mpeg',
	wav: 'audio/wav',
	flac: 'audio/flac',
	ogg: 'audio/ogg',
	adts: 'audio/aac',
};

let mp3EncoderRegistered = false;

async function ensureMp3EncoderForContainer(container: ContainerFormat): Promise<void> {
	if (container !== 'mp3') {
		return;
	}
	await ensureMp3EncoderRegistered();
}

async function ensureMp3EncoderRegistered(): Promise<void> {
	if (mp3EncoderRegistered) {
		return;
	}

	const nativeOk = await canEncodeMp3Natively();
	if (nativeOk) {
		mp3EncoderRegistered = true;
		return;
	}

	registerMp3Encoder();
	mp3EncoderRegistered = true;
}

async function canEncodeMp3Natively(): Promise<boolean> {
	try {
		return await canEncodeAudio('mp3');
	} catch {
		return false;
	}
}

export function createConvertController(): ConvertController {
	const abortController = new AbortController();

	let progress: ConvertProgress = {
		stage: 'idle',
		fraction: 0,
		message: '',
	};

	const controller: ControllerInternal = {
		signal: abortController.signal,
		cancel: () => {
			if (!abortController.signal.aborted) {
				abortController.abort();
			}
			controller._setProgress({ stage: 'cancelled', fraction: 0, message: '已取消' });
		},
		getProgress: () => progress,
		_setProgress: (p) => {
			progress = p;
		},
	};

	return controller;
}

export type ConvertMediaOptions = {
	src: File | Blob;
	container: ContainerFormat;
	videoCodec?: string;
	audioCodec?: AudioCodec;
	videoBitrate?: number | Quality;
	audioBitrate?: number | Quality;
	audioSampleRate?: number;
	controller?: ConvertController;
	onProgress?: (p: ConvertProgress) => void;
	onVideoTrack?: (track: any, index: number) => VideoTrackAction | undefined;
	onAudioTrack?: (track: any, index: number) => AudioTrackAction | undefined;
};

export type ConvertStartOptions = {
	file: File | Blob;
	fileName?: string;
	outputFormat: ContainerFormat;
	videoCodec?: string;
	audioCodec?: AudioCodec;
	videoBitrate?: number | Quality;
	videoQuality?: number | Quality;
	audioBitrate?: number | Quality;
	audioSampleRate?: number;
	controller?: ConvertController;
	onProgress?: (p: ConvertProgress) => void;
	onVideoTrack?: ConvertMediaOptions['onVideoTrack'];
	onAudioTrack?: ConvertMediaOptions['onAudioTrack'];
	onSuccess?: (blob: Blob) => void;
	onError?: (error: unknown) => void;
};

export class Convert {
	private initialized = false;
	private controller: ConvertController | null = null;

	public async init(): Promise<void> {
		if (this.initialized) {
			return;
		}
		await ensureMp3EncoderRegistered();
		this.initialized = true;
	}

	public async destroy(): Promise<void> {
		this.cancel();
		this.initialized = false;
	}

	public cancel(): void {
		this.controller?.cancel();
	}

	public createController(): ConvertController {
		const c = createConvertController();
		this.controller = c;
		return c;
	}

	public async getSupportedVideoCodecs(container: ContainerFormat): Promise<string[]> {
		await this.init();
		return await getSupportedVideoCodecs(container);
	}

	public async getSupportedAudioCodecs(container: ContainerFormat): Promise<AudioCodec[]> {
		await this.init();
		return await getSupportedAudioCodecs(container);
	}

	public async getSupportedTrackCounts(container: ContainerFormat) {
		await this.init();
		return await getSupportedTrackCounts(container);
	}

	public async start(options: ConvertStartOptions): Promise<Blob> {
		await this.init();

		const controller = options.controller ?? this.createController();
		this.controller = controller;

		try {
			const blob = await convertMedia(this.toConvertMediaOptions(options, controller));
			options.onSuccess?.(blob);
			return blob;
		} catch (error) {
			options.onError?.(error);
			throw error;
		}
	}

	private toConvertMediaOptions(options: ConvertStartOptions, controller: ConvertController): ConvertMediaOptions {
		return {
			src: options.file,
			container: options.outputFormat,
			videoCodec: options.videoCodec,
			audioCodec: options.audioCodec,
			videoBitrate: options.videoBitrate ?? options.videoQuality,
			audioBitrate: options.audioBitrate,
			audioSampleRate: options.audioSampleRate,
			controller,
			onProgress: options.onProgress,
			onVideoTrack: options.onVideoTrack,
			onAudioTrack: options.onAudioTrack,
		};
	}
}

export async function getSupportedVideoCodecs(container: ContainerFormat) {
	await ensureMp3EncoderForContainer(container);
	const format = createOutputFormat(container);
	return await format.getSupportedVideoCodecs();
}

export async function getSupportedAudioCodecs(container: ContainerFormat) {
	await ensureMp3EncoderForContainer(container);
	const format = createOutputFormat(container);
	return await format.getSupportedAudioCodecs();
}

export async function getSupportedTrackCounts(container: ContainerFormat) {
	await ensureMp3EncoderForContainer(container);
	const format = createOutputFormat(container);
	return await format.getSupportedTrackCounts();
}

type AudioOperation =
	| { type: 'reencode'; audioCodec: AudioCodec; sampleRate: number | null }
	| { type: 'copy' }
	| { type: 'fail' }
	| { type: 'drop' };

type VideoOperation =
	| { type: 'reencode'; videoCodec: string; rotate?: number }
	| { type: 'copy' }
	| { type: 'drop' }
	| { type: 'fail' };

type VideoTrackOption = {
	trackId: number;
	operations: VideoOperation[];
};

type AudioTrackOption = {
	trackId: number;
	operations: AudioOperation[];
	audioCodec: InputAudioTrack['codec'];
};

type SupportedConfigs = {
	tracks: InputTrack[];
	videoTrackOptions: VideoTrackOption[];
	audioTrackOptions: AudioTrackOption[];
};

type PreparedConversion = {
	container: ContainerFormat;
	outputFormat: OutputFormat;
	input: Input;
	output: Output;
	videoOptionById: Map<number, VideoTrackOption>;
	audioOptionById: Map<number, AudioTrackOption>;
};

class ConvertMediaRunner {
	private readonly controller: ControllerInternal;

	public constructor(private readonly options: ConvertMediaOptions) {
		this.controller = (options.controller ?? createConvertController()) as ControllerInternal;
	}

	public async run(): Promise<Blob> {
		this.throwIfAborted();
		this.report({ stage: 'preparing', fraction: 0, message: '准备中…' });

		const prepared = await this.prepare();
		this.throwIfAborted();

		const conversion = await this.createConversion(prepared);
		this.throwIfAborted();

		await this.validateOrThrow(conversion, prepared);
		this.attachProgress(conversion);

		await conversion.execute();
		this.throwIfAborted();

		return this.buildBlob(prepared);
	}

	private report(p: ConvertProgress): void {
		this.controller._setProgress(p);
		this.options.onProgress?.(p);
	}

	private throwIfAborted(): void {
		throwIfAborted(this.controller);
	}

	private async prepare(): Promise<PreparedConversion> {
		const container = normalizeContainer(this.options.container);
		await ensureMp3EncoderForContainer(container);

		const outputFormat = createOutputFormat(container);
		const input = createInput(this.options.src);
		const tracks = await input.getTracks();

		const supportedConfigs = await getSupportedConfigsForConvert({
			tracks,
			container: outputFormat,
			sampleRate: this.options.audioSampleRate ?? null,
		});

		const trackCounts = await outputFormat.getSupportedTrackCounts();
		assertCanSatisfyOutput({
			container,
			trackCounts,
			audioTrackOptions: supportedConfigs.audioTrackOptions,
			videoTrackOptions: supportedConfigs.videoTrackOptions,
		});

		const output = new Output({
			format: outputFormat,
			target: new BufferTarget(),
		});

		return {
			container,
			outputFormat,
			input,
			output,
			videoOptionById: toOptionMap(supportedConfigs.videoTrackOptions),
			audioOptionById: toOptionMap(supportedConfigs.audioTrackOptions),
		};
	}

	private async createConversion(prepared: PreparedConversion) {
		return await Conversion.init({
			input: prepared.input,
			output: prepared.output,
			video: this.createVideoHandler(prepared.videoOptionById),
			audio: this.createAudioHandler(prepared.audioOptionById),
		});
	}

	private createVideoHandler(optionById: Map<number, VideoTrackOption>) {
		return async (track: any, index: number) => {
			if (this.controller.signal.aborted) {
				return { discard: true };
			}

			const option = optionById.get(track.id);
			if (!option) {
				return { discard: true };
			}

			const op = selectVideoOperation({
				operations: option.operations,
				action: this.options.onVideoTrack?.(track, index),
				requestedCodec: this.options.videoCodec,
			});

			return videoOperationToMediabunny({
				op,
				videoBitrate: this.options.videoBitrate,
			});
		};
	}

	private createAudioHandler(optionById: Map<number, AudioTrackOption>) {
		return async (track: any, index: number) => {
			if (this.controller.signal.aborted) {
				return { discard: true };
			}

			const option = optionById.get(track.id);
			if (!option) {
				return { discard: true };
			}

			const op = await selectAudioOperation({
				track,
				index,
				operations: option.operations,
				action: this.options.onAudioTrack?.(track, index),
				requestedCodec: this.options.audioCodec,
			});

			return audioOperationToMediabunny({
				op,
				audioBitrate: this.options.audioBitrate,
				audioSampleRate: this.options.audioSampleRate,
			});
		};
	}

	private async validateOrThrow(conversion: Conversion, prepared: PreparedConversion): Promise<void> {
		if (conversion.isValid) {
			return;
		}

		const message = formatDiscardedTracksError({
			container: prepared.container,
			supportedVideoCodecs: await prepared.outputFormat.getSupportedVideoCodecs(),
			supportedAudioCodecs: await prepared.outputFormat.getSupportedAudioCodecs(),
			discardedTracks: conversion.discardedTracks,
		});

		this.report({ stage: 'error', fraction: 0, message });
		throw new Error(message);
	}

	private attachProgress(conversion: Conversion): void {
		conversion.onProgress = (p: number) => {
			if (this.controller.signal.aborted) {
				return;
			}
			const fraction = clamp01(p);
			this.report({
				stage: 'converting',
				fraction,
				message: `转换中… ${Math.round(fraction * 100)}%`,
			});
		};
	}

	private buildBlob(prepared: PreparedConversion): Blob {
		const buffer = (prepared.output.target as BufferTarget).buffer;
		if (!buffer || buffer.byteLength === 0) {
			const msg = '转换完成但未生成有效数据';
			this.report({ stage: 'error', fraction: 0, message: msg });
			throw new Error(msg);
		}

		const mimeType = MIME_BY_CONTAINER[prepared.container] ?? prepared.output.format.mimeType;
		const blob = new Blob([buffer], { type: mimeType });

		if (!this.controller.signal.aborted) {
			this.report({ stage: 'completed', fraction: 1, message: '完成' });
		}

		return blob;
	}
}

export async function convertMedia(options: ConvertMediaOptions): Promise<Blob> {
	return await new ConvertMediaRunner(options).run();
}

function normalizeContainer(container: string): ContainerFormat {
	const v = container.toLowerCase() as ContainerFormat;
	return (DEFAULT_CONTAINERS as readonly string[]).includes(v) ? v : 'mp4';
}

function createInput(src: File | Blob): Input {
	return new Input({
		formats: ALL_FORMATS,
		source: new BlobSource(src),
	});
}

const OUTPUT_FORMAT_FACTORIES: Record<ContainerFormat, () => OutputFormat> = {
	mp4: () => new Mp4OutputFormat(),
	webm: () => new WebMOutputFormat(),
	wav: () => new WavOutputFormat(),
	adts: () => new AdtsOutputFormat(),
	mkv: () => new MkvOutputFormat(),
	mov: () => new MovOutputFormat(),
	mp3: () => new Mp3OutputFormat(),
	flac: () => new FlacOutputFormat(),
	ogg: () => new OggOutputFormat(),
};

function createOutputFormat(container: ContainerFormat): OutputFormat {
	return OUTPUT_FORMAT_FACTORIES[container]();
}

async function getSupportedConfigsForConvert(params: {
	tracks: InputTrack[];
	container: OutputFormat;
	sampleRate: number | null;
}): Promise<SupportedConfigs> {
	const { tracks, container, sampleRate } = params;

	const audioTrackOptions: AudioTrackOption[] = [];
	const videoTrackOptions: VideoTrackOption[] = [];

	for (const track of tracks) {
		if (track.isVideoTrack()) {
			const operations = await getVideoOperationsForTrack({
				track,
				container,
			});
			videoTrackOptions.push({ trackId: track.id, operations });
		}

		if (track.isAudioTrack()) {
			const operations = await getAudioOperationsForTrack({
				track,
				container,
				sampleRate,
			});
			audioTrackOptions.push({
				trackId: track.id,
				operations,
				audioCodec: track.codec,
			});
		}
	}

	return { tracks, videoTrackOptions, audioTrackOptions };
}

async function getAudioOperationsForTrack(params: {
	track: InputAudioTrack;
	container: OutputFormat;
	sampleRate: number | null;
}): Promise<AudioOperation[]> {
	const { track, container, sampleRate } = params;

	const ops: AudioOperation[] = [];

	if (canCopyAudioTrack({ inputTrack: track, outputContainer: container, sampleRate })) {
		ops.push({ type: 'copy' });
	}

	const reencodeOps = await getAudioTranscodingOptions({
		inputTrack: track,
		outputContainer: container,
		sampleRate,
	});
	ops.push(...reencodeOps);

	ops.push({ type: 'drop' });

	return ops;
}

async function getVideoOperationsForTrack(params: {
	track: InputVideoTrack;
	container: OutputFormat;
}): Promise<VideoOperation[]> {
	const { track, container } = params;
	const ops: VideoOperation[] = [];

	if (canCopyVideoTrack({
		inputTrack: track,
		outputContainer: container,
		rotationToApply: 0,
	})) {
		ops.push({ type: 'copy' });
	}

	const reencodeOps = await getVideoTranscodingOptions({
		inputTrack: track,
		outputContainer: container,
		rotate: 0,
	});
	ops.push(...reencodeOps);

	ops.push({ type: 'drop' });
	return ops;
}

async function getAudioTranscodingOptions(params: {
	inputTrack: InputAudioTrack;
	outputContainer: OutputFormat;
	sampleRate: number | null;
}): Promise<AudioOperation[]> {
	const { inputTrack, outputContainer, sampleRate } = params;

	if (inputTrack.codec === null) {
		return [];
	}

	if (!(await inputTrack.canDecode())) {
		return [];
	}

	const supportedCodecsByContainer = outputContainer.getSupportedAudioCodecs();
	const configs: AudioOperation[] = [];

	for (const codec of supportedCodecsByContainer) {
		const codecs = await getEncodableAudioCodecs([codec], {
			sampleRate: inputTrack.sampleRate,
		});

		if (codecs.includes(codec)) {
			configs.push({ type: 'reencode', audioCodec: codec, sampleRate });
		}
	}

	return configs;
}

async function getVideoTranscodingOptions(params: {
	inputTrack: InputVideoTrack;
	outputContainer: OutputFormat;
	rotate: number | null;
}): Promise<VideoOperation[]> {
	const { inputTrack, outputContainer, rotate } = params;

	if (inputTrack.codec === null) {
		return [];
	}

	if (!(await inputTrack.canDecode())) {
		return [];
	}

	const supportedCodecsByContainer = outputContainer.getSupportedVideoCodecs();
	const configs: VideoOperation[] = [];

	const needsToBeMultipleOfTwo = inputTrack.codec === 'avc';
	const width = needsToBeMultipleOfTwo ? toEven(inputTrack.displayWidth) : inputTrack.displayWidth;
	const height = needsToBeMultipleOfTwo ? toEven(inputTrack.displayHeight) : inputTrack.displayHeight;

	for (const codec of supportedCodecsByContainer) {
		const codecs = await getEncodableVideoCodecs([codec], {
			width,
			height,
		});

		if (codecs.includes(codec)) {
			configs.push({ type: 'reencode', videoCodec: codec, rotate: rotate ?? undefined });
		}
	}

	return configs;
}

function canCopyAudioTrack(params: {
	inputTrack: InputAudioTrack;
	outputContainer: OutputFormat;
	sampleRate: number | null;
}): boolean {
	const { inputTrack, outputContainer, sampleRate } = params;

	if (!inputTrack.codec) {
		return false;
	}

	if (sampleRate && inputTrack.sampleRate !== sampleRate) {
		return false;
	}

	return outputContainer.getSupportedCodecs().includes(inputTrack.codec);
}

function canCopyVideoTrack(params: {
	inputTrack: InputVideoTrack;
	rotationToApply: number;
	outputContainer: OutputFormat;
}): boolean {
	const { inputTrack, rotationToApply, outputContainer } = params;

	if (normalizeRotation(inputTrack.rotation) !== normalizeRotation(rotationToApply)) {
		return false;
	}

	if (!inputTrack.codec) {
		return false;
	}

	return outputContainer.getSupportedCodecs().includes(inputTrack.codec);
}

function selectVideoOperation(params: {
	operations: VideoOperation[];
	action: VideoTrackAction | undefined;
	requestedCodec: string | undefined;
}): VideoOperation {
	const { operations, action, requestedCodec } = params;

	if (!action) {
		return operations[0] ?? { type: 'drop' };
	}

	if (action.type === 'drop') {
		return { type: 'drop' };
	}

	if (action.type === 'fail') {
		return { type: 'fail' };
	}

	if (action.type === 'copy') {
		return operations.find((o) => o.type === 'copy') ?? firstVideoReencodeOrDrop(operations);
	}

	const wanted = action.codec ?? requestedCodec;
	const wantedRotate = (action as any).rotate;
	
	if (!wanted) {
		// 如果没有指定编码器，但指定了旋转，需要创建一个新的操作
		if (wantedRotate !== undefined) {
			const firstReencode = operations.find((o) => o.type === 'reencode');
			if (firstReencode && firstReencode.type === 'reencode') {
				return { type: 'reencode', videoCodec: firstReencode.videoCodec, rotate: wantedRotate };
			}
		}
		return firstVideoReencodeOrDrop(operations);
	}

	// 查找匹配编码器的操作
	const matched = operations.find((o) => o.type === 'reencode' && o.videoCodec === wanted);
	
	// 如果指定了旋转，需要创建一个新的操作或修改现有操作
	if (matched && matched.type === 'reencode') {
		if (wantedRotate !== undefined) {
			return { type: 'reencode', videoCodec: matched.videoCodec, rotate: wantedRotate };
		}
		return matched;
	}

	return firstVideoReencodeOrDrop(operations);
}

async function selectAudioOperation(params: {
	track: InputAudioTrack;
	index: number;
	operations: AudioOperation[];
	action: AudioTrackAction | undefined;
	requestedCodec: AudioCodec | undefined;
}): Promise<AudioOperation> {
	const { operations, action, requestedCodec } = params;

	if (!action) {
		return operations[0] ?? { type: 'drop' };
	}

	if (action.type === 'drop') {
		return { type: 'drop' };
	}

	if (action.type === 'fail') {
		return { type: 'fail' };
	}

	if (action.type === 'copy') {
		return operations.find((o) => o.type === 'copy') ?? firstAudioReencodeOrDrop(operations);
	}

	const wanted = action.codec ?? requestedCodec;
	if (!wanted) {
		return firstAudioReencodeOrDrop(operations);
	}

	return (
		operations.find((o) => o.type === 'reencode' && o.audioCodec === wanted) ??
		firstAudioReencodeOrDrop(operations)
	);
}

function firstAudioReencodeOrDrop(operations: AudioOperation[]): AudioOperation {
	return operations.find((o) => o.type === 'reencode') ?? { type: 'drop' };
}

function firstVideoReencodeOrDrop(operations: VideoOperation[]): VideoOperation {
	return operations.find((o) => o.type === 'reencode') ?? { type: 'drop' };
}

function audioOperationToMediabunny(params: {
	op: AudioOperation;
	audioBitrate?: number | Quality;
	audioSampleRate?: number;
}) {
	const { op, audioBitrate, audioSampleRate } = params;

	if (op.type === 'drop') {
		return { discard: true };
	}

	if (op.type === 'fail') {
		throw new Error('音频轨道无法处理');
	}

	if (op.type === 'copy') {
		return { forceTranscode: false };
	}

	const bitrate = audioBitrate;
	const sampleRate = audioSampleRate ?? op.sampleRate ?? undefined;
	return {
		forceTranscode: true,
		codec: op.audioCodec,
		...(bitrate !== undefined ? { bitrate } : null),
		...(sampleRate ? { sampleRate } : null),
	};
}

function videoOperationToMediabunny(params: {
	op: VideoOperation;
	videoBitrate?: number | Quality;
}) {
	const { op, videoBitrate } = params;

	if (op.type === 'drop') {
		return { discard: true };
	}

	if (op.type === 'fail') {
		throw new Error('视频轨道无法处理');
	}

	if (op.type === 'copy') {
		return { forceTranscode: false };
	}

	return {
		forceTranscode: true,
		codec: op.videoCodec as any,
		...(videoBitrate !== undefined ? { bitrate: videoBitrate } : null),
		...(op.rotate !== undefined ? { rotate: op.rotate } : null),
		keyFrameInterval: 2,
	};
}

function formatDiscardedTracksError(params: {
	container: ContainerFormat;
	supportedVideoCodecs: string[];
	supportedAudioCodecs: string[];
	discardedTracks: Array<{ reason: string; track: any }>;
}) {
	const { container, supportedVideoCodecs, supportedAudioCodecs, discardedTracks } = params;

	const reasons = discardedTracks.map((t) => {
		const type = t?.track?.type ?? 'unknown';
		const codec = t?.track?.codec ?? 'unknown';
		const reason = t?.reason ?? 'unknown';
		return `${type}编码器 "${codec}" 被丢弃：${reason}`;
	});

	const supported = `支持的编码器: 视频=${supportedVideoCodecs.join(', ') || '无'}, 音频=${supportedAudioCodecs.join(', ') || '无'}`;
	const header = `转换失败: ${container}`;

	return [header, ...reasons, supported].join('\n');
}

function clamp01(n: number) {
	if (Number.isNaN(n) || n < 0) {
		return 0;
	}
	if (n > 1) {
		return 1;
	}
	return n;
}

function throwIfAborted(controller: ConvertController) {
	if (controller.signal.aborted) {
		throw new Error('转换已取消');
	}
}

function normalizeRotation(rotation: number) {
	const r = rotation % 360;
	return r < 0 ? r + 360 : r;
}

function toEven(value: number) {
	return value % 2 === 0 ? value : value - 1;
}

function toOptionMap<T extends { trackId: number }>(options: T[]) {
	const map = new Map<number, T>();
	for (const o of options) {
		map.set(o.trackId, o);
	}
	return map;
}

function assertCanSatisfyOutput(params: {
	container: ContainerFormat;
	trackCounts: { video: { min: number; max: number }; audio: { min: number; max: number } };
	audioTrackOptions: AudioTrackOption[];
	videoTrackOptions: VideoTrackOption[];
}) {
	const { container, trackCounts, audioTrackOptions, videoTrackOptions } = params;

	const canMakeAudio = hasAnyOperation(audioTrackOptions, ['copy', 'reencode']);
	const canMakeVideo = hasAnyOperation(videoTrackOptions, ['copy', 'reencode']);

	if (trackCounts.audio.min > 0 && !canMakeAudio) {
		const inputAudio = uniq(audioTrackOptions.map((a) => a.audioCodec).filter(Boolean).map(String));
		throw new Error(
			[
				`无法输出 ${container.toUpperCase()}：当前环境无法生成任何音频轨道。`,
				`原因：输入音频轨道编码=${inputAudio.join(', ') || 'unknown'}，但没有可用的 copy/reencode 方案。`,
				`建议：`,
				`- 如果要输出 MP3：请确保已注册 @mediabunny/mp3-encoder（或浏览器原生支持 MP3 编码，或输入音轨本身就是 MP3 可直接复制）。`,
				`- 否则请改用 WAV/FLAC/OGG/ADTS 等输出格式。`,
			].join('\n'),
		);
	}

	if (trackCounts.video.min > 0 && !canMakeVideo) {
		throw new Error(
			`无法输出 ${container.toUpperCase()}：当前环境无法生成任何视频轨道（没有可用的 copy/reencode 方案）。`,
		);
	}
}

function hasAnyOperation(options: Array<{ operations: Array<{ type: string }> }>, allowed: readonly string[]) {
	for (const opt of options) {
		for (const op of opt.operations) {
			if (allowed.includes(op.type)) {
				return true;
			}
		}
	}
	return false;
}

function uniq(values: string[]) {
	const set = new Set(values);
	return Array.from(set);
}
