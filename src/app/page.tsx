'use client'

import { useEffect } from 'react'
import { redirect } from 'next/navigation'

export default function Home() {
  useEffect(() => {
    // Nettoyage des données de dossiers du localStorage
    localStorage.removeItem('story_folders')
    localStorage.removeItem('widget_folders')
    
    redirect('/story')
  }, [])

  return null
} 