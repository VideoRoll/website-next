"use client";

import React from "react";

export default function VideoSection() {
  return (
    <>
      <style>{`
        @keyframes gradient-flow {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .gradient-border {
          background: linear-gradient(90deg, #db2777, #eab308, #db2777);
          background-size: 200% 100%;
          animation: gradient-flow 3s ease infinite;
        }
      `}</style>
      <section className="max-w-screen-2xl px-[5vw] mx-auto relative flex justify-center z-20">
        <div className="w-full p-4">
          {/* 视频容器 */}
          <div className="relative mx-auto w-full rounded-2xl p-[4px] overflow-hidden">
            {/* 流动渐变边框 */}
            <div className="absolute inset-0 rounded-2xl gradient-border"></div>
            {/* 内层背景 */}
            <div className="relative w-full h-full rounded-xl bg-background">
              {/* 实际视频 */}
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <iframe
                  src="//player.bilibili.com/player.html?isOutside=true&aid=114728089157681&bvid=BV1tAKpz3EP5&cid=30644634279&p=1&loop=1"
                  scrolling="no"
                  frameBorder="no"
                  allowFullScreen={true}
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

