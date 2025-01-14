'use client'

import { Folder, FolderOpen, MoreVertical, Plus } from 'lucide-react'
import { useState, useEffect } from 'react'
import EmptyState from './EmptyState'

export interface FolderItem {
  id: string
  name: string
  type: 'story' | 'widget'
  createdAt: Date
}

interface FolderViewProps {
  type: 'story' | 'widget'
  onCreateFolder: (name: string) => void
  onRenameFolder: (id: string, name: string) => void
  onDeleteFolder: (id: string) => void
  onBack: () => void
}

export default function FolderView({ type, onCreateFolder, onRenameFolder, onDeleteFolder, onBack }: FolderViewProps) {
  const [folders, setFolders] = useState<FolderItem[]>([])
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedFolder, setSelectedFolder] = useState<FolderItem | null>(null)
  const [newFolderName, setNewFolderName] = useState('')

  // Charger les dossiers depuis le localStorage
  useEffect(() => {
    const storedFolders = localStorage.getItem(`${type}_folders`)
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders))
    }
  }, [type])

  // Sauvegarder les dossiers dans le localStorage
  useEffect(() => {
    localStorage.setItem(`${type}_folders`, JSON.stringify(folders))
  }, [folders, type])

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return

    const newFolder: FolderItem = {
      id: Math.random().toString(36).substr(2, 9),
      name: newFolderName,
      type,
      createdAt: new Date()
    }

    setFolders([...folders, newFolder])
    setNewFolderName('')
    setIsCreateModalOpen(false)
    onCreateFolder(newFolderName)
  }

  const handleRenameFolder = (folder: FolderItem, newName: string) => {
    if (!newName.trim()) return

    const updatedFolders = folders.map(f => 
      f.id === folder.id ? { ...f, name: newName } : f
    )
    setFolders(updatedFolders)
    onRenameFolder(folder.id, newName)
  }

  const handleDeleteFolder = (folder: FolderItem) => {
    const updatedFolders = folders.filter(f => f.id !== folder.id)
    setFolders(updatedFolders)
    onDeleteFolder(folder.id)
  }

  if (folders.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Dossiers</h1>
              <p className="mt-2 text-gray-600">
                Organisez vos {type === 'story' ? 'stories' : 'widgets'} dans des dossiers
              </p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Retour aux {type === 'story' ? 'stories' : 'widgets'}
              </button>

              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
              >
                <Plus className="w-4 h-4 mr-2" />
                Créer un dossier
              </button>
            </div>
          </div>

          <div>
            <EmptyState
              icon={Folder}
              title="Aucun dossier"
              description={`Commencez par créer un dossier pour organiser vos ${type === 'story' ? 'stories' : 'widgets'}`}
              actionLabel="Créer un dossier"
              onAction={() => setIsCreateModalOpen(true)}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dossiers</h1>
            <p className="mt-2 text-gray-600">
              Organisez vos {type === 'story' ? 'stories' : 'widgets'} dans des dossiers
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onBack}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-gray-700 transition-all bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
            >
              Retour aux {type === 'story' ? 'stories' : 'widgets'}
            </button>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium text-white transition-all bg-gray-900 rounded-lg hover:bg-gray-800"
            >
              <Plus className="w-4 h-4 mr-2" />
              Créer un dossier
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {folders.map(folder => (
            <div
              key={folder.id}
              className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <FolderOpen className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">{folder.name}</h3>
                    <p className="text-xs text-gray-500">
                      Créé le {new Date(folder.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <button
                    onClick={() => setSelectedFolder(folder)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-500" />
                  </button>

                  {selectedFolder?.id === folder.id && (
                    <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                      <button
                        onClick={() => {
                          const newName = prompt('Nouveau nom du dossier', folder.name)
                          if (newName) {
                            handleRenameFolder(folder, newName)
                          }
                          setSelectedFolder(null)
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-50"
                      >
                        Renommer
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) {
                            handleDeleteFolder(folder)
                          }
                          setSelectedFolder(null)
                        }}
                        className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de création de dossier */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Créer un nouveau dossier
            </h2>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nom du dossier"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setNewFolderName('')
                }}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="px-4 py-2 text-sm text-white bg-gray-900 rounded-lg hover:bg-gray-800 disabled:opacity-50"
              >
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 