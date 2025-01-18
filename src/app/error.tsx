'use client'

import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="flex items-center gap-2 text-red-600 mb-4">
        <AlertCircle className="w-6 h-6" />
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
      </div>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        {error.message || 'Une erreur inattendue s\'est produite. Veuillez réessayer.'}
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Rafraîchir la page
        </button>
        <button
          onClick={() => reset()}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
} 