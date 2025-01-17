'use client'

import { Layers, Plus } from 'lucide-react'
import EmptyState from '../components/EmptyState'
import EmptyFolderState from '../components/EmptyFolderState'
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

interface ToastState {
  message: string
  visible: boolean
  type?: 'success' | 'error' | 'info'
}

export default function StoriesPage() {
  const router = useRouter()
  const { userId, loading: authLoading, supabase } = useAuth()
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [selectedStories, setSelectedStories] = useState<string[]>([])
  const [toast, setToast] = useState<ToastState>({ 
    message: '', 
    visible: false,
    type: 'success'
  })
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
    
    // Validation du nom
    const trimmedName = name.trim()
    if (trimmedName.length < 1 || trimmedName.length > 50) {
      setToast({ 
        message: 'Le nom du dossier doit contenir entre 1 et 50 caractères', 
        visible: true,
        type: 'error'
      })
      return
    }

    // Vérifier si le dossier existe déjà
    const existingFolder = folders.find(
      f => f.name.toLowerCase() === trimmedName.toLowerCase()
    )
    if (existingFolder) {
      setToast({ 
        message: 'Un dossier avec ce nom existe déjà', 
        visible: true,
        type: 'error'
      })
      return
    }

    try {
      // Vérifier le nombre de dossiers
      if (folders.length >= 50) {
        setToast({ 
          message: 'Vous avez atteint la limite de 50 dossiers', 
          visible: true,
          type: 'error'
        })
        return
      }

      const { data: folder, error: folderError } = await supabase
        .from('folders')
        .insert({
          name: trimmedName,
          author_id: userId
        })
        .select()
        .single()

      if (folderError) throw folderError

      // Si des stories sont sélectionnées, les déplacer
      if (selectedStories.length > 0) {
        const { error: updateError } = await supabase
          .from('stories')
          .update({ folder_id: folder.id })
          .in('id', selectedStories)

        if (updateError) throw updateError
      }

      await Promise.all([refetchFolders(), refetchStories()])
      setSelectedStories([])
      setToast({ 
        message: `Dossier "${trimmedName}" créé avec succès`, 
        visible: true,
        type: 'success'
      })
    } catch (error) {
      console.error('Error creating folder:', error)
      setToast({ 
        message: 'Erreur lors de la création du dossier', 
        visible: true,
        type: 'error'
      })
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!userId || !folderId) return

    try {
      // Vérifier si le dossier contient des stories
      const storiesInFolder = stories.filter(s => s.folder_id === folderId)
      
      if (storiesInFolder.length > 0) {
        const confirmMessage = `Ce dossier contient ${storiesInFolder.length} élément${
          storiesInFolder.length > 1 ? 's' : ''
        }. Ces éléments seront déplacés à la racine. Êtes-vous sûr de vouloir continuer ?`
        
        if (!window.confirm(confirmMessage)) {
          return
        }
      }

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
        .eq('author_id', userId) // Vérification supplémentaire de la propriété

      if (deleteError) throw deleteError

      await Promise.all([refetchFolders(), refetchStories()])

      if (currentFolder === folderId) {
        setCurrentFolder(null)
      }

      setToast({ 
        message: 'Dossier supprimé avec succès', 
        visible: true,
        type: 'success'
      })
    } catch (error) {
      console.error('Error deleting folder:', error)
      setToast({ 
        message: 'Erreur lors de la suppression du dossier', 
        visible: true,
        type: 'error'
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
          <EmptyFolderState 
            message={`Aucune story dans ${
              folders.find(f => f.id === currentFolder)?.name || 'ce dossier'
            }`}
          />
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