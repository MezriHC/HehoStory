'use client'

import { FolderPlus, Search, Trash2, FolderIcon, MoreVertical, ChevronRight } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { Database } from '@/types/database.types'
import DeleteConfirmation from './DeleteConfirmation'

type Folder = Database['public']['Tables']['folders']['Row']

interface FolderMenuProps {
  folders: Folder[]
  currentFolder: string | null
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: () => void
  onDeleteFolder?: (folderId: string) => void
  selectedCount?: number
  onMoveToFolder?: (folderId: string) => void
}

export default function FolderMenu({
  folders,
  currentFolder,
  onFolderSelect,
  onCreateFolder,
  onDeleteFolder,
  selectedCount = 0,
  onMoveToFolder
}: FolderMenuProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [showFolderActions, setShowFolderActions] = useState<string | null>(null)
  const [folderToDelete, setFolderToDelete] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const actionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
      if (actionRef.current && !actionRef.current.contains(event.target as Node)) {
        setShowFolderActions(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <>
      <DeleteConfirmation
        isOpen={folderToDelete !== null}
        onClose={() => setFolderToDelete(null)}
        onConfirm={() => {
          if (folderToDelete && onDeleteFolder) {
            onDeleteFolder(folderToDelete)
            setFolderToDelete(null)
          }
        }}
        title="Supprimer le dossier"
        description="Êtes-vous sûr de vouloir supprimer ce dossier ? Les éléments qu'il contient seront déplacés à la racine."
      />

      <div className="flex flex-col gap-4 bg-white rounded-xl border border-gray-200 p-4">
        {/* Header avec recherche et création */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un dossier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            />
          </div>
          <button
            onClick={onCreateFolder}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FolderPlus className="w-4 h-4" />
            Nouveau
          </button>
        </div>

        {/* Liste des dossiers */}
        <div className="space-y-1">
          <button
            onClick={() => onFolderSelect(null)}
            className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
              !currentFolder
                ? 'bg-gray-900 text-white'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <FolderIcon className="w-4 h-4" />
            Tous les éléments
          </button>

          {filteredFolders.map((folder) => (
            <div key={folder.id} className="relative group">
              <button
                onClick={() => onFolderSelect(folder.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-colors ${
                  currentFolder === folder.id
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FolderIcon className="w-4 h-4" />
                <span className="flex-1 text-left truncate">{folder.name}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowFolderActions(showFolderActions === folder.id ? null : folder.id)
                  }}
                  className={`opacity-0 group-hover:opacity-100 p-1 rounded-md transition-colors ${
                    currentFolder === folder.id ? 'text-white/80 hover:text-white' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
              </button>

              {/* Menu d'actions du dossier */}
              {showFolderActions === folder.id && (
                <div
                  ref={actionRef}
                  className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
                >
                  {onMoveToFolder && selectedCount > 0 && (
                    <button
                      onClick={() => {
                        onMoveToFolder(folder.id)
                        setShowFolderActions(null)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <ChevronRight className="w-4 h-4" />
                      Déplacer la sélection ici
                    </button>
                  )}
                  {onDeleteFolder && (
                    <button
                      onClick={() => {
                        setFolderToDelete(folder.id)
                        setShowFolderActions(null)
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                      Supprimer
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message de sélection */}
        {selectedCount > 0 && (
          <div className="mt-2 px-3 py-2 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              {selectedCount} {selectedCount === 1 ? 'élément sélectionné' : 'éléments sélectionnés'}
            </p>
          </div>
        )}
      </div>
    </>
  )
} 