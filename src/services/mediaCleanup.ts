import { SupabaseClient } from '@supabase/supabase-js'

export class MediaCleanupService {
  constructor(private supabase: SupabaseClient) {}

  private log(message: string, data?: any) {
    console.log(`[MediaCleanup] ${message}`, data || '')
  }

  private error(message: string, error?: any) {
    console.error(`[MediaCleanup] ${message}`, error || '')
  }

  private async listAllFiles(prefix: string): Promise<string[]> {
    try {
      const { data, error } = await this.supabase.storage
        .from('media')
        .list(prefix)

      if (error) {
        this.error('Error listing files:', error)
        return []
      }

      return data.map(item => `${prefix}/${item.name}`)
    } catch (error) {
      this.error('Error listing files:', error)
      return []
    }
  }

  async deleteStoryMedia(storyId: string, userId: string): Promise<{
    success: boolean
    deletedPaths: string[]
    errors: any[]
  }> {
    this.log(`Starting deletion for story: ${storyId} (user: ${userId})`)

    // 1. Vérifier d'abord que la story appartient à l'utilisateur
    const { data: story, error: storyError } = await this.supabase
      .from('stories')
      .select('author_id')
      .eq('id', storyId)
      .single()

    if (storyError) {
      this.error('Error fetching story ownership:', storyError)
      throw storyError
    }

    if (!story || story.author_id !== userId) {
      this.error('Unauthorized: Story does not belong to the user', {
        storyId,
        userId,
        authorId: story?.author_id
      })
      throw new Error('Unauthorized: Story does not belong to the user')
    }

    const errors: any[] = []
    const deletedPaths: string[] = []

    // Liste tous les sous-dossiers à vérifier
    const subfolders = ['stories', 'thumbnails', 'profile']
    
    for (const subfolder of subfolders) {
      const prefix = `${userId}/${subfolder}`
      const files = await this.listAllFiles(prefix)
      
      if (files.length > 0) {
        try {
          this.log(`Deleting files in ${subfolder}:`, files)
          const { error } = await this.supabase.storage
            .from('media')
            .remove(files)

          if (error) {
            this.error(`Error deleting files in ${subfolder}:`, error)
            errors.push(error)
          } else {
            this.log(`Successfully deleted files in ${subfolder}`)
            deletedPaths.push(...files)
          }
        } catch (error) {
          this.error(`Unexpected error deleting files in ${subfolder}:`, error)
          errors.push(error)
        }
      }
    }

    // Essayer de supprimer les dossiers vides
    try {
      for (const subfolder of subfolders) {
        const { error } = await this.supabase.storage
          .from('media')
          .remove([`${userId}/${subfolder}`])

        if (error) {
          this.log(`Note: Could not delete empty folder ${subfolder}, this is normal if it's not empty`)
        }
      }
    } catch (error) {
      this.log('Note: Error deleting empty folders, this is expected:', error)
    }

    this.log('Deletion complete', {
      success: errors.length === 0,
      deletedPaths,
      errors
    })

    return {
      success: errors.length === 0,
      deletedPaths,
      errors
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
} 