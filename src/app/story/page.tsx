'use client'

import { Layers, Plus } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import StoriesList, { Story } from '../components/StoriesList'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Loader from '@/app/components/Loader'
import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

export default function StoriesPage() {
  const router = useRouter()
  const { userId, loading: authLoading, supabase } = useAuth()
  const queryClient = useQueryClient()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !userId) {
      router.push('/auth/signin')
      return
    }

    async function loadStories() {
      if (!userId) return

      try {
        console.log('Debug - Loading stories for user:', userId)
        const { data, error } = await supabase
          .from('stories')
          .select('id, title, thumbnail, content, author_id, published, created_at, profile_image, profile_name')
          .eq('author_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Supabase error:', error)
          throw error
        }

        console.log('Debug - Stories loaded:', data)
        setStories(data || [])
      } catch (error) {
        console.error('Error loading stories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()
  }, [userId, authLoading, supabase])

  const handleDelete = async (id: string) => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)
        .eq('author_id', userId)

      if (error) throw error

      setStories(stories.filter(story => story.id !== id))
    } catch (error) {
      console.error('Error deleting story:', error)
    }
  }

  if (authLoading || isLoading) {
    return <Loader />
  }

  if (stories.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Stories</h1>
              <p className="mt-2 text-gray-600">
                Gérez vos stories et créez de nouvelles expériences
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/story/create"
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer une story
              </Link>
            </div>
          </div>
          <EmptyState
            icon={Layers}
            title="Aucune story créée"
            description="Commencez par créer votre première story pour engager vos clients avec du contenu interactif."
            actionLabel="Créer une story"
            actionHref="/story/create"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Stories</h1>
            <p className="mt-2 text-gray-600">
              Gérez vos stories et créez de nouvelles expériences
            </p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/story/create"
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer une story
            </Link>
          </div>
        </div>

        <StoriesList stories={stories} onDelete={handleDelete} />
      </div>
    </div>
  )
} 