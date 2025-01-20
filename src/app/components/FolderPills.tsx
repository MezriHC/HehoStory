'use client'

import { useState } from 'react'
import { ChevronDown, Search, Trash2, FolderPlus, MoveRight, Pencil, Check, X } from 'lucide-react'
import { Folder } from '@/types/database.types'
import DeleteConfirmation from './DeleteConfirmation'

interface FolderPillsProps {
  folders: Folder[]
  currentFolder: string | null
  selectedItems?: string[]
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: (name: string) => void
  onDeleteFolder: (folderId: string) => void
  onMoveToFolder: (folderId: string | null) => void
  onRenameFolder?: (folderId: string, newName: string) => void
}

export default function FolderPills({
  folders,
  currentFolder,
  selectedItems = [],
  onFolderSelect,
  onCreateFolder,
  onDeleteFolder,
  onMoveToFolder,
  onRenameFolder
}: FolderPillsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isMoveMenuOpen, setIsMoveMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const [showCreateInput, setShowCreateInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [editingFolder, setEditingFolder] = useState<{ id: string, name: string } | null>(null)

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const currentFolderName = currentFolder
    ? folders.find(f => f.id === currentFolder)?.name
    : 'Tous les éléments'

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim())
      setNewFolderName('')
      setShowCreateInput(false)
      setIsDropdownOpen(false)
    }
  }

  const handleDeleteFolder = (folderId: string, folderName: string) => {
    setFolderToDelete(folderId)
  }

  const confirmDeleteFolder = () => {
    if (folderToDelete) {
      onDeleteFolder(folderToDelete)
      setFolderToDelete(null)
      setIsDropdownOpen(false)
    }
  }

  const handleRename = (folder: Folder) => {
    setEditingFolder({ id: folder.id, name: folder.name })
  }

  const handleRenameSubmit = () => {
    if (!editingFolder || !onRenameFolder) return
    
    const newName = editingFolder.name.trim()
    if (newName === '') return
    
    // Check if the name already exists
    if (folders.some(f => f.id !== editingFolder.id && f.name.toLowerCase() === newName.toLowerCase())) {
      alert('Un dossier avec ce nom existe déjà')
      return
    }
    
    onRenameFolder(editingFolder.id, newName)
    setEditingFolder(null)
    setIsDropdownOpen(false)
  }

  return (
    <>
      <DeleteConfirmation
        isOpen={folderToDelete !== null}
        onClose={() => setFolderToDelete(null)}
        onConfirm={confirmDeleteFolder}
        title="Supprimer le dossier"
        description="Êtes-vous sûr de vouloir supprimer ce dossier ? Les stories et les widgets qu'il contient seront déplacés à la racine."
      />

      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="inline-flex items-center px-3 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
          >
            {currentFolderName}
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>

          {isDropdownOpen && (
            <div className="absolute left-0 z-[200] mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-2 border-b border-gray-100">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un dossier..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-9 pl-8 pr-4 text-sm bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="max-h-64 overflow-y-auto p-1">
                <button
                  onClick={() => {
                    onFolderSelect(null)
                    setIsDropdownOpen(false)
                  }}
                  className={`w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 ${
                    currentFolder === null ? 'bg-gray-100' : ''
                  }`}
                >
                  Tous les éléments
                </button>

                {filteredFolders.map(folder => (
                  <div
                    key={folder.id}
                    className="group flex items-center"
                  >
                    {editingFolder?.id === folder.id ? (
                      <div className="flex items-center gap-2 flex-1 px-2 py-1">
                        <input
                          type="text"
                          value={editingFolder.name}
                          onChange={e => setEditingFolder(prev => prev ? { ...prev, name: e.target.value } : null)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRenameSubmit()
                            if (e.key === 'Escape') setEditingFolder(null)
                          }}
                          className="w-full px-2 py-1 text-sm bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                          autoFocus
                        />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleRenameSubmit()}
                            className="flex items-center justify-center w-8 h-8 text-green-600 hover:text-green-700 rounded-md hover:bg-gray-100"
                            title="Valider"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingFolder(null)}
                            className="flex items-center justify-center w-8 h-8 text-red-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                            title="Annuler"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            onFolderSelect(folder.id)
                            setIsDropdownOpen(false)
                          }}
                          className={`flex-1 px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100 ${
                            currentFolder === folder.id ? 'bg-gray-100' : ''
                          }`}
                        >
                          {folder.name}
                        </button>
                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 pr-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRename(folder)
                            }}
                            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
                            title="Renommer le dossier"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteFolder(folder.id, folder.name)
                            }}
                            className="flex items-center justify-center w-8 h-8 text-gray-400 hover:text-red-500 rounded-md hover:bg-gray-100"
                            title="Supprimer le dossier"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-gray-100">
                {showCreateInput ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Nom du dossier"
                      value={newFolderName}
                      onChange={e => setNewFolderName(e.target.value)}
                      className="flex-1 h-9 px-3 text-sm bg-gray-50 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleCreateFolder()
                        if (e.key === 'Escape') {
                          setNewFolderName('')
                          setShowCreateInput(false)
                        }
                      }}
                      autoFocus
                    />
                    <button
                      onClick={handleCreateFolder}
                      className="h-9 px-3 text-sm font-medium text-white bg-gray-900 rounded-md hover:bg-gray-800"
                    >
                      Créer
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowCreateInput(true)}
                    className="w-full px-3 py-2 text-sm text-left text-gray-700 rounded-md hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FolderPlus className="w-4 h-4" />
                    Nouveau dossier
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {selectedItems.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsMoveMenuOpen(!isMoveMenuOpen)}
              className="inline-flex items-center px-3 h-10 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
            >
              <MoveRight className="w-4 h-4 mr-2" />
              Déplacer {selectedItems.length} élément{selectedItems.length > 1 ? 's' : ''}
              <ChevronDown className="w-4 h-4 ml-2" />
            </button>

            {isMoveMenuOpen && (
              <div className="absolute left-0 z-[200] mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200">
                <div className="p-1">
                  <button
                    onClick={() => {
                      onMoveToFolder(null)
                      setIsMoveMenuOpen(false)
                    }}
                    className="w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                  >
                    Déplacer à la racine
                  </button>

                  {folders.map(folder => (
                    <button
                      key={folder.id}
                      onClick={() => {
                        onMoveToFolder(folder.id)
                        setIsMoveMenuOpen(false)
                      }}
                      className="w-full px-3 py-2 text-sm text-left rounded-md hover:bg-gray-100"
                    >
                      Déplacer dans {folder.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
} 