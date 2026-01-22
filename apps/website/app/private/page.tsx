import { redirect } from 'next/navigation'

import { createClient } from '@website-next/auth/supabase/server'
import { getAuthConfig } from '@/lib/auth-init'

export default async function PrivatePage() {
  const config = getAuthConfig();
  const supabase = await createClient(config)

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect('/signin')
  }

  return <p>Hello {data.user.email}</p>
}