import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Vérifie si la requête est pour l'API des widgets
  if (request.nextUrl.pathname.startsWith('/api/widgets/')) {
    // Autorise les requêtes CORS pour l'API des widgets
    const response = NextResponse.next();
    
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set(
      'Access-Control-Allow-Methods',
      'GET, OPTIONS'
    );
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization'
    );
    
    return response;
  }

  // Pour toutes les autres routes, continue normalement
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/widgets/:path*',
    '/widget.js',
  ],
}; 