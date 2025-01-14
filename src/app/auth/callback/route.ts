import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Callback URL:', requestUrl.toString())
  console.log('Code présent:', !!code)

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    const result = await supabase.auth.exchangeCodeForSession(code)
    console.log('Résultat échange code:', result)
  }

  return NextResponse.redirect(new URL('/story', requestUrl.origin))
} 