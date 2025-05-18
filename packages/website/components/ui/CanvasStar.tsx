"use client";

import React, { useRef, useEffect } from "react";

export default function CanvasStar() {
  // Canvas 星点动效
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<any[]>([]);
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    // 响应式自适应
    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      // 重新生成星点
      const STAR_NUM = Math.floor(width / 8);
      starsRef.current = Array.from({ length: STAR_NUM }).map(() => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 0.8 + 0.7,
        alpha: Math.random() * 0.5 + 0.3,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.5 + 0.2,
      }));
    };
    window.addEventListener("resize", handleResize);

    // 初始化星点
    handleResize();

    function draw() {
      ctx.clearRect(0, 0, width, height);
      for (let s of starsRef.current) {
        // 慢速闪烁
        s.twinkle += 0.008 * s.speed;
        const a = s.alpha + Math.sin(s.twinkle) * 0.18;
        ctx.globalAlpha = Math.max(0, Math.min(1, a));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.shadowColor = "rgba(255,255,255,0.7)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      ctx.globalAlpha = 1;
      if (runningRef.current) requestAnimationFrame(draw);
    }
    draw();

    return () => {
      runningRef.current = false;
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      className="absolute left-0 top-0 w-full pointer-events-none z-0"
      style={{ height: "33%" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  );
}
