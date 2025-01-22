# Nettoyage de la Base de Données et des Assets

## 1. Situation Actuelle

### 1.1 Problèmes Identifiés

#### Dans les Stories (`src/app/story/page.tsx`)
- La suppression d'une story ne supprime pas les fichiers médias associés dans le bucket Supabase
- Les miniatures restent dans le bucket après suppression
- Les références aux stories dans les widgets ne sont pas mises à jour

```typescript
// Code actuel problématique
const confirmDelete = async () => {
  if (!storyToDelete || !userId) return
  try {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyToDelete)
      .eq('author_id', userId)
    // Pas de nettoyage des médias ou des références
  } catch (error) {
    console.error('Error deleting story:', error)
  }
}
```

#### Dans les Widgets (`src/app/widget/page.tsx`)
- La suppression d'un widget ne vérifie pas les références aux stories
- Pas de validation des IDs de stories lors de la mise à jour

```typescript
// Code actuel problématique
const confirmDelete = async () => {
  if (!widgetToDelete) return
  try {
    const { error } = await authClient
      .from('widgets')
      .delete()
      .eq('id', widgetToDelete)
    // Pas de nettoyage des références
  } catch (error) {
    console.error('Error deleting widget:', error)
  }
}
```

### 1.2 Structure Actuelle des Données

#### Tables Supabase
- `stories`: Stockage des stories
- `widgets`: Stockage des widgets
- `folders`: Organisation des stories et widgets

#### Bucket Storage
- `/media`: Stockage des fichiers médias
  - `/{userId}/stories/`: Fichiers des stories
  - `/{userId}/thumbnails/`: Miniatures
  - `/{userId}/profile/`: Images de profil

## 2. Plan d'Action

### 2.1 Modifications de la Base de Données

#### Création de Nouvelles Contraintes
```sql
-- À ajouter dans une migration Supabase
ALTER TABLE widgets 
ADD CONSTRAINT fk_author 
FOREIGN KEY (author_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE stories 
ADD CONSTRAINT fk_author 
FOREIGN KEY (author_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;

ALTER TABLE folders 
ADD CONSTRAINT fk_author 
FOREIGN KEY (author_id) 
REFERENCES auth.users(id) 
ON DELETE CASCADE;
```

#### Création de Triggers
```sql
-- Trigger pour le nettoyage des références de stories
CREATE OR REPLACE FUNCTION cleanup_story_references()
RETURNS TRIGGER AS $$
BEGIN
  -- Mise à jour des widgets qui référencent la story supprimée
  UPDATE widgets 
  SET story_ids = array_remove(story_ids, OLD.id)
  WHERE story_ids @> ARRAY[OLD.id];
  
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER story_cleanup_trigger
BEFORE DELETE ON stories
FOR EACH ROW
EXECUTE FUNCTION cleanup_story_references();
```

### 2.2 Modifications du Code

#### 1. Création d'un Service de Gestion des Assets (`src/services/assetManager.ts`)
```typescript
export class AssetManager {
  constructor(private supabase: SupabaseClient) {}

  async deleteStoryAssets(storyId: string, userId: string) {
    const { data: story } = await this.supabase
      .from('stories')
      .select('content, thumbnail')
      .eq('id', storyId)
      .single()

    if (!story) return

    // Extraire les URLs des médias
    const content = JSON.parse(story.content || '{}')
    const mediaUrls = content.mediaItems?.map(item => item.url) || []
    
    // Ajouter la miniature si elle existe
    if (story.thumbnail) {
      mediaUrls.push(story.thumbnail)
    }

    // Supprimer tous les fichiers
    const filePaths = mediaUrls
      .filter(url => url.includes('supabase'))
      .map(url => url.split('/').slice(-2).join('/'))

    if (filePaths.length > 0) {
      await this.supabase.storage
        .from('media')
        .remove(filePaths)
    }
  }

  async cleanupOrphanedMedia() {
    // Liste tous les fichiers dans le bucket
    const { data: files } = await this.supabase.storage
      .from('media')
      .list()

    // Récupère toutes les références utilisées
    const { data: stories } = await this.supabase
      .from('stories')
      .select('content, thumbnail')

    const usedFiles = new Set()
    stories.forEach(story => {
      if (story.thumbnail) usedFiles.add(story.thumbnail)
      const content = JSON.parse(story.content || '{}')
      content.mediaItems?.forEach(item => {
        if (item.url) usedFiles.add(item.url)
      })
    })

    // Supprime les fichiers orphelins
    const orphanedFiles = files.filter(file => !usedFiles.has(file.name))
    if (orphanedFiles.length > 0) {
      await this.supabase.storage
        .from('media')
        .remove(orphanedFiles.map(f => f.name))
    }
  }
}
```

#### 2. Mise à Jour du Gestionnaire de Stories (`src/app/story/page.tsx`)
```typescript
import { AssetManager } from '@/services/assetManager'

// Dans le composant StoriesPage
const confirmDelete = async () => {
  if (!storyToDelete || !userId) return

  try {
    const assetManager = new AssetManager(supabase)
    
    // 1. Supprimer les assets
    await assetManager.deleteStoryAssets(storyToDelete, userId)

    // 2. Supprimer la story (le trigger s'occupera des références)
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', storyToDelete)
      .eq('author_id', userId)

    if (error) throw error

    setStoryToDelete(null)
    await refetchStories()
    setToast({ message: 'Story supprimée avec succès', visible: true })
  } catch (error) {
    console.error('Error deleting story:', error)
    setToast({ 
      message: 'Erreur lors de la suppression de la story', 
      visible: true 
    })
  }
}
```

#### 3. Mise à Jour du Gestionnaire de Widgets (`src/app/widget/page.tsx`)
```typescript
// Dans le composant WidgetsPage
const confirmDelete = async () => {
  if (!widgetToDelete || !userId) return

  try {
    // Vérifier que l'utilisateur est propriétaire du widget
    const { error } = await authClient
      .from('widgets')
      .delete()
      .eq('id', widgetToDelete)
      .eq('author_id', userId)

    if (error) throw error

    setWidgets(prev => prev.filter(w => w.id !== widgetToDelete))
    setWidgetToDelete(null)
    setToast({
      message: 'Widget supprimé avec succès',
      visible: true,
      type: 'success'
    })
  } catch (error) {
    console.error('Error deleting widget:', error)
    setToast({
      message: 'Erreur lors de la suppression du widget',
      visible: true,
      type: 'error'
    })
  }
}
```

### 2.3 Tâches de Maintenance

#### 1. Création d'un Job de Nettoyage (`src/jobs/cleanup.ts`)
```typescript
import { createClient } from '@supabase/supabase-js'
import { AssetManager } from '@/services/assetManager'

export async function runCleanupJob() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const assetManager = new AssetManager(supabase)

  try {
    console.log('Starting cleanup job...')
    
    // 1. Nettoyage des médias orphelins
    await assetManager.cleanupOrphanedMedia()
    
    // 2. Vérification des références de widgets
    const { data: widgets } = await supabase
      .from('widgets')
      .select('id, story_ids')

    // 3. Nettoyage des références invalides
    for (const widget of widgets) {
      if (!widget.story_ids?.length) continue

      const { data: validStories } = await supabase
        .from('stories')
        .select('id')
        .in('id', widget.story_ids)

      const validIds = validStories.map(s => s.id)
      const newStoryIds = widget.story_ids.filter(id => validIds.includes(id))

      if (newStoryIds.length !== widget.story_ids.length) {
        await supabase
          .from('widgets')
          .update({ story_ids: newStoryIds })
          .eq('id', widget.id)
      }
    }

    console.log('Cleanup job completed successfully')
  } catch (error) {
    console.error('Error during cleanup job:', error)
  }
}
```

## 3. Plan de Déploiement

### 3.1 Étapes de Migration
1. Sauvegarder la base de données actuelle
2. Appliquer les nouvelles contraintes SQL
3. Créer les triggers de nettoyage
4. Déployer les nouveaux services et composants
5. Exécuter le job de nettoyage initial

### 3.2 Tests à Effectuer
1. Suppression d'une story
   - Vérifier la suppression des fichiers médias
   - Vérifier la mise à jour des widgets
2. Suppression d'un widget
   - Vérifier l'intégrité des références
3. Test du job de nettoyage
   - Vérifier la détection des fichiers orphelins
   - Vérifier la mise à jour des références

### 3.3 Monitoring
- Mettre en place des logs pour suivre les suppressions
- Configurer des alertes pour les erreurs de suppression
- Suivre l'utilisation du stockage

## 4. Maintenance Continue

### 4.1 Tâches Périodiques
- Exécuter le job de nettoyage quotidiennement
- Vérifier les logs d'erreurs
- Surveiller l'utilisation du stockage

### 4.2 Documentation
- Mettre à jour la documentation technique
- Documenter les procédures de récupération
- Maintenir un journal des modifications

## 5. Considérations de Sécurité

### 5.1 Permissions
- Vérifier les permissions avant chaque suppression
- Utiliser des rôles Supabase appropriés
- Limiter l'accès aux buckets de stockage

### 5.2 Validation
- Valider les types de fichiers
- Limiter la taille des fichiers
- Vérifier l'intégrité des données

### 5.3 Audit
- Logger les opérations de suppression
- Tracer les modifications de données
- Conserver un historique des actions 