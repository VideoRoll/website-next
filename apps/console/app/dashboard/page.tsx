'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  
  useEffect(() => {
    // 使用 replace 而不是 push，避免在历史记录中留下记录
    // 确保使用客户端路由，不会触发整页刷新
    if (typeof window !== 'undefined') {
      router.replace('/dashboard/profile');
    }
  }, [router]);
  
  return null;
}
