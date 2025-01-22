# Nettoyage des Fichiers lors de la Suppression d'une Story

## 1. Analyse du Système Actuel

### 1.1 Structure de Stockage des Fichiers

Dans le bucket Supabase `media`, les fichiers sont organisés comme suit :
```
media/
├── {userId}/
│   ├── stories/           # Fichiers médias des stories
│   │   ├── {timestamp}-{filename}
│   ├── thumbnails/        # Miniatures des stories et vidéos
│   │   ├── {timestamp}-{filename}
│   └── profile/           # Images de profil
│       └── {timestamp}-{filename}
```

### 1.2 Processus de Création d'une Story

1. **Upload des Médias** (`src/app/story/create/page.tsx`)
```typescript
// Pour chaque fichier média
const filePath = `${userId}/stories/${Date.now()}-${file.name}`
await supabase.storage
  .from('media')
  .upload(filePath, file, {
    cacheControl: '3600',
    upsert: false
  })
```

2. **Génération des Miniatures**
- Pour les vidéos, une miniature est générée et stockée dans `/thumbnails/`
- Une miniature principale est requise pour chaque story

3. **Stockage en Base de Données**
```typescript
const storyData = {
  title: string
  content: string // JSON contenant les URLs des médias
  thumbnail: string // URL de la miniature principale
  // ... autres champs
}
```

### 1.3 Problème Actuel de Suppression

Dans `src/app/story/page.tsx`, la suppression actuelle :
```typescript
const confirmDelete = async () => {
  if (!storyToDelete || !userId) return
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyToDelete)
      .eq('author_id', userId)
    // Les fichiers restent dans le bucket
  } catch (error) {
    console.error('Error deleting story:', error)
  }
}
```

**Problèmes identifiés :**
1. Les fichiers médias restent dans le bucket
2. Les miniatures ne sont pas supprimées
3. Pas de gestion des erreurs d'upload/suppression
4. Pas de vérification des permissions

## 2. Solution Proposée

### 2.1 Création d'un Service de Nettoyage

Créer `src/services/mediaCleanup.ts` :
```typescript
export class MediaCleanupService {
  constructor(private supabase: SupabaseClient) {}

  async getStoryMediaPaths(storyId: string): Promise<string[]> {
    const { data: story } = await this.supabase
      .from('stories')
      .select('content, thumbnail')
      .eq('id', storyId)
      .single()

    if (!story) return []

    const paths: string[] = []
    
    // Ajouter la miniature principale
    if (story.thumbnail) {
      const thumbnailPath = this.extractPathFromUrl(story.thumbnail)
      if (thumbnailPath) paths.push(thumbnailPath)
    }

    // Ajouter les chemins des médias
    try {
      const content = JSON.parse(story.content || '{}')
      const mediaItems = content.mediaItems || []
      
      for (const item of mediaItems) {
        // Chemin du média
        const mediaPath = this.extractPathFromUrl(item.url)
        if (mediaPath) paths.push(mediaPath)

        // Chemin de la miniature vidéo si elle existe
        if (item.thumbnailUrl) {
          const thumbnailPath = this.extractPathFromUrl(item.thumbnailUrl)
          if (thumbnailPath) paths.push(thumbnailPath)
        }
      }
    } catch (error) {
      console.error('Error parsing story content:', error)
    }

    return paths.filter(Boolean)
  }

  private extractPathFromUrl(url: string): string | null {
    try {
      if (!url.includes('supabase')) return null
      return url.split('/').slice(-2).join('/')
    } catch {
      return null
    }
  }

  async deleteStoryMedia(storyId: string, userId: string): Promise<{
    success: boolean
    deletedPaths: string[]
    errors: any[]
  }> {
    const paths = await this.getStoryMediaPaths(storyId)
    const errors: any[] = []
    const deletedPaths: string[] = []

    if (paths.length === 0) {
      return { success: true, deletedPaths: [], errors: [] }
    }

    // Vérifier que tous les chemins appartiennent à l'utilisateur
    const invalidPaths = paths.filter(path => !path.startsWith(`${userId}/`))
    if (invalidPaths.length > 0) {
      throw new Error('Unauthorized: Some media files do not belong to the user')
    }

    // Supprimer les fichiers par lots de 10
    const chunks = this.chunkArray(paths, 10)
    for (const chunk of chunks) {
      try {
        const { error } = await this.supabase.storage
          .from('media')
          .remove(chunk)

        if (error) {
          errors.push(error)
        } else {
          deletedPaths.push(...chunk)
        }
      } catch (error) {
        errors.push(error)
      }
    }

    return {
      success: errors.length === 0,
      deletedPaths,
      errors
    }
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }
}
```

### 2.2 Mise à Jour du Gestionnaire de Stories

Modifier `src/app/story/page.tsx` :
```typescript
import { MediaCleanupService } from '@/services/mediaCleanup'

// Dans le composant StoriesPage
const confirmDelete = async () => {
  if (!storyToDelete || !userId) return

  try {
    const cleanupService = new MediaCleanupService(supabase)
    
    // 1. Supprimer les fichiers médias
    const { success, deletedPaths, errors } = await cleanupService.deleteStoryMedia(
      storyToDelete,
      userId
    )

    if (errors.length > 0) {
      console.error('Errors during media cleanup:', errors)
    }

    // 2. Supprimer la story de la base de données
    const { error: deleteError } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyToDelete)
      .eq('author_id', userId)

    if (deleteError) throw deleteError

    // 3. Mettre à jour l'UI
    setStoryToDelete(null)
    await refetchStories()

    // 4. Notifier l'utilisateur
    setToast({
      message: `Story supprimée avec succès${
        deletedPaths.length > 0 
          ? ` (${deletedPaths.length} fichiers nettoyés)`
          : ''
      }`,
      visible: true,
      type: 'success'
    })
  } catch (error) {
    console.error('Error deleting story:', error)
    setToast({
      message: 'Erreur lors de la suppression de la story',
      visible: true,
      type: 'error'
    })
  }
}
```

## 3. Plan d'Implémentation

### 3.1 Étapes
1. Créer et tester le `MediaCleanupService`
2. Mettre à jour le gestionnaire de suppression
3. Ajouter des logs détaillés
4. Tester en environnement de développement

### 3.2 Tests à Effectuer
1. Suppression d'une story avec :
   - Images uniquement
   - Vidéos avec miniatures
   - Mélange d'images et vidéos
2. Tentative de suppression de fichiers d'un autre utilisateur
3. Gestion des erreurs de suppression partielles

### 3.3 Considérations de Sécurité
1. Vérifier les permissions utilisateur
2. Valider les chemins de fichiers
3. Gérer les timeouts et les erreurs réseau

## 4. Maintenance

### 4.1 Monitoring
- Logger les suppressions de fichiers
- Suivre l'utilisation du stockage
- Alerter sur les erreurs de suppression

### 4.2 Nettoyage Périodique
Envisager un job de nettoyage pour :
- Fichiers orphelins
- Miniatures non référencées
- Fichiers temporaires 