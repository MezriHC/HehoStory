import { useState, useCallback } from 'react'
import fr from '@/locales/fr.json'
import en from '@/locales/en.json'

type Language = 'FR' | 'EN'
type Translations = typeof fr

const translations = {
  FR: fr,
  EN: en,
}

export const useTranslation = () => {
  const [language, setLanguage] = useState<Language>('FR')

  const t = useCallback((key: string) => {
    const keys = key.split('.')
    let value: any = translations[language]
    
    for (const k of keys) {
      if (value === undefined) return key
      value = value[k]
    }
    
    return value || key
  }, [language])

  return {
    t,
    language,
    setLanguage,
  }
} 