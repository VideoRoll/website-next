import Welcome from '@/components/ui/client/Welcome'
import { getTranslations } from 'next-intl/server'

export default function WelcomePage() {
  return <Welcome />
}

export async function generateMetadata({ params }: { params: { locale: string } }) {
  const paramsData = await params;
  const t = await getTranslations({ locale: paramsData.locale, namespace: 'welcome' })

  return {
    title: `${t('congratulations')} ${t('appName')}`,
    description: t('subtitle'),
  }
}
