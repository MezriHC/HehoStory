'use client'

import { FolderOpen } from 'lucide-react'

interface EmptyFolderStateProps {
  message?: string
}

export default function EmptyFolderState({ 
  message = 'Aucun élément dans ce dossier'
}: EmptyFolderStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gray-50 rounded-full p-4 mb-4">
        <FolderOpen className="w-8 h-8 text-gray-400" />
      </div>
      <p className="text-gray-500 text-center font-medium">
        {message}
      </p>
      <p className="text-gray-400 text-sm text-center mt-1">
        Déplacez des éléments ici ou créez-en de nouveaux
      </p>
    </div>
  )
} 