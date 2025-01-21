import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  
  console.log('Callback URL:', requestUrl.toString())
  console.log('Code présent:', !!code)

  if (!code) {
    console.error('Pas de code dans la requête')
    return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
  }

  try {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    console.log('Résultat échange code:', { data, error: exchangeError })
    
    if (exchangeError) {
      console.error('Erreur échange code:', exchangeError)
      return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
    }

    if (data?.session) {
      const user = data.session.user

      // Vérifier si les préférences existent déjà
      const { data: existingPrefs } = await supabase
        .from('preferences')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (!existingPrefs) {
        // Ajuster l'URL de l'image Google pour une meilleure résolution
        let avatarUrl = user.user_metadata?.avatar_url
        if (avatarUrl && avatarUrl.includes('googleusercontent.com')) {
          avatarUrl = avatarUrl.replace('=s96-c', '=s400-c')
        }

        // Créer les préférences avec les données Google
        const { error: prefsError } = await supabase
          .from('preferences')
          .insert({
            user_id: user.id,
            widget_border_color: '#000000',
            custom_name: user.user_metadata?.full_name || null,
            custom_picture: avatarUrl
          })

        if (prefsError) {
          console.error('Erreur création préférences:', prefsError)
        }
      }

      return NextResponse.redirect(new URL('/story', requestUrl.origin))
    }

    console.error('Pas de session créée')
    return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
  } catch (error) {
    console.error('Erreur inattendue:', error)
    if (code) {
      return NextResponse.redirect(new URL('/story', requestUrl.origin))
    }
    return NextResponse.redirect(new URL('/auth/signin', requestUrl.origin))
  }
} 