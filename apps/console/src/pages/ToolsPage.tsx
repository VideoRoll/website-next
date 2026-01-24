import * as React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, ArrowRight } from 'lucide-react';

type ToolCategory = 'video' | 'audio';

interface Tool {
  id: string;
  nameKey: string;
  descriptionKey: string;
  category: ToolCategory;
  route: string;
  icon: React.ReactNode;
}

const tools: Tool[] = [
  {
    id: 'convert',
    nameKey: 'tools.convert.title',
    descriptionKey: 'tools.convert.description',
    category: 'video',
    route: '/tools/convert',
    icon: <Video className="h-6 w-6" />,
  },
];

export function ToolsPage() {
  const { t } = useTranslation();

  const videoTools = tools.filter((tool) => tool.category === 'video');
  const audioTools = tools.filter((tool) => tool.category === 'audio');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('tools.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('tools.description')}</p>
      </div>

      {videoTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{t('common.modules.tools')}</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {videoTools.map((tool) => (
              <Link key={tool.id} to={tool.route}>
                <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{t(tool.nameKey)}</CardTitle>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{t(tool.descriptionKey)}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {audioTools.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">音频工具</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {audioTools.map((tool) => (
              <Link key={tool.id} to={tool.route}>
                <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2 text-primary">
                        {tool.icon}
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{t(tool.nameKey)}</CardTitle>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>{t(tool.descriptionKey)}</CardDescription>
                  </CardContent>
                </Card>
              </Link>
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
