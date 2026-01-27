'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 使用 replace 避免在历史记录中留下记录
    router.replace('/dashboard/profile');
  }, [router]);
  
  // 显示加载状态
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    </div>
  );
}
