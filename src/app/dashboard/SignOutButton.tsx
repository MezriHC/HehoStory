'use client'

import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SignOutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
  }

  return (
    <button
      onClick={handleSignOut}
      className="ml-4 px-4 py-2 text-sm text-red-600 hover:text-red-900"
    >
      Se déconnecter
    </button>
  )
} 