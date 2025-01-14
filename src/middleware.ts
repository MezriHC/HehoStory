import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })
  
  // Rafraîchit la session si elle existe
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Liste des routes publiques
  const publicRoutes = ['/auth/signin']
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname)

  // Redirection vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!session && !isPublicRoute && !request.nextUrl.pathname.startsWith('/auth/callback')) {
    const redirectUrl = new URL('/auth/signin', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirection vers le dashboard si l'utilisateur est authentifié et essaie d'accéder à une page publique
  if (session && isPublicRoute) {
    const redirectUrl = new URL('/dashboard', request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
} 