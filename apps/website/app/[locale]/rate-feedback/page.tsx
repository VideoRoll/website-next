import RateFeedback from "@/components/ui/client/RateFeedback";
import { setRequestLocale } from "next-intl/server";
import { Locale } from "next-intl";

type Props = {
  params: { locale: Locale };
};

export default async function Page({ params }: Props) {
  const paramsData = await params;
  // 设置当前请求的 locale
  setRequestLocale(paramsData.locale);

  return (
    <main style={{ height: "100%" }} className="bg-background">
      <RateFeedback reason={1}/>
    </main>
  );
}
