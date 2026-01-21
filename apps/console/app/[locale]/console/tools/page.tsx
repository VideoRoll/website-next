'use client';

import * as React from 'react';
import { useRouter } from '@/i18n/navigation';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, Music, ArrowRight } from 'lucide-react';

type ToolCategory = 'video' | 'audio';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: ToolCategory;
  route: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  {
    id: 'convert',
    name: '格式转换',
    description: '转换视频和音频文件格式，支持 MP4、WebM、MKV、MOV、MP3、WAV、FLAC 等格式',
    category: 'video',
    route: '/console/tools/convert',
    icon: <Video className="h-6 w-6" />,
  },
];

const categoryLabels: Record<ToolCategory, string> = {
  video: '视频工具',
  audio: '音频工具',
};

export default function ToolsPage() {
  const router = useRouter();
  const t = useTranslations('tools');

  const videoTools = tools.filter((tool) => tool.category === 'video');
  const audioTools = tools.filter((tool) => tool.category === 'audio');

  const handleToolClick = (route: string) => {
    router.push(route as "/tools" | "/tools/convert");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title') || '工具'}</h1>
        <p className="text-muted-foreground mt-2">
          {t('description') || '各种实用的视频和音频处理工具'}
        </p>
      </div>

      {videoTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{categoryLabels.video}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videoTools.map((tool) => (
              <Card
                key={tool.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                onClick={() => handleToolClick(tool.route)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {audioTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{categoryLabels.audio}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {audioTools.map((tool) => (
              <Card
                key={tool.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                onClick={() => handleToolClick(tool.route)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-primary/10 p-2 text-primary">
                      {tool.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{tool.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {tools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">暂无可用工具</p>
        </div>
      )}
    </div>
  );
}
