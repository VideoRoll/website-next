import Welcome from '@/components/ui/Welcome'
import { getTranslations } from 'next-intl/server'

export default function WelcomePage() {
  return <Welcome />
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'welcome' })
  
  return {
    title: `${t('congratulations')} ${t('appName')}`,
    description: t('subtitle'),
  }
}
