'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface FolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (folderName: string) => void;
  initialName?: string;
}

export default function FolderModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  initialName = '' 
}: FolderModalProps) {
  const [folderName, setFolderName] = useState(initialName);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-semibold mb-4">
          {initialName ? 'Renommer le dossier' : 'Créer un dossier'}
        </h3>
        
        <input
          type="text"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
          placeholder="Nom du dossier"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          autoFocus
        />
        
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={() => {
              if (folderName.trim()) {
                onConfirm(folderName.trim());
                setFolderName('');
                onClose();
              }
            }}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            disabled={!folderName.trim()}
          >
            {initialName ? 'Renommer' : 'Créer'}
          </button>
        </div>
      </div>
    </div>
  );
} 