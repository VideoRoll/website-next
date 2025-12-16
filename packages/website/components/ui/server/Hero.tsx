import React from "react";
import { getTranslations } from "next-intl/server";
import Banner from "@/components/icons/Banner";
import Item1 from "@/components/icons/item1.png";
import Item2 from "@/components/icons/item2.png";
import Item3 from "@/components/icons/item3.png";
import CanvasStar from "@/components/ui/client/CanvasStar";
import HeroScrollWrapper from "@/components/ui/client/HeroScrollWrapper.client";
import VideoScrollWrapper from "@/components/ui/client/VideoScrollWrapper.client";
import FeatureCard from "@/components/ui/client/FeatureCard.client";
import ImageCard from "@/components/ui/client/ImageCard.client";
import ReviewCard from "@/components/ui/client/ReviewCard.client";

// 瀑布流用户评论数据（静态数据，可以服务端渲染）
const waterfallReviews = [
  {
    user: "Alex Chen",
    comment:
      "This extension has completely transformed my video workflow. The rotation feature is incredibly smooth and intuitive!",
    stars: 5,
    avatar: "AC",
  },
  {
    user: "Sarah Johnson",
    comment:
      "Love how easy it is to use. Works flawlessly with YouTube and other platforms. The interface is clean and doesn't interfere with the original player. I've been using it for months now and it's become an essential part of my daily browsing experience.",
    stars: 5,
    avatar: "SJ",
  },
  {
    user: "Miguel Rodriguez",
    comment: "Finally found an extension that actually works as advertised.",
    stars: 5,
    avatar: "MR",
  },
  {
    user: "Emma Thompson",
    comment:
      "Clean interface, powerful features. This is exactly what I needed for my video editing workflow. The picture-in-picture mode is particularly useful when I'm working on multiple projects simultaneously.",
    stars: 5,
    avatar: "ET",
  },
  {
    user: "David Kim",
    comment:
      "The picture-in-picture mode is a game changer. I can multitask while watching videos effortlessly. Performance is excellent and it doesn't slow down my browser at all.",
    stars: 5,
    avatar: "DK",
  },
  {
    user: "Lisa Wang",
    comment: "Impressive performance and reliability.",
    stars: 5,
    avatar: "LW",
  },
  {
    user: "James Wilson",
    comment:
      "The speed control feature is incredibly useful for educational content. I can slow down complex tutorials or speed up basic explanations. The quality remains crisp at all playback speeds, which is really impressive. Highly recommend to anyone who watches educational videos regularly!",
    stars: 5,
    avatar: "JW",
  },
  {
    user: "Anna Petrov",
    comment:
      "Love the minimalist design and how it doesn't interfere with the original video player interface. Simple but effective.",
    stars: 5,
    avatar: "AP",
  },
  {
    user: "Carlos Silva",
    comment:
      "Best video enhancement extension I've used. The quality improvements are noticeable immediately and the rotation controls are so smooth.",
    stars: 5,
    avatar: "CS",
  },
];

export default async function Hero() {
  const t = await getTranslations("hero");

  // 在服务端准备数据
  const features = [
    { title: t("features.0.title"), desc: t("features.0.desc") },
    { title: t("features.1.title"), desc: t("features.1.desc") },
    { title: t("features.2.title"), desc: t("features.2.desc") },
    { title: t("features.3.title"), desc: t("features.3.desc") },
    { title: t("features.4.title"), desc: t("features.4.desc") },
    { title: t("features.5.title"), desc: t("features.5.desc") },
    { title: t("features.6.title"), desc: t("features.6.desc") },
    { title: t("features.7.title"), desc: t("features.7.desc") },
    { title: t("features.8.title"), desc: t("features.8.desc") },
  ];

  const texts = [
    { text: t("animation.0.text"), color: "#837cdd" },
    { text: t("animation.1.text"), color: "#69c4c9" },
    { text: t("animation.2.text"), color: "#eab308" },
    { text: t("animation.3.text"), color: "#2d96b7" },
    { text: t("animation.4.text"), color: "#16a34a" },
    { text: t("animation.5.text"), color: "#2563eb" },
    { text: t("animation.6.text"), color: "#2d96b7" },
    { text: t("animation.7.text"), color: "#ef72b8" },
    { text: t("animation.8.text"), color: "#eab308" },
    { text: t("animation.9.text"), color: "#db2777" },
    { text: t("animation.10.text"), color: "#eab308" },
    { text: t("animation.11.text"), color: "#ef72b8" },
  ];

  return (
    <>
      <div className="w-full h-[600px] absolute top-[-64px] overflow-hidden">
        <CanvasStar speed={1.8}></CanvasStar>
      </div>
      <div className="w-full">
        {/* Canvas星点动效层 */}
        {/* 1. Hero 标题+平台图标 */}
        <section className="w-full mx-auto mb-10 relative flex md:flex-row items-center justify-between min-h-[60vh] pt-12 md:pt-24 overflow-hidden">
          <HeroScrollWrapper
            title={t("title")}
            subtitle={t("subtitle")}
            usersTrust={t("usersTrust")}
            featured={t("featured")}
            chromeText={t("chrome")}
            edgeText={t("edge")}
            firefoxText={t("firefox")}
            quarkText={t("quark")}
            animationPrefix={t("animation.prefix")}
            texts={texts}
          />
          <div className="w-1/3 absolute right-0 hidden md:block">
            {/* <Banner className="scale-75"></Banner> */}
          </div>
        </section>
        {/* 2. 介绍视频独立模块 */}
        <VideoScrollWrapper />
        {/* 3. 功能网格 - 高级卡片式 */}
        <section className="relative z-30 py-20">
          <div className="max-w-7xl px-6 mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mt-4 mb-4">
              {t("featuresTitle")}
            </h2>
            <div className="mb-16 flex justify-center">
              <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
            </div>

            {/* 交叉布局卡片容器 */}
            <div className="w-full mx-auto space-y-8">
              {/* 第一行：左1/3 右2/3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                  title={features[0]?.title}
                  desc={features[0]?.desc}
                  delay={0.1}
                  colSpan={1}
                />
                <FeatureCard
                  title={features[1]?.title}
                  desc={features[1]?.desc}
                  delay={0.2}
                  colSpan={2}
                  showPlatforms={true}
                />
              </div>

              {/* 第二行：左2/3 右1/3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                  title={features[2]?.title}
                  desc={features[2]?.desc}
                  delay={0.3}
                  colSpan={2}
                />
                <FeatureCard
                  title={features[3]?.title}
                  desc={features[3]?.desc}
                  delay={0.4}
                  colSpan={1}
                />
              </div>

              {/* 第三行：左1/3 右2/3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FeatureCard
                  title={features[4]?.title}
                  desc={features[4]?.desc}
                  delay={0.5}
                  colSpan={1}
                />
                <FeatureCard
                  title={features[5]?.title}
                  desc={features[5]?.desc}
                  delay={0.6}
                  colSpan={2}
                />
              </div>
            </div>
          </div>
        </section>
        {/* 4. 图片展示区块 */}
        <section className="max-w-7xl px-6 mx-auto py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {t("interfaceTitle")}
          </h2>
          <div className="mb-16 flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          </div>
          <div className="flex items-center justify-center gap-0 max-w-4xl mx-auto">
            {/* 左边图片 - 逆时针旋转15度 */}
            <ImageCard
              src={Item1}
              alt="Item 1"
              delay={0.1}
              rotation={-15}
              transformOrigin="right bottom"
              className="w-48 md:w-64"
            />

            {/* 中间图片 - 不旋转 */}
            <ImageCard
              src={Item2}
              alt="Item 2"
              delay={0.2}
              rotation={0}
              transformOrigin="center"
              className="w-56 md:w-72"
              isCenter={true}
            />

            {/* 右边图片 - 顺时针旋转15度 */}
            <ImageCard
              src={Item3}
              alt="Item 3"
              delay={0.3}
              rotation={15}
              transformOrigin="left bottom"
              className="w-48 md:w-64"
            />
          </div>
        </section>
        {/* 5. 用户评价瀑布流 */}
        <section className="relative py-20 max-w-7xl px-6 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            {t("reviewsTitle")}
          </h2>
          <div className="mb-16 flex justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent" />
          </div>

          {/* 瀑布流容器 */}
          <div className="relative">
            {/* 三列瀑布流布局 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
              {/* 第一列 */}
              <div className="space-y-6">
                {[0, 3, 6, 9, 12].map((reviewIndex) => {
                  const review = waterfallReviews[reviewIndex];
                  if (!review) return null;
                  return (
                    <ReviewCard
                      key={`col1-${reviewIndex}`}
                      user={review.user}
                      comment={review.comment}
                      stars={review.stars}
                      avatar={review.avatar}
                      delay={reviewIndex * 0.1}
                    />
                  );
                })}
              </div>
              {/* 第二列 */}
              <div className="space-y-6">
                {[1, 4, 7, 10].map((reviewIndex) => {
                  const review = waterfallReviews[reviewIndex];
                  if (!review) return null;
                  return (
                    <ReviewCard
                      key={`col2-${reviewIndex}`}
                      user={review.user}
                      comment={review.comment}
                      stars={review.stars}
                      avatar={review.avatar}
                      delay={reviewIndex * 0.1}
                    />
                  );
                })}
              </div>
              {/* 第三列 */}
              <div className="space-y-6">
                {[2, 5, 8, 11].map((reviewIndex) => {
                  const review = waterfallReviews[reviewIndex];
                  if (!review) return null;
                  return (
                    <ReviewCard
                      key={`col3-${reviewIndex}`}
                      user={review.user}
                      comment={review.comment}
                      stars={review.stars}
                      avatar={review.avatar}
                      delay={reviewIndex * 0.1}
                    />
                  );
                })}
              </div>
            </div>

            {/* 底部渐变遮罩 */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
          </div>
        </section>
      </div>
    </>
  );
}
