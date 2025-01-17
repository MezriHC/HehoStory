# HehoStory - Plateforme de Stories E-commerce

## Vue d'ensemble
HehoStory est une solution SaaS permettant aux e-commerçants de créer et d'intégrer des stories interactives sur leurs sites web, similaires à celles d'Instagram.

## Architecture Technique

### Stack Technologique
- **Frontend** : Next.js (React 18.2.0)
- **Langage** : TypeScript
- **Styling** : TailwindCSS 3.4.1
- **Backend** : Supabase
- **Gestion des médias** : React Dropzone
- **UI Kit** : Heroicons

### Structure des Composants

#### 1. Composants Core
- **StoryEditor** : Création et édition de stories
- **StoryPreview** : Prévisualisation en temps réel
- **WidgetManager** : Gestion des widgets intégrables
- **MediaUploader** : Gestion des uploads médias

#### 2. Composants Utilitaires
- **Container** : Layout responsive
- **EmptyState** : États vides stylisés
- **Toast** : Notifications système
- **Header** : Navigation principale

### Organisation du Projet
```
src/
├── app/
│   ├── components/      # Composants réutilisables
│   ├── story/          # Gestion des stories
│   ├── widget/         # Gestion des widgets
│   ├── profile/        # Profil utilisateur
│   └── globals.css     # Styles globaux
└── types/             # Types TypeScript
```

## Fonctionnalités Principales

### 1. Gestion des Stories
- Upload de médias (images/vidéos)
- Configuration des durées
- Réorganisation par drag-and-drop
- Prévisualisation mobile

### 2. Widgets E-commerce
- Création de widgets personnalisables
- Options d'intégration flexibles
- Configuration des stories à afficher
- Styles adaptables

### 3. Interface Utilisateur
- Design responsive
- Support multilingue (FR/EN)
- Mode clair par défaut
- Animations optimisées

## Bonnes Pratiques

### 1. Développement
- Un composant = une responsabilité
- Props typées et documentées
- Composants autonomes et réutilisables
- Code commenté et maintainable

### 2. Style et Design
```typescript
// Structure recommandée des composants
interface ComponentProps {
  label: string;
  variant?: 'primary' | 'secondary';
  onAction: () => void;
}

const Component: React.FC<ComponentProps> = ({
  label,
  variant = 'primary',
  onAction
}) => {
  // Implementation
};
```

### 3. Internationalisation
- Textes externalisés
- Support complet FR/EN
- Messages d'interface traduits

## Règles de Déploiement
- Ne pas modifier les fichiers de configuration de déploiement
- Respecter la structure des routes Next.js
- Tester avant chaque déploiement

## Palette de Couleurs
- Fond : #ffffff
- Texte : #171717
- Accents : Nuances de gris
- Éléments interactifs : Couleurs brand




## Tâches à réaliser

### 1. Interface utilisateur
- Ajouter l'option d'alignement des widgets (gauche/centre/droite)
- Ajouter le nom de la story sous chaque widget
  - Adapter le style selon le thème
  - Limiter le nombre de caractères (ajouter "..." si dépassement)

### 2. Animations
- Implémenter une animation de transition entre les stories
- Ajouter une animation de fermeture

### 3. Corrections de bugs
- Corriger la couleur de la bordure et la connexion à la base de données
- Optimiser le temps d'upload des vidéos
  - Investiguer l'erreur "Failed to save story"
  - Améliorer la gestion des fichiers volumineux

### 4. Fonctionnalités
- Connecter le nom du compte et la photo de profil à la base de données
- Implémenter le système de rangement par dossiers
- Intégrer la traduction (internationalisation)