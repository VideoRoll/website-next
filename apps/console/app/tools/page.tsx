"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ToolsPage() {
  const router = useRouter();

  useEffect(() => {
    // 默认重定向到视频转换页面
    router.replace("/tools/convert");
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  );
}
