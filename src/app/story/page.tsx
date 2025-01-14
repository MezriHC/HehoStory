'use client'

import { Layers, Plus, FolderIcon } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import StoriesList, { Story } from '../components/StoriesList'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Loader from '@/app/components/Loader'
import { useState, useEffect } from 'react'
import FolderView from '../components/FolderView'

// Fetch function for stories
const fetchStories = async () => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    throw error
  }

  return data || []
}

export default function StoriesPage() {
  const queryClient = useQueryClient()
  const [showFolders, setShowFolders] = useState(false)
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadStories() {
      try {
        const { data, error } = await supabase
          .from('stories')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setStories(data || [])
      } catch (error) {
        console.error('Error loading stories:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadStories()
  }, [])

  // Mutation for deleting stories
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: (_, deletedId) => {
      // Update cache after successful deletion
      queryClient.setQueryData(['stories'], (oldStories: Story[] = []) => 
        oldStories.filter(story => story.id !== deletedId)
      )
    },
    onError: (error: Error) => {
      console.error('Error deleting story:', error)
    }
  })

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', id)

      if (error) throw error

      setStories(stories.filter(story => story.id !== id))
    } catch (error) {
      console.error('Error deleting story:', error)
    }
  }

  if (isLoading) {
    return <Loader />
  }

  if (showFolders) {
    return (
      <FolderView
        type="story"
        onCreateFolder={(name) => {
          // Pour l'instant, on ne fait rien avec le nom du dossier
          // car on utilise le localStorage dans le composant FolderView
        }}
        onRenameFolder={(id, name) => {
          // Pour l'instant, on ne fait rien avec le renommage
        }}
        onDeleteFolder={(id) => {
          // Pour l'instant, on ne fait rien avec la suppression
        }}
        onBack={() => setShowFolders(false)}
      />
    )
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
              <button
                onClick={() => setShowFolders(true)}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <FolderIcon className="w-4 h-4 mr-2" />
                Dossiers
              </button>

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
            <button
              onClick={() => setShowFolders(true)}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              <FolderIcon className="w-4 h-4 mr-2" />
              Dossiers
            </button>

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