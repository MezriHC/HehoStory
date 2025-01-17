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




Mettre en place l’option d’alignement des widgets (à gauche, milieu, à droite) Mettre en place une animation de transition entre les story  Mettre en place une animation de fermeture Corriger le problème de la couleur de la bordure et la connecter la base de donnée Connecter le nom du compte et la photo à la base de donnée Corriger le problème du bouton mute qui influence la story. Corriger el problème du bouton fermer qui ne fonctionne pas. Ajouter le système de rangement dans des dossiers Ajouter le nom de la story sous chaque story dans le widget, et l’adapter en fonction du style. Mettre une limite de caractère au niveau du nom de la story (afficher… si on les dépasse) Ajouter la traduction. Supprimer le preview popup au niveau de l’étape de creation garder juste le preview inline, supprimer le bouton preview au niveau de cette étape également Quand j’essaye d’uploader une vidéo ça mets super longtemps à s’enregistrer et à la fin j’ai : Failed to save story. Please try again. Il faut corriger ce problème.