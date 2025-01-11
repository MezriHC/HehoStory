'use client'

import { Layers, Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import StoriesList, { Story } from '../components/StoriesList'
import Link from 'next/link'

export default function StoriesPage() {
  const [stories, setStories] = useState<Story[]>([])

  useEffect(() => {
    // Load stories from localStorage
    const savedStories = JSON.parse(localStorage.getItem('stories') || '[]')
    setStories(savedStories)
  }, [])

  const handleDelete = (id: string) => {
    setStories(prev => {
      const newStories = prev.filter(story => story.id !== id)
      localStorage.setItem('stories', JSON.stringify(newStories))
      return newStories
    })
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