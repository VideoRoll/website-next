import { redirect } from "next/navigation";
import { Locale } from 'next-intl';

type Props = {
  params: Promise<{ locale: Locale }>;
};

export default async function LocalePage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/profile`);
}
