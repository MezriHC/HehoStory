# Guide de l'Application HehoStory

## Vue d'ensemble
HehoStory est une application de gestion de stories et de widgets pour l'e-commerce. Elle permet aux utilisateurs de créer, gérer et intégrer des stories interactives dans leurs sites web.

## Architecture

### Structure des données principales

#### Story
Une story est une unité de contenu contenant :
- `id`: Identifiant unique
- `title`: Titre de la story
- `thumbnail`: Image de couverture
- `content`: Contenu JSON contenant les médias (images/vidéos)
- `author_id`: ID de l'auteur
- `published`: État de publication
- `profile_image`: Image de profil (optionnel)
- `profile_name`: Nom du profil (optionnel)
- `folder_id`: ID du dossier parent (optionnel)

#### Widget
Un widget est un conteneur configurable pour afficher des stories :
- `id`: Identifiant unique
- `name`: Nom du widget
- `format`: Configuration d'affichage (type, taille, alignement)
- `story_ids`: Liste ordonnée des IDs des stories
- `settings`: Paramètres additionnels
- `published`: État de publication
- `author_id`: ID de l'auteur
- `folder_id`: ID du dossier parent (optionnel)

### Formats de Widget
Trois types de formats sont disponibles :
1. `bubble`: Affichage circulaire style Instagram
2. `card`: Affichage en carte verticale
3. `square`: Affichage carré

Chaque format peut avoir différentes tailles (S, M, L) et alignements (left, center, right).

## Flux de données

### Création/Édition de Story
1. Upload des médias (images/vidéos)
2. Génération automatique des thumbnails
3. Stockage des médias dans Supabase Storage
4. Sauvegarde des métadonnées dans la table `stories`

### Création/Édition de Widget
1. Sélection du format (type, taille, alignement)
2. Sélection et ordonnancement des stories
3. Configuration des paramètres
4. Sauvegarde dans la table `widgets`

### Système de dossiers
- Les stories et widgets peuvent être organisés dans des dossiers
- La structure est plate (pas de sous-dossiers)
- Les éléments peuvent être déplacés entre dossiers

## Composants clés

### StoriesList
- Affiche la grille des stories disponibles
- Gère la sélection multiple
- Permet la prévisualisation, l'édition et la suppression

### WidgetEditor
- Interface de création/édition de widget en 3 étapes :
  1. Choix du format
  2. Sélection des stories
  3. Configuration et arrangement

### BrowserPreview
- Prévisualisation en temps réel des widgets
- Simule différents environnements (desktop, mobile)

## Sécurité et Permissions
- Authentification via Supabase Auth
- Vérification de `author_id` pour toutes les opérations
- Protection des routes d'édition

## Gestion des états
- États locaux pour les interactions UI
- États globaux via React hooks personnalisés
- Mise à jour optimiste pour une meilleure UX

## Bonnes pratiques
1. Toujours vérifier l'existence des stories avant de les afficher
2. Parser le format du widget s'il est stocké en string
3. Maintenir l'ordre des stories dans les widgets
4. Gérer les cas d'erreur et les états de chargement
5. Valider les données côté client et serveur

## Points d'attention
1. Le format du widget peut être stocké comme string ou objet
2. Les story_ids doivent toujours être un tableau (même vide)
3. Les thumbnails peuvent provenir de la story ou du premier média
4. L'ordre des stories dans un widget doit être préservé

## Structure du Projet

### Organisation des dossiers
```
src/
├── app/                    # Application Next.js
│   ├── auth/              # Pages d'authentification
│   │   ├── signin/        # Connexion
│   │   └── signup/        # Inscription
│   ├── story/             # Gestion des stories
│   │   ├── create/        # Création/édition de story
│   │   └── page.tsx       # Liste des stories
│   ├── widget/            # Gestion des widgets
│   │   ├── [id]/         # Routes dynamiques par widget
│   │   │   └── edit/     # Édition d'un widget existant
│   │   ├── create/       # Création de widget
│   │   └── page.tsx      # Liste des widgets
│   └── components/        # Composants réutilisables
│       ├── StoriesList.tsx       # Liste des stories
│       ├── WidgetEditor.tsx      # Éditeur de widget
│       ├── StoryStyle.tsx        # Styles de story
│       ├── BrowserPreview.tsx    # Prévisualisation
│       └── ...                   # Autres composants
├── hooks/                 # Hooks personnalisés
│   ├── useAuth.ts        # Gestion de l'authentification
│   └── ...               # Autres hooks
├── lib/                  # Bibliothèques et configurations
│   ├── supabase.ts      # Configuration Supabase
│   └── ...              # Autres configurations
└── types/               # Types TypeScript
    └── database.types.ts # Types de la base de données
```

### Composants principaux

#### Pages
- `app/page.tsx`: Page d'accueil
- `app/story/page.tsx`: Gestionnaire de stories
- `app/widget/page.tsx`: Gestionnaire de widgets
- `app/story/create/page.tsx`: Création/édition de story
- `app/widget/create/page.tsx`: Création de widget
- `app/widget/[id]/edit/page.tsx`: Édition de widget

#### Composants réutilisables
- `StoriesList.tsx`: Affichage et gestion des stories
- `WidgetEditor.tsx`: Interface d'édition de widget
- `StoryStyle.tsx`: Styles et rendu des stories
- `BrowserPreview.tsx`: Prévisualisation des widgets
- `DeleteConfirmation.tsx`: Modal de confirmation
- `FolderPills.tsx`: Navigation des dossiers
- `Toast.tsx`: Notifications système
- `Loader.tsx`: Indicateurs de chargement

### Architecture des données

#### Base de données (Supabase)
```
Tables:
├── stories
│   ├── id
│   ├── title
│   ├── thumbnail
│   ├── content
│   ├── author_id
│   ├── published
│   ├── created_at
│   ├── profile_image
│   ├── profile_name
│   └── folder_id
├── widgets
│   ├── id
│   ├── name
│   ├── format
│   ├── story_ids
│   ├── settings
│   ├── published
│   ├── created_at
│   ├── author_id
│   └── folder_id
├── folders
│   ├── id
│   ├── name
│   ├── author_id
│   └── created_at
└── preferences
    ├── user_id
    └── widget_border_color
```

### Routing et Navigation
- Routes dynamiques avec Next.js App Router
- Navigation côté client avec `useRouter`
- Protection des routes via `useAuth`
- Gestion des paramètres d'URL pour l'édition


MANDATORY: WHEN MAKING CHANGES, YOU MUST ALWAYS CONFIRM TO THE USER THAT NO CORE FUNCTIONALITY HAS BEEN LOST OR CODE DELETED!!!