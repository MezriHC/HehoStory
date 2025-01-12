'use client'

import { Layers, Plus } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import StoriesList, { Story } from '../components/StoriesList'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

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

  // Query for stories with caching
  const { data: stories = [] } = useQuery({
    queryKey: ['stories'],
    queryFn: fetchStories,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts
  })

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

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id)
  }

  if (stories.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Stories</h1>
              <p className="mt-2 text-gray-600">
                Manage your stories and create new experiences
              </p>
            </div>

            <Link
              href="/story/create"
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create story
            </Link>
          </div>
          <EmptyState
            icon={Layers}
            title="No stories created"
            description="Start by creating your first story to engage your customers with interactive content."
            actionLabel="Create a story"
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
              Manage your stories and create new experiences
            </p>
          </div>

          <Link
            href="/story/create"
            className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create story
          </Link>
        </div>

        <StoriesList stories={stories} onDelete={handleDelete} />
      </div>
    </div>
  )
} 