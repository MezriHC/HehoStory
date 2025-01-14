import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import SignOutButton from './SignOutButton'

export const dynamic = 'force-dynamic'

export default async function Dashboard() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/auth/signin')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Hehostory</h1>
            </div>
            <div className="flex items-center">
              <div className="flex items-center space-x-4">
                <div className="text-sm">
                  <p className="text-gray-900">{profile?.full_name}</p>
                  <p className="text-gray-500">{profile?.email}</p>
                </div>
                {profile?.avatar_url && (
                  <img
                    src={profile.avatar_url}
                    alt="Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <SignOutButton />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h2 className="text-2xl font-bold mb-4">Tableau de bord</h2>
          {/* Ajoutez ici le contenu de votre tableau de bord */}
        </div>
      </main>
    </div>
  )
} 