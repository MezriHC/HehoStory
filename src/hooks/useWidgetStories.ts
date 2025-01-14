import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Story } from '@/app/components/StoriesList'
import { useAuth } from '@/hooks/useAuth'

export function useWidgetStories(storyIds: string[]) {
  const { userId, loading: authLoading } = useAuth()
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let isMounted = true

    async function loadStories() {
      try {
        // Reset state
        setError(null)
        setIsLoading(true)

        // Validate inputs
        if (!storyIds?.length || !userId) {
          setStories([])
          setIsLoading(false)
          return
        }

        // Fetch stories
        const { data: fetchedStories, error } = await supabase
          .from('stories')
          .select(`
            id,
            title,
            thumbnail,
            content,
            author_id,
            published,
            created_at,
            profile_image,
            profile_name
          `)
          .in('id', storyIds)
          .eq('author_id', userId)
          .eq('published', true)

        // Handle errors
        if (error) {
          console.error('Error fetching stories:', error)
          setError(new Error(error.message))
          if (isMounted) {
            setStories([])
          }
          return
        }

        // Update state if component is still mounted
        if (isMounted && fetchedStories) {
          // Create a map for O(1) lookup
          const storiesMap = new Map(
            fetchedStories.map(story => [story.id, story as Story])
          )

          // Sort stories according to storyIds order
          const sortedStories = storyIds
            .map(id => storiesMap.get(id))
            .filter((story): story is Story => story !== undefined)
          
          setStories(sortedStories)
        }
      } catch (err) {
        console.error('Error in loadStories:', err)
        setError(err instanceof Error ? err : new Error('Unknown error'))
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    if (!authLoading) {
      loadStories()
    }

    return () => {
      isMounted = false
    }
  }, [storyIds, userId, authLoading])

  return {
    stories,
    isLoading: authLoading || isLoading,
    error
  }
} 