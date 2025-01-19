'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error:', error)
  }, [error])

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <h2 className="mb-2 text-2xl font-semibold">Une erreur est survenue</h2>
        <p className="mb-4 text-gray-600">
          {error.message || 'Quelque chose s\'est mal passé'}
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
} 