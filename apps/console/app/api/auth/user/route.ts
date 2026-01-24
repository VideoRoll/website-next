import { NextResponse } from 'next/server';
import { getUserServerSideProps } from '@website-next/auth/auth-helpers/props';
import { getAuthConfig } from '@/lib/auth-init';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getAuthConfig();
    
    // 验证配置
    if (!config?.supabase?.url || !config?.supabase?.publishableKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json(
        { currentUser: null, error: 'Configuration error' },
        { 
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
          },
        }
      );
    }

    const { currentUser } = await getUserServerSideProps(config);
    console.log('currentUser', currentUser);
    return NextResponse.json(
      { currentUser },
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  } catch (error) {
    console.error('Failed to get user:', error);
    
    // 确保返回 JSON，而不是错误页面
    return NextResponse.json(
      { 
        currentUser: null, 
        error: error instanceof Error ? error.message : 'Failed to get user' 
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
