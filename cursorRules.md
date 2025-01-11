# HehoStory - E-commerce Story Platform

## Présentation de l'outil
HehoStory est un outil qui permet aux marques e-commerce de créer des "stories" similaires à celles des réseaux sociaux comme Instagram, et de les afficher sur les pages produits de leur site web.

## Bonnes Pratiques de Développement

### Architecture des Composants
1. **Composants Autonomes**
   - Chaque fonctionnalité majeure doit être un composant distinct
   - Éviter les composants imbriqués complexes
   - Un composant = une responsabilité unique

2. **Réutilisation des Composants**
   - Si un composant est utilisé dans plusieurs pages, le placer dans `components/common/`
   - Créer des composants génériques et programmables via les props
   - Exemple : `Button`, `Card`, `Modal` doivent être réutilisables

3. **Props Standardisées**
   - Textes et labels en props pour faciliter l'internationalisation
   - Styles personnalisables via les props
   - Callbacks pour les actions (`onClick`, `onSubmit`, etc.)

4. **Simplicité**
   - Un fichier = une fonctionnalité
   - Éviter les composants trop complexes ou trop imbriqués
   - Documenter clairement l'utilisation des props
   - Utiliser des noms explicites pour les composants et leurs props


### Exemples de Composants Réutilisables
```typescript
// Mauvaise pratique
<Button>Créer une story</Button>

// Bonne pratique
<Button
  label={t('create.story')}
  icon={<PlusIcon />}
  variant="primary"
  onClick={handleCreate}
/>
```

## Technologies utilisées
- Next.js - Framework React avec rendu côté serveur
- React 18.2.0 - Bibliothèque UI
- TypeScript - Typage statique
- TailwindCSS 3.4.1 - Framework CSS utilitaire
- Cloudflare Pages - Hébergement et déploiement
- Supabase - Base de données et backend
- Heroicons - Bibliothèque d'icônes
- React Dropzone - Gestion des uploads de fichiers

## Architecture du Projet

### Pages Principales
1. **Page d'accueil** (`/`)
   - Landing page présentant l'outil
   - Accès rapide à la création de stories et widgets

2. **Stories** (`/story`)
   - Liste des stories créées
   - Bouton de création de nouvelle story
   - Interface de gestion des stories existantes

3. **Création de Story** (`/story/create`)
   - Interface drag-and-drop pour l'upload de médias
   - Éditeur de story avec prévisualisation en temps réel
   - Configuration de la durée des slides
   - Support des images et vidéos

4. **Widgets** (`/widget`)
   - Gestion des widgets pour l'intégration sur les sites e-commerce
   - Création et personnalisation des widgets
   - Configuration des stories à afficher

## Structure des Fichiers

### Organisation Générale
```
src/
├── app/                    # Application principale
│   ├── components/         # Composants réutilisables
│   │   ├── EmptyState.tsx         # État vide générique
│   │   ├── Header.tsx             # En-tête de l'application
│   │   ├── MediaGrid.tsx          # Grille de médias
│   │   ├── ProductPageSkeleton.tsx # Squelette de page produit
│   │   ├── StoriesList.tsx        # Liste des stories
│   │   ├── StoryPreview.tsx       # Prévisualisation de story
│   │   ├── Toast.tsx              # Notifications toast
│   │   └── WidgetFormatSelector.tsx # Sélecteur de format widget
│   ├── profile/           # Pages de profil utilisateur
│   ├── story/             # Pages liées aux stories
│   ├── widget/            # Pages de gestion des widgets
│   ├── page.tsx           # Page d'accueil
│   ├── layout.tsx         # Layout principal
│   └── globals.css        # Styles globaux
└── types/                 # Définitions de types TypeScript

```

### Organisation des Composants
- **Components**: Composants réutilisables à travers l'application
  - Chaque composant est un fichier TypeScript React (.tsx)
  - Nommage explicite reflétant la fonction du composant
  - Organisation plate pour une meilleure découvrabilité

### Structure des Routes (Next.js App Router)
- **/** - Page d'accueil
- **/story** - Gestion des stories
- **/story/create** - Création de nouvelles stories
- **/widget** - Gestion des widgets
- **/widget/create** - Création de widgets
- **/profile** - Gestion du profil utilisateur

## Composants Principaux

### Header
- Logo HehoStory
- Navigation principale (Stories, Widgets)
- Sélecteur de langue (FR/EN)
- Accès au profil utilisateur
- Style minimaliste avec animations subtiles

### StoryEditor
- Interface de création/édition de story
- Gestion des slides (images/vidéos)
- Configuration de la durée par slide
- Fonctionnalités drag-and-drop pour réorganisation
- Contrôles de suppression et modification

### StoryPreview
- Prévisualisation en temps réel des stories
- Simulation du rendu mobile
- Navigation entre les slides
- Indicateurs de progression

### Container
- Composant de mise en page réutilisable
- Gestion des marges et du centrage
- Responsive design

### EmptyState
- Affichage des états vides
- Messages d'invitation à l'action
- Design engageant et informatif

## Style et Design
- Mode clair (light mode) par défaut
- Palette de couleurs minimaliste:
  - Fond blanc (#ffffff)
  - Texte noir (#171717)
  - Nuances de gris pour les éléments secondaires
- Typographie moderne et lisible
- Animations subtiles pour améliorer l'UX
- Design responsive et adaptatif
- Interface épurée et professionnelle

## Fonctionnalités Clés
1. **Gestion des Stories**
   - Upload d'images et vidéos
   - Configuration de la durée
   - Réorganisation des slides
   - Prévisualisation en temps réel

2. **Widgets Personnalisables**
   - Création de widgets intégrables
   - Configuration des stories à afficher
   - Options de personnalisation

3. **Internationalisation**
   - Support multilingue (FR/EN)
   - Interface de changement de langue

4. **Gestion de Profil**
   - Configuration du compte
   - Personnalisation de l'affichage des stories

## Règles de Déploiement
IMPORTANT: NE JAMAIS MODIFIER LES FICHIERS OU CONFIGURATIONS QUI PEUVENT AFFECTER LE DÉPLOIEMENT SUR CLOUDFLARE PAGES.