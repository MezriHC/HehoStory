'use client'

import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <h1 className="text-9xl font-bold text-gray-200">404</h1>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900">Page non trouvée</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
      </p>
      <div className="mt-8 flex gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Home className="w-4 h-4" />
          Accueil
        </Link>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </button>
      </div>
    </div>
  )
} 