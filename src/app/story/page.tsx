'use client'

import { Layers, Plus } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import StoriesList, { Story } from '../components/StoriesList'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import Loader from '@/app/components/Loader'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import FolderPills from '../components/FolderPills'
import { Database } from '@/types/database.types'
import Toast from '@/app/components/Toast'
import DeleteConfirmation from '@/app/components/DeleteConfirmation'

type Folder = Database['public']['Tables']['folders']['Row']

export default function StoriesPage() {
  const router = useRouter()
  const { userId, loading: authLoading, supabase } = useAuth()
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false })
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null)

  // Charger les stories
  const { 
    data: stories = [], 
    isLoading: isStoriesLoading,
    refetch: refetchStories
  } = useQuery<Story[]>({
    queryKey: ['stories', userId],
    queryFn: async () => {
      if (!userId) return []
      
      const { data, error } = await supabase
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
          profile_name,
          folder_id
        `)
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading stories:', error)
        return []
      }

      return data || []
    },
    enabled: !!userId && !authLoading
  })

  // Charger les dossiers
  const { 
    data: folders = [], 
    isLoading: isFoldersLoading,
    refetch: refetchFolders
  } = useQuery<Folder[]>({
    queryKey: ['folders', userId],
    queryFn: async () => {
      if (!userId) return []
      
      const { data, error } = await supabase
        .from('folders')
        .select('*')
        .eq('author_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading folders:', error)
        return []
      }

      return data || []
    },
    enabled: !!userId && !authLoading
  })

  // Redirection si non authentifié
  if (!authLoading && !userId) {
    router.push('/auth/signin')
    return null
  }

  const handleDelete = async (id: string) => {
    setStoryToDelete(id)
  }

  const handleCreateFolder = async (name: string) => {
    if (!userId) return

    try {
      const { data: folder, error: folderError } = await supabase
        .from('folders')
        .insert({
          name,
          author_id: userId
        })
        .select()
        .single()

      if (folderError) throw folderError

      // Si des stories sont sélectionnées, les déplacer dans le nouveau dossier
      if (selectedStories.length > 0) {
        const { error: updateError } = await supabase
          .from('stories')
          .update({ folder_id: folder.id })
          .in('id', selectedStories)

        if (updateError) throw updateError
      }

      // Actualiser les données
      await Promise.all([refetchFolders(), refetchStories()])
      
      // Reset selection
      setSelectedStories([])
      setToast({ 
        message: `Dossier "${name}" créé avec succès`, 
        visible: true 
      })
    } catch (error) {
      console.error('Error creating folder:', error)
      setToast({ 
        message: 'Erreur lors de la création du dossier', 
        visible: true 
      })
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!userId || !folderId) return

    try {
      // Retirer le dossier des stories
      const { error: updateError } = await supabase
        .from('stories')
        .update({ folder_id: null })
        .eq('folder_id', folderId)

      if (updateError) throw updateError

      // Supprimer le dossier
      const { error: deleteError } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)

      if (deleteError) throw deleteError

      // Actualiser les données
      await Promise.all([refetchFolders(), refetchStories()])

      // Si on était dans ce dossier, retourner à tous les éléments
      if (currentFolder === folderId) {
        setCurrentFolder(null)
      }

      setToast({ 
        message: 'Dossier supprimé avec succès', 
        visible: true 
      })
    } catch (error) {
      console.error('Error deleting folder:', error)
      setToast({ 
        message: 'Erreur lors de la suppression du dossier', 
        visible: true 
      })
    }
  }

  const handleFolderSelect = (folderId: string | null) => {
    setCurrentFolder(folderId)
    setSelectedStories([])
  }

  const handleStorySelect = (id: string) => {
    setSelectedStories(prev => 
      prev.includes(id) 
        ? prev.filter(storyId => storyId !== id)
        : [...prev, id]
    )
  }

  const confirmDelete = async () => {
    if (!storyToDelete || !userId) return

    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', storyToDelete)
        .eq('author_id', userId)

      if (error) throw error

      await refetchStories()
      setStoryToDelete(null)
      setToast({ message: 'Story supprimée avec succès', visible: true })
    } catch (error) {
      console.error('Error deleting story:', error)
      setToast({ 
        message: 'Erreur lors de la suppression de la story', 
        visible: true 
      })
    }
  }

  const handleMoveToFolder = async (folderId: string | null) => {
    if (!userId || selectedStories.length === 0) return

    try {
      const { error } = await supabase
        .from('stories')
        .update({ folder_id: folderId })
        .in('id', selectedStories)

      if (error) throw error

      await refetchStories()
      setSelectedStories([])
      
      const folderName = folderId 
        ? folders.find(f => f.id === folderId)?.name 
        : 'la racine'
      setToast({ 
        message: `Éléments déplacés dans ${folderName} avec succès`, 
        visible: true 
      })
    } catch (error) {
      console.error('Error moving stories:', error)
      setToast({ 
        message: 'Erreur lors du déplacement des stories', 
        visible: true 
      })
    }
  }

  // Filtrer les stories selon le dossier sélectionné
  const filteredStories = stories.filter(story => 
    currentFolder === null || story.folder_id === currentFolder
  )

  const isLoading = authLoading || isStoriesLoading || isFoldersLoading

  if (isLoading) {
    return <Loader />
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <DeleteConfirmation
        isOpen={storyToDelete !== null}
        onClose={() => setStoryToDelete(null)}
        onConfirm={confirmDelete}
        title="Supprimer la story"
        description="Êtes-vous sûr de vouloir supprimer cette story ? Cette action est irréversible."
      />

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

        <FolderPills
          folders={folders}
          currentFolder={currentFolder}
          onFolderSelect={handleFolderSelect}
          onCreateFolder={handleCreateFolder}
          onDeleteFolder={handleDeleteFolder}
          onMoveToFolder={handleMoveToFolder}
          selectedItems={selectedStories}
        />

        {stories.length === 0 ? (
          <EmptyState
            icon={Layers}
            title="Aucune story"
            description="Commencez par créer votre première story"
            actionLabel="Créer une story"
            actionHref="/story/create"
          />
        ) : filteredStories.length === 0 && currentFolder !== null ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Aucune story dans ce dossier</p>
          </div>
        ) : (
          <StoriesList
            stories={filteredStories}
            onDelete={handleDelete}
            selectedStories={selectedStories}
            onStorySelect={handleStorySelect}
          />
        )}
      </div>
    </div>
  )
} 