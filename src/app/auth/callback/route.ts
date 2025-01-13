import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    
    if (code) {
      const cookieStore = cookies()
      const supabase = createRouteHandlerClient({ 
        cookies: () => cookieStore
      })
      
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        console.error('Erreur lors de l\'échange du code:', error)
        return NextResponse.redirect('https://hehostory.vercel.app/login')
      }

      // Rediriger vers la page d'accueil
      return NextResponse.redirect('https://hehostory.vercel.app')
    }

    return NextResponse.redirect('https://hehostory.vercel.app/login')
  } catch (error) {
    console.error('Erreur dans le callback:', error)
    return NextResponse.redirect('https://hehostory.vercel.app/login')
  }
} 