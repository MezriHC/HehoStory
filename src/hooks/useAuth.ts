import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) throw error
        setUserId(session?.user?.id || null)
      } catch (error) {
        console.error('Error checking session:', error)
        setUserId(null)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        setUserId(session?.user?.id || null)
      } else if (event === 'SIGNED_OUT') {
        setUserId(null)
        router.push('/auth/signin')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  return { userId, loading, supabase }
} 