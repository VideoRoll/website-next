import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Loader2, Download, X, FileVideo, FileAudio } from 'lucide-react';
import { saveAs } from 'file-saver';
import {
  convertMedia,
  createConvertController,
  getSupportedAudioCodecs,
  getSupportedTrackCounts,
  getSupportedVideoCodecs,
  type ContainerFormat,
  type ConvertController,
  type ConvertProgress,
  DEFAULT_CONTAINERS,
} from '@/lib/convert/Convert';

type AudioTrackMode = 'default' | 'copy' | 'first-only';

export function ConvertPage() {
  const { t } = useTranslation();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [sourceFile, setSourceFile] = React.useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = React.useState<string>('');
  const [container, setContainer] = React.useState<ContainerFormat>('mp4');
  const [supportsVideo, setSupportsVideo] = React.useState(true);

  const [videoCodecs, setVideoCodecs] = React.useState<string[]>([]);
  const [audioCodecs, setAudioCodecs] = React.useState<string[]>([]);
  const [selectedVideoCodec, setSelectedVideoCodec] = React.useState<string | null>(null);
  const [selectedAudioCodec, setSelectedAudioCodec] = React.useState<string | null>(null);

  const [videoBitrate, setVideoBitrate] = React.useState<number>(2_500_000);
  const [audioBitrate, setAudioBitrate] = React.useState<number>(192_000);
  const [audioSampleRate, setAudioSampleRate] = React.useState<number | null>(null);

  const [audioTrackMode, setAudioTrackMode] = React.useState<AudioTrackMode>('default');

  const [controller, setController] = React.useState<ConvertController | null>(null);
  const [progress, setProgress] = React.useState<ConvertProgress>({
    stage: 'idle',
    fraction: 0,
    message: '',
  });

  const [outputBlob, setOutputBlob] = React.useState<Blob | null>(null);
  const [outputName, setOutputName] = React.useState<string>('');

  const [logs, setLogs] = React.useState<
    Array<{ level: 'info' | 'warn' | 'error'; message: string; time: Date }>
  >([]);

  const canConvert = React.useMemo(() => {
    return !!sourceFile && progress.stage !== 'converting' && progress.stage !== 'preparing';
  }, [sourceFile, progress.stage]);

  const isConverting = React.useMemo(() => {
    return progress.stage === 'preparing' || progress.stage === 'converting';
  }, [progress.stage]);

  const progressValue = React.useMemo(() => Math.round(progress.fraction * 100), [progress.fraction]);

  const logText = React.useMemo(
    () =>
      logs
        .map((item) => {
          const time = item.time.toLocaleTimeString();
          const prefix = item.level.toUpperCase();
          return `[${time}] ${prefix} ${item.message}`;
        })
        .join('\n'),
    [logs]
  );

  const addLog = React.useCallback((level: 'info' | 'warn' | 'error', message: string) => {
    setLogs((prev) => [...prev, { level, message, time: new Date() }]);
  }, []);

  const clearOutput = React.useCallback(() => {
    setOutputBlob(null);
    setOutputName('');
  }, []);

  const revokeSourceUrl = React.useCallback(() => {
    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
      setSourceUrl('');
    }
  }, [sourceUrl]);

  const setSourceFileHandler = React.useCallback(
    (file: File) => {
      clearOutput();
      revokeSourceUrl();
      setSourceFile(file);
      setSourceUrl(URL.createObjectURL(file));
      addLog('info', `已选择文件: ${file.name} (${Math.round(file.size / 1024)} KB)`);
    },
    [clearOutput, revokeSourceUrl, addLog]
  );

  const onPickFile = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setSourceFileHandler(file);
      if (e.target) e.target.value = '';
    },
    [setSourceFileHandler]
  );

  const loadCodecOptions = React.useCallback(
    async (nextContainer: ContainerFormat) => {
      try {
        const counts = await getSupportedTrackCounts(nextContainer);
        setSupportsVideo(counts.video.max > 0);

        const [a, v] = await Promise.all([
          getSupportedAudioCodecs(nextContainer),
          counts.video.max > 0 ? getSupportedVideoCodecs(nextContainer) : Promise.resolve([]),
        ]);

        setAudioCodecs(a);
        setVideoCodecs(v);
        setSelectedAudioCodec(a[0] ?? null);
        setSelectedVideoCodec(v[0] ?? null);

        addLog('info', `已加载编码器: container=${nextContainer}, audio=[${a.join(', ')}], video=[${v.join(', ')}]`);
      } catch (err) {
        addLog('error', `加载编码器失败: ${err instanceof Error ? err.message : String(err)}`);
      }
    },
    [addLog]
  );

  React.useEffect(() => {
    clearOutput();
    loadCodecOptions(container).catch(console.error);
  }, [container, clearOutput, loadCodecOptions]);

  React.useEffect(() => {
    return () => {
      revokeSourceUrl();
    };
  }, [revokeSourceUrl]);

  const buildOnAudioTrack = React.useCallback(() => {
    if (audioTrackMode === 'default') return undefined;

    return (track: any, index: number) => {
      const codec = (selectedAudioCodec ?? undefined) as any;

      if (audioTrackMode === 'copy') {
        if (track?.codec === codec) {
          return { type: 'copy' } as const;
        }
        return {
          type: 'reencode',
          codec,
          bitrate: audioBitrate,
          ...(audioSampleRate ? { sampleRate: audioSampleRate } : null),
        } as const;
      }

      if (audioTrackMode === 'first-only') {
        if (index > 0) return { type: 'drop' } as const;
        return {
          type: 'reencode',
          codec,
          bitrate: audioBitrate,
          ...(audioSampleRate ? { sampleRate: audioSampleRate } : null),
        } as const;
      }

      return undefined;
    };
  }, [audioTrackMode, selectedAudioCodec, audioBitrate, audioSampleRate]);

  const onConvert = React.useCallback(async () => {
    const file = sourceFile;
    if (!file) return;

    clearOutput();
    setLogs([]);

    const c = createConvertController();
    setController(c);

    const videoCodec = supportsVideo ? (selectedVideoCodec ?? undefined) : undefined;
    const audioCodec = selectedAudioCodec ?? undefined;

    addLog('info', `开始转换: ${file.name} -> ${container.toUpperCase()}`);
    if (supportsVideo && videoCodec) {
      addLog('info', `视频编码器: ${String(videoCodec)}, 视频码率: ${Math.round(videoBitrate / 1000)} kbps`);
    }
    if (audioCodec) {
      addLog('info', `音频编码器: ${String(audioCodec)}, 音频码率: ${Math.round(audioBitrate / 1000)} kbps`);
    }

    const onAudioTrack = buildOnAudioTrack();

    try {
      const blob = await convertMedia({
        src: file,
        container: container,
        videoCodec: videoCodec as any,
        audioCodec: audioCodec as any,
        videoBitrate: supportsVideo ? videoBitrate : undefined,
        audioBitrate: audioBitrate,
        audioSampleRate: audioSampleRate ?? undefined,
        controller: c,
        onProgress: (p) => setProgress(p),
        onAudioTrack,
      });

      setOutputBlob(blob);
      const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name;
      const newOutputName = `${baseName}.${container}`;
      setOutputName(newOutputName);
      addLog('info', `转换完成: ${newOutputName} (${Math.round(blob.size / 1024)} KB)`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setProgress({ stage: 'error', fraction: 0, message });
      addLog('error', message);
    }
  }, [
    sourceFile,
    clearOutput,
    supportsVideo,
    selectedVideoCodec,
    selectedAudioCodec,
    container,
    videoBitrate,
    audioBitrate,
    audioSampleRate,
    buildOnAudioTrack,
    addLog,
  ]);

  const onCancel = React.useCallback(() => {
    controller?.cancel();
    addLog('warn', '已请求取消');
  }, [controller, addLog]);

  const onDownload = React.useCallback(() => {
    if (!outputBlob) return;
    const name = outputName || `output.${container}`;
    saveAs(outputBlob, name);
    addLog('info', `已保存: ${name}`);
  }, [outputBlob, outputName, container, addLog]);

  const containerOptions = DEFAULT_CONTAINERS.map((c) => ({
    label: c.toUpperCase(),
    value: c,
  }));

  const audioTrackModeOptions = [
    { label: '默认', value: 'default' as const },
    { label: '智能复制', value: 'copy' as const },
    { label: '仅第一条', value: 'first-only' as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('tools.convert.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('tools.convert.description')}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>选择文件</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*,audio/*"
                className="hidden"
                onChange={onFileChange}
              />
              <div className="flex gap-2">
                <Button onClick={onPickFile}>选择文件</Button>
                <Button
                  variant="outline"
                  disabled={!sourceFile}
                  onClick={() => {
                    setSourceFile(null);
                    clearOutput();
                    revokeSourceUrl();
                    setLogs([]);
                    setProgress({ stage: 'idle', fraction: 0, message: '' });
                  }}
                >
                  <X className="h-4 w-4 mr-2" />
                  清除
                </Button>
              </div>

              {sourceFile ? (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    {sourceFile.type.startsWith('video/') ? (
                      <FileVideo className="h-4 w-4" />
                    ) : (
                      <FileAudio className="h-4 w-4" />
                    )}
                    <span>文件: {sourceFile.name}</span>
                  </div>
                  <div>大小: {Math.round(sourceFile.size / 1024)} KB</div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">请选择一个视频或音频文件。</div>
              )}

              {sourceUrl && (
                <div className="rounded-lg overflow-hidden">
                  {sourceFile?.type.startsWith('video/') ? (
                    <video className="w-full max-h-64 rounded" controls src={sourceUrl} />
                  ) : (
                    <audio className="w-full" controls src={sourceUrl} />
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>进度</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm text-muted-foreground">{progress.message || '—'}</div>
              <Progress value={progressValue} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>转换设置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">输出容器</label>
                  <Select value={container} onValueChange={(v) => setContainer(v as ContainerFormat)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {containerOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">音频轨道策略</label>
                  <Select
                    value={audioTrackMode}
                    onValueChange={(v) => setAudioTrackMode(v as AudioTrackMode)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {audioTrackModeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">音频编码器</label>
                  <Select
                    value={selectedAudioCodec ?? ''}
                    onValueChange={(v) => setSelectedAudioCodec(v || null)}
                    disabled={audioCodecs.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="选择编码器" />
                    </SelectTrigger>
                    <SelectContent>
                      {audioCodecs.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">音频码率 (bps)</label>
                  <Input
                    type="number"
                    value={audioBitrate}
                    onChange={(e) => setAudioBitrate(Number(e.target.value) || 0)}
                    min={32000}
                    step={16000}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">音频采样率 (Hz，可选)</label>
                  <Input
                    type="number"
                    value={audioSampleRate ?? ''}
                    onChange={(e) => setAudioSampleRate(e.target.value ? Number(e.target.value) : null)}
                    min={8000}
                    step={1000}
                    placeholder="留空=自动"
                  />
                </div>
              </div>

              {supportsVideo && (
                <>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">视频编码器</label>
                      <Select
                        value={selectedVideoCodec ?? ''}
                        onValueChange={(v) => setSelectedVideoCodec(v || null)}
                        disabled={videoCodecs.length === 0}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择编码器" />
                        </SelectTrigger>
                        <SelectContent>
                          {videoCodecs.map((c) => (
                            <SelectItem key={c} value={c}>
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">视频码率 (bps)</label>
                      <Input
                        type="number"
                        value={videoBitrate}
                        onChange={(e) => setVideoBitrate(Number(e.target.value) || 0)}
                        min={200000}
                        step={100000}
                      />
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div className="flex gap-2">
                <Button disabled={!canConvert} onClick={onConvert}>
                  {isConverting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      转换中…
                    </>
                  ) : (
                    '开始转换'
                  )}
                </Button>
                <Button variant="outline" disabled={!isConverting} onClick={onCancel}>
                  取消
                </Button>
                <Button variant="outline" disabled={!outputBlob} onClick={onDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  下载
                </Button>
              </div>

              {outputName && <div className="text-sm text-muted-foreground">输出文件: {outputName}</div>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>日志</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea value={logText} rows={10} className="w-full font-mono text-xs" readOnly />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
