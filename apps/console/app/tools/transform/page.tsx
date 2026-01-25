"use client";

import * as React from "react";
import { useTranslations, useLocale } from "@/contexts/I18nContext";
import { useUser } from "@/contexts/UserContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Download,
  X,
  FileVideo,
  FileText,
  RotateCw,
} from "lucide-react";
import { saveAs } from "file-saver";
import {
  convertMedia,
  createConvertController,
  getSupportedVideoCodecs,
  type ContainerFormat,
  type ConvertController,
  type ConvertProgress,
  DEFAULT_CONTAINERS,
} from "@/lib/convert/Convert";

type Rotation = 0 | 90 | 180 | 270;

// 文件大小限制：未登录 200MB，已登录 2GB
const MAX_FILE_SIZE_GUEST = 200 * 1024 * 1024; // 200MB
const MAX_FILE_SIZE_LOGGED_IN = 2 * 1024 * 1024 * 1024; // 2GB

export default function TransformPage() {
  const t = useTranslations("tools.transform");
  const locale = useLocale();
  const { currentUser } = useUser();
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [sourceFile, setSourceFile] = React.useState<File | null>(null);
  const [sourceUrl, setSourceUrl] = React.useState<string>("");
  const [previewUrl, setPreviewUrl] = React.useState<string>("");
  const [container, setContainer] = React.useState<ContainerFormat>("mp4");
  const [rotation, setRotation] = React.useState<Rotation>(0);

  const [videoCodecs, setVideoCodecs] = React.useState<string[]>([]);
  const [selectedVideoCodec, setSelectedVideoCodec] = React.useState<
    string | null
  >(null);
  const [videoBitrate, setVideoBitrate] = React.useState<number>(2_500_000);

  const [controller, setController] = React.useState<ConvertController | null>(
    null
  );
  const [progress, setProgress] = React.useState<ConvertProgress>({
    stage: "idle",
    fraction: 0,
    message: "",
  });

  const [outputBlob, setOutputBlob] = React.useState<Blob | null>(null);
  const [outputName, setOutputName] = React.useState<string>("");

  const [logs, setLogs] = React.useState<
    Array<{ level: "info" | "warn" | "error"; message: string; time: Date }>
  >([]);
  const [isLogsDialogOpen, setIsLogsDialogOpen] = React.useState(false);

  const canTransform = React.useMemo(() => {
    return (
      !!sourceFile &&
      progress.stage !== "converting" &&
      progress.stage !== "preparing"
    );
  }, [sourceFile, progress.stage]);

  const isTransforming = React.useMemo(() => {
    return progress.stage === "preparing" || progress.stage === "converting";
  }, [progress.stage]);

  const hasError = React.useMemo(() => {
    return (
      progress.stage === "error" || logs.some((log) => log.level === "error")
    );
  }, [progress.stage, logs]);

  const progressValue = React.useMemo(
    () => Math.round(progress.fraction * 100),
    [progress.fraction]
  );

  const logText = React.useMemo(
    () =>
      logs
        .map((item) => {
          const t = item.time.toLocaleTimeString();
          const prefix = item.level.toUpperCase();
          return `[${t}] ${prefix} ${item.message}`;
        })
        .join("\n"),
    [logs]
  );

  const addLog = React.useCallback(
    (level: "info" | "warn" | "error", message: string) => {
      setLogs((prev) => [...prev, { level, message, time: new Date() }]);
    },
    []
  );

  const clearOutput = React.useCallback(() => {
    setOutputBlob(null);
    setOutputName("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
  }, [previewUrl]);

  const revokeSourceUrl = React.useCallback(() => {
    if (sourceUrl) {
      URL.revokeObjectURL(sourceUrl);
      setSourceUrl("");
    }
  }, [sourceUrl]);

  const maxFileSize = React.useMemo(() => {
    return currentUser ? MAX_FILE_SIZE_LOGGED_IN : MAX_FILE_SIZE_GUEST;
  }, [currentUser]);

  const formatFileSize = React.useCallback((bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
  }, []);

  const validateFileSize = React.useCallback(
    (file: File): boolean => {
      if (file.size > maxFileSize) {
        addLog(
          "error",
          `${t("fileTooLarge")}: ${file.name} (${formatFileSize(file.size)}) > ${formatFileSize(maxFileSize)}`
        );
        return false;
      }
      return true;
    },
    [maxFileSize, formatFileSize, addLog, t]
  );

  const setSourceFileHandler = React.useCallback(
    (file: File) => {
      if (!validateFileSize(file)) {
        return;
      }
      clearOutput();
      revokeSourceUrl();
      setSourceFile(file);
      setSourceUrl(URL.createObjectURL(file));
      addLog(
        "info",
        `${t("logMessages.fileSelected")}: ${file.name} (${formatFileSize(file.size)})`
      );
    },
    [clearOutput, revokeSourceUrl, addLog, t, validateFileSize, formatFileSize]
  );

  const onPickFile = React.useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const onFileChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) {
        return;
      }
      setSourceFileHandler(file);
      if (e.target) {
        e.target.value = "";
      }
    },
    [setSourceFileHandler]
  );

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        setSourceFileHandler(file);
      }
    },
    [setSourceFileHandler]
  );

  const loadCodecOptions = React.useCallback(
    async (nextContainer: ContainerFormat) => {
      try {
        const v = await getSupportedVideoCodecs(nextContainer);
        setVideoCodecs(v);
        setSelectedVideoCodec(v[0] ?? null);
        addLog(
          "info",
          `${t(
            "logMessages.codecLoaded"
          )}: container=${nextContainer}, video=[${v.join(", ")}]`
        );
      } catch (err) {
        addLog(
          "error",
          `${t("logMessages.codecLoadFailed")}: ${
            err instanceof Error ? err.message : String(err)
          }`
        );
      }
    },
    [addLog, t]
  );

  React.useEffect(() => {
    // 容器改变时，只重新加载编码器选项，不清除输出和预览
    loadCodecOptions(container).catch(console.error);
  }, [container, loadCodecOptions]);

  React.useEffect(() => {
    return () => {
      revokeSourceUrl();
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [revokeSourceUrl, previewUrl]);

  // 更新预览 URL（应用 CSS 变换）
  React.useEffect(() => {
    if (outputBlob) {
      const url = URL.createObjectURL(outputBlob);
      setPreviewUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      // 如果没有输出，清除预览 URL，但保留原始 sourceUrl
      setPreviewUrl("");
    }
  }, [outputBlob]);

  // 计算旋转角度
  const getEffectiveRotation = React.useCallback((): number => {
    return rotation;
  }, [rotation]);

  // 获取 CSS 变换样式（仅用于原始视频预览，转换后的视频不需要）
  const getPreviewTransform = React.useCallback((): string => {
    if (rotation !== 0) {
      return `rotate(${rotation}deg)`;
    }
    return "none";
  }, [rotation]);

  const onTransform = React.useCallback(async () => {
    const file = sourceFile;
    if (!file) {
      return;
    }

    // 转换开始时，只清除之前的输出，保留原始文件预览
    setOutputBlob(null);
    setOutputName("");
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
    }
    setLogs([]);

    const c = createConvertController();
    setController(c);

    const videoCodec = selectedVideoCodec ?? undefined;
    const effectiveRotation = getEffectiveRotation();

    addLog(
      "info",
      `${t("logMessages.transformationStarted")}: ${
        file.name
      } -> ${container.toUpperCase()}`
    );
    if (videoCodec) {
      addLog(
        "info",
        `${t("logMessages.videoCodecInfo")}: ${String(videoCodec)}, ${t(
          "logMessages.videoBitrateInfo"
        )}: ${Math.round(videoBitrate / 1000)} kbps`
      );
    }
    if (rotation !== 0) {
      addLog("info", `${t("logMessages.rotationInfo")}: ${rotation}°`);
    }

    try {
      // 使用 mediaBunny 进行视频旋转转换
      const blob = await convertMedia({
        src: file,
        container: container,
        videoCodec: videoCodec as any,
        videoBitrate: videoBitrate,
        controller: c,
        onProgress: (p) => {
          setProgress(p);
        },
        onVideoTrack: (track, index) => {
          // 应用旋转
          if (effectiveRotation !== 0) {
            return {
              type: "reencode",
              codec: videoCodec,
              rotate: effectiveRotation,
            } as any;
          }
          return {
            type: "reencode",
            codec: videoCodec,
          } as any;
        },
        onAudioTrack: () => {
          // 保持音频轨道不变
          return { type: "copy" } as any;
        },
      });

      // 确保转换完成
      if (!blob || blob.size === 0) {
        throw new Error(t("logMessages.transformationFailed"));
      }

      const baseName =
        file.name.substring(0, file.name.lastIndexOf(".")) || file.name;
      const newOutputName = `${baseName}_transformed.${container}`;

      // 设置输出文件
      setOutputBlob(blob);
      setOutputName(newOutputName);
      setProgress({
        stage: "completed",
        fraction: 1,
        message: t("logMessages.transformationCompleted"),
      });
      addLog(
        "info",
        `${t(
          "logMessages.transformationCompleted"
        )}: ${newOutputName} (${Math.round(blob.size / 1024)} KB)`
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setProgress({ stage: "error", fraction: 0, message });
      addLog("error", message);
      // 确保在错误时清除输出
      setOutputBlob(null);
      setOutputName("");
    }
  }, [
    sourceFile,
    previewUrl,
    selectedVideoCodec,
    getEffectiveRotation,
    addLog,
    t,
    container,
    rotation,
    videoBitrate,
  ]);

  const onCancel = React.useCallback(() => {
    controller?.cancel();
    addLog("warn", t("logMessages.cancelRequested"));
    // 重置状态（但保留已选文件）
    setController(null);
    setProgress({ stage: "idle", fraction: 0, message: "" });
    clearOutput();
  }, [controller, addLog, t, clearOutput]);

  const onDownload = React.useCallback(() => {
    if (!outputBlob) {
      return;
    }
    const name = outputName || `output.${container}`;
    saveAs(outputBlob, name);
    addLog("info", `${t("logMessages.fileSaved")}: ${name}`);
  }, [outputBlob, outputName, container, addLog, t]);

  const containerOptions = DEFAULT_CONTAINERS.filter((c) =>
    ["mp4", "webm", "mkv", "mov"].includes(c)
  ).map((c) => ({
    label: c.toUpperCase(),
    value: c,
  }));

  const rotationOptions: { label: string; value: Rotation }[] = [
    { label: t("rotations.0"), value: 0 },
    { label: t("rotations.90"), value: 90 },
    { label: t("rotations.180"), value: 180 },
    { label: t("rotations.270"), value: 270 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground mt-2">{t("description")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：文件选择和预览 */}
        <div className="space-y-6">
          {/* 上部分：选择文件和文件信息 */}
          <Card>
            <CardHeader>
              <CardTitle>{t("selectFile")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={onFileChange}
              />
              
              {/* 拖拽上传区域或文件按钮 */}
              {sourceFile ? (
                <div className="w-full border border-border rounded-lg p-3 px-4 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileVideo className="h-4 w-4 flex-shrink-0" />
                    <span className="font-medium truncate">{sourceFile.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSourceFile(null);
                      clearOutput();
                      revokeSourceUrl();
                      setLogs([]);
                      setProgress({ stage: "idle", fraction: 0, message: "" });
                    }}
                    className="flex-shrink-0 p-1 hover:bg-accent rounded transition-colors"
                    aria-label={t("clear")}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={onPickFile}
                  className={`
                    border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                    transition-colors
                    ${isDragging 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-accent/50"
                    }
                  `}
                >
                  <FileVideo className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm font-medium mb-2">{t("dragAndDrop")}</p>
                  <p className="text-xs text-muted-foreground mb-1">
                    {t("supportedFormats")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t("fileSizeLimit")} {formatFileSize(maxFileSize)}
                  </p>
                  {!currentUser && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {t("loginForLarger")}{" "}
                      <button
                        type="button"
                        className="h-auto p-0 text-primary underline bg-transparent border-0 cursor-pointer hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          const isDevelopment = process.env.NODE_ENV === 'development';
                          if (isDevelopment) {
                            window.location.href = `http://localhost:3001/${locale}/signin`;
                          } else {
                            window.location.href = `${window.location.origin}/${locale}/signin`;
                          }
                        }}
                      >
                        {t("login")}
                      </button>
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 下部分：视频预览 */}
          {(sourceUrl || previewUrl) && (
            <Card>
              <CardContent className="p-0">
                <div className="rounded-lg overflow-hidden">
                  <video
                    className="w-full h-auto rounded"
                    controls
                    src={previewUrl || sourceUrl}
                    style={{
                      // 转换后的视频不需要 CSS 变换，因为变换已经应用在视频本身
                      transform: previewUrl ? 'none' : getPreviewTransform(),
                    }}
                    key={previewUrl || sourceUrl}
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("transformSettings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("outputContainer")}
                  </label>
                  <Select
                    value={container}
                    onValueChange={(v) =>
                      setContainer(v as ContainerFormat)
                    }
                  >
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
                  <label className="text-sm font-medium">
                    {t("videoCodec")}
                  </label>
                  <Select
                    value={selectedVideoCodec ?? ""}
                    onValueChange={(v) =>
                      setSelectedVideoCodec(v || null)
                    }
                    disabled={videoCodecs.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("selectCodec")} />
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
                  <label className="text-sm font-medium">{t("rotation")}</label>
                  <Select
                    value={rotation.toString()}
                    onValueChange={(v) => setRotation(Number(v) as Rotation)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {rotationOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value.toString()}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    {t("videoBitrate")}
                  </label>
                  <Input
                    type="number"
                    value={videoBitrate}
                    onChange={(e) =>
                      setVideoBitrate(Number(e.target.value) || 0)
                    }
                    min={200000}
                    step={100000}
                  />
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button disabled={!canTransform} onClick={onTransform}>
                  {isTransforming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("transforming")}
                    </>
                  ) : (
                    t("startTransform")
                  )}
                </Button>
                <Button
                  variant="outline"
                  disabled={!isTransforming}
                  onClick={onCancel}
                >
                  {t("cancel")}
                </Button>
                <Button
                  variant="outline"
                  disabled={!outputBlob}
                  onClick={onDownload}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("download")}
                </Button>
              </div>

              {outputName && (
                <div className="text-sm text-muted-foreground">
                  {t("outputFile")}: {outputName}
                </div>
              )}

              {/* 进度展示（转换完成后也显示，仅在 idle 或 error 时隐藏） */}
              {sourceFile &&
                progress.stage !== "idle" &&
                progress.stage !== "error" && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {t("progress")}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {progressValue}%
                        </span>
                      </div>
                      <Progress value={progressValue} />
                      {progress.message && (
                        <div className="text-sm text-muted-foreground">
                          {progress.message}
                        </div>
                      )}
                    </div>
                  </>
                )}

              {/* 日志按钮 */}
              {logs.length > 0 && (
                <>
                  <Separator />
                  <Button
                    variant="outline"
                    onClick={() => setIsLogsDialogOpen(true)}
                    className="w-full justify-start"
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    <span className="flex-1 text-left">{t("viewLogs")}</span>
                    {hasError && (
                      <Badge
                        variant="destructive"
                        className="ml-auto h-5 w-5 p-0 flex items-center justify-center"
                      >
                        !
                      </Badge>
                    )}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 日志弹窗 */}
      <Dialog open={isLogsDialogOpen} onOpenChange={setIsLogsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t("logs")}</DialogTitle>
          </DialogHeader>
          <div className="overflow-auto">
            <Textarea
              value={logText}
              rows={15}
              className="w-full font-mono text-xs"
              readOnly
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
