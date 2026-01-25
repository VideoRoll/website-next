'use client';

import * as React from 'react';
import { useTranslations } from '@/contexts/I18nContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ExternalLink, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface VideoResult {
  title: string;
  url: string;
  thumbnail?: string;
  description?: string;
  duration?: string;
}

export default function BrowsePage() {
  const t = useTranslations('tools.browse');
  const [videos, setVideos] = React.useState<VideoResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  const fetchVideos = React.useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/tools/browse?q=trending videos');
      
      // 检查响应内容类型
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch videos');
      }
      
      setVideos(data.results || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch videos';
      setError(errorMessage);
      setVideos([]);
      console.error('Error fetching videos:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleOpenVideo = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('description')}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={fetchVideos}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {t('refresh')}
        </Button>
      </div>

      {isLoading && videos.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={fetchVideos} variant="outline">
            {t('retry')}
          </Button>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('noVideos')}</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {videos.map((video, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted relative">
                {video.thumbnail ? (
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <ExternalLink className="h-12 w-12" />
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-base">{video.title}</CardTitle>
                {video.description && (
                  <CardDescription className="line-clamp-2">
                    {video.description}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => handleOpenVideo(video.url)}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t('watchVideo')}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
