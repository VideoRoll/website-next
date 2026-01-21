import { NextRequest, NextResponse } from "next/server";
import { createClient, createAdminClient } from "@website-next/auth/supabase/server";
import { getAuthConfig } from "@/lib/auth-init";

export async function POST() {
    const config = getAuthConfig();
    
    // 1. 用用户 session 校验身份（不是 service_role）
    const supabase = await createClient(config);
  
    const {
        data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      return  NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
  
    // 2. 用 service_role 执行删除
    const supabaseAdmin = await createAdminClient(config);
  
    // // 3. 先删业务数据（强烈推荐）
    // await supabaseAdmin
    //   .from('user_profiles')
    //   .delete()
    //   .eq('id', user.id)
  
    // 4. 再删 auth 用户
    try {
      await supabaseAdmin.auth.admin.deleteUser(user.id)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Internal Server Error' },
        { status: 500 }
      )
    }
  
    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    )
  }
