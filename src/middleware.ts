import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    // Créer un client Supabase avec les cookies
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req: request, res })

    // Récupérer la session
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // URLs publiques qui ne nécessitent pas d'authentification
    const isPublicUrl = 
      request.nextUrl.pathname === '/login' ||
      request.nextUrl.pathname === '/auth/callback' ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.startsWith('/api')

    // Si pas de session et URL protégée, rediriger vers login
    if (!session && !isPublicUrl) {
      return NextResponse.redirect('https://hehostory.vercel.app/login')
    }

    // Si session et sur la page login, rediriger vers home
    if (session && request.nextUrl.pathname === '/login') {
      return NextResponse.redirect('https://hehostory.vercel.app')
    }

    return res
  } catch (error) {
    console.error('Erreur middleware:', error)
    return NextResponse.redirect('https://hehostory.vercel.app/login')
  }
}

// Ne pas appliquer le middleware sur certaines routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
} 