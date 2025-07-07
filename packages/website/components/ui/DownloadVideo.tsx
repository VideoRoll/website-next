'use client'

import { IconExternalLink, IconDownload, IconWorld, IconChevronRight } from '@tabler/icons-react'
import { Button } from '@heroui/react'
import { useTranslations, useLocale } from 'next-intl'
import CanvasStar from './CanvasStar'

interface VideoDownloadSite {
  id: string
  name: string
  url: string
  supportedSites: string[]
  category: 'general' | 'social' | 'professional'
}

const videoDownloadSites: VideoDownloadSite[] = [
  {
    id: 'snapany',
    name: 'SnapAny',
    url: 'https://snapany.com',
    supportedSites: ['YouTube', 'TikTok', 'Instagram', 'Twitter', 'Facebook', 'Dailymotion'],
    category: 'general'
  },
  {
    id: 'cobalt',
    name: 'Cobalt',
    url: 'https://cobalt.tools',
    supportedSites: ['YouTube', 'TikTok', 'Twitter', 'Instagram', 'SoundCloud', 'Reddit'],
    category: 'general'
  },
  {
    id: 'yt-dlp',
    name: 'yt-dlp',
    url: 'https://github.com/yt-dlp/yt-dlp',
    supportedSites: ['YouTube', 'Bilibili', 'Twitter', 'TikTok', 'Instagram', 'Facebook', 'Vimeo', 'Twitch'],
    category: 'professional'
  },
  {
    id: 'y2mate',
    name: 'Y2mate',
    url: 'https://www.y2mate.com',
    supportedSites: ['YouTube', 'Facebook', 'Video', 'Dailymotion', 'Youku'],
    category: 'general'
  },
  {
    id: 'savefrom',
    name: 'SaveFrom.net',
    url: 'https://savefrom.net',
    supportedSites: ['YouTube', 'TikTok', 'Facebook', 'Instagram', 'Twitter', 'Vimeo'],
    category: 'general'
  },
  {
    id: 'snaptube',
    name: 'SnapTube',
    url: 'https://www.snaptube.com',
    supportedSites: ['YouTube', 'Instagram', 'Facebook', 'WhatsApp', 'TikTok', 'Twitter'],
    category: 'social'
  },
  {
    id: 'clipgrab',
    name: 'ClipGrab',
    url: 'https://clipgrab.org',
    supportedSites: ['YouTube', 'Vimeo', 'Dailymotion', 'MyVideo'],
    category: 'professional'
  },
  {
    id: '4k-downloader',
    name: '4K Video Downloader',
    url: 'https://www.4kdownload.com',
    supportedSites: ['YouTube', 'TikTok', 'Instagram', 'Facebook', 'Vimeo', 'SoundCloud'],
    category: 'professional'
  },
  {
    id: 'online-video-converter',
    name: 'Online Video Converter',
    url: 'https://www.onlinevideoconverter.com',
    supportedSites: ['YouTube', 'Dailymotion', 'Clipfish', 'Vimeo'],
    category: 'general'
  },
  {
    id: 'tubemate',
    name: 'TubeMate',
    url: 'https://tubemate.net',
    supportedSites: ['YouTube', 'Facebook', 'Instagram', 'TikTok', 'WhatsApp'],
    category: 'social'
  },
  {
    id: 'videoproc',
    name: 'VideoProc',
    url: 'https://www.videoproc.com',
    supportedSites: ['YouTube', 'Facebook', 'Vimeo', 'Instagram', 'Dailymotion'],
    category: 'professional'
  }
]

const categoryColors = {
  general: 'from-blue-500 to-blue-600',
  social: 'from-pink-500 to-rose-500',
  professional: 'from-purple-500 to-indigo-600'
}

export default function DownloadVideo() {
  const t = useTranslations('downloadVideo')
  const locale = useLocale()

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + '...'
  }

  const formatSupportedSites = (sites: string[], maxDisplay: number = 3) => {
    if (sites.length <= maxDisplay) {
      return sites.join('、')
    }
    return sites.slice(0, maxDisplay).join('、') + '...'
  }

  return (
    <div className="min-h-screen">
    <CanvasStar></CanvasStar>
      {/* Header */}
      <div className="shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center mb-4">
              <IconDownload className="h-12 w-12 text-indigo-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">
                {t('title')}
              </h1>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t('description')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoDownloadSites.map((site) => (
            <div
              key={site.id}
              className="bg-gray-800 overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 border border-gray-700"
            >
              {/* Card Header */}
              <div className={`h-2 bg-gradient-to-r ${categoryColors[site.category]}`} />
              
              <div className="px-4 py-5 sm:p-6">
                {/* Title and Category */}
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-white">
                      {site.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-700 text-gray-300 mt-1">
                      {t(`categories.${site.category}`)}
                    </span>
                  </div>
                  <IconExternalLink className="h-5 w-5 text-gray-400 hover:text-gray-300 transition-colors" />
                </div>

                {/* URL */}
                <div className="flex items-center text-sm text-indigo-400 mb-3">
                  <IconWorld className="h-4 w-4 mr-2" />
                  <span className="truncate">{site.url.replace('https://', '').replace('http://', '')}</span>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4">
                  {truncateText(t(`sites.${site.id}.description`), 80)}
                </p>

                {/* Supported Sites */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-200 mb-2">{t('supportedSites')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {site.supportedSites.slice(0, 4).map((supportedSite) => (
                      <span
                        key={supportedSite}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-300"
                      >
                        {supportedSite}
                      </span>
                    ))}
                    {site.supportedSites.length > 4 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-400">
                        +{site.supportedSites.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-200 mb-2">{t('features')}</h4>
                  <div className="flex flex-wrap gap-1">
                    {t.raw(`sites.${site.id}.features`).slice(0, 3).map((feature: string, index: number) => (
                      <span
                        key={feature}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-indigo-900/50 text-indigo-300 border border-indigo-800"
                      >
                        {feature}
                      </span>
                    ))}
                    {t.raw(`sites.${site.id}.features`).length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-700 text-gray-400">
                        +{t.raw(`sites.${site.id}.features`).length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  as="a"
                  href={site.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  variant="solid"
                  fullWidth
                  endContent={<IconChevronRight className="h-4 w-4" />}
                  className="group/btn"
                >
                  {t('visitWebsite')}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-16  border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">        <div className="text-center text-gray-400">
          <p className="text-sm">
            {t('footerNote')}
          </p>
          <p className="text-xs mt-2 text-gray-500">
            {t('footerDisclaimer')}
          </p>
        </div>
        </div>
      </footer>
    </div>
  )
}