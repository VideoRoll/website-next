/*
 * @Author: gomi gxy880520@qq.com
 * @Date: 2024-10-11 15:51:18
 * @LastEditors: gomi gxy880520@qq.com
 * @LastEditTime: 2025-06-19 15:09:02
 * @FilePath: \website-next\packages\website\app\private\page.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { redirect } from 'next/navigation'

import { createClient } from '../../utils/supabase/server'

export default async function PrivatePage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/signin')
  }

  return <p>Hello {data.user.email}</p>
}