import React from 'react';
import ReactDOM from 'react-dom';
import { Story, Size, Variant, Alignment } from './types';
import { StoryStyle, StoryCarousel, StoryViewer } from './components/EmbedStoryStyle';
import './styles.css';

console.log('🎬 Démarrage du script HehoStory');
console.log('🔄 Version du build:', new Date().toISOString());
console.log('🔍 DEBUG MODE ACTIVÉ - v2');
console.log('🎯 Test de mise à jour - Build du', new Date().toLocaleString());

// Types pour la base de données
interface DBStory {
  id: string;
  content: string;
  thumbnail: string;
  profile_image?: string;
  profile_name?: string;
}

interface DBWidget {
  id: string;
  format: string;
  story_ids: string[];
  settings: string;
  border_color?: string;
}

interface WidgetFormat {
  type: Variant;
  size: Size;
  alignment: Alignment;
}

interface Widget {
  id: string;
  format: WidgetFormat;
  story_ids: string[];
  settings: {
    autoplay?: boolean;
    loop?: boolean;
  };
}

// Point d'entrée du script d'embed HehoStory
(() => {
  console.log('🏁 Initialisation HehoStory');
  
  // Configuration de l'API
  const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3004/api/embed'
    : 'https://hehostory.vercel.app/api/embed';
  
  // Fonction pour charger les données d'un widget
  const loadWidgetData = async (widgetId: string): Promise<Widget | null> => {
    try {
      console.log('🔍 Chargement du widget:', widgetId);
      
      const response = await fetch(`${API_BASE_URL}/widget?id=${widgetId}`);
      const widget = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur chargement widget:', widget.error);
        return null;
      }

      console.log('📦 Données brutes du widget:', widget);

      // Parse le format du widget
      let format: WidgetFormat;
      try {
        format = typeof widget.format === 'string' 
          ? JSON.parse(widget.format)
          : widget.format;
        console.log('📐 Format parsé:', format);
      } catch (e) {
        console.error('❌ Erreur parsing format:', e);
        return null;
      }

      // Valeurs par défaut pour le format
      const defaultFormat: WidgetFormat = {
        type: 'bubble',
        size: 'M',
        alignment: 'center'
      };

      const processedWidget = {
        id: widget.id,
        format: {
          type: format.type || defaultFormat.type,
          size: format.size || defaultFormat.size,
          alignment: format.alignment || defaultFormat.alignment
        },
        story_ids: Array.isArray(widget.story_ids) ? widget.story_ids : [],
        settings: typeof widget.settings === 'string' 
          ? JSON.parse(widget.settings)
          : widget.settings || {}
      };

      console.log('✅ Widget traité:', processedWidget);
      return processedWidget;

    } catch (error) {
      console.error('❌ Erreur inattendue widget:', error);
      return null;
    }
  };

  // Fonction pour charger les stories
  const loadStories = async (storyIds: string[]): Promise<Story[]> => {
    if (!storyIds.length) {
      console.log('ℹ️ Aucun story_id fourni');
      return [];
    }
    
    console.log('🔍 Chargement des stories:', storyIds);
    
    try {
      const response = await fetch(`${API_BASE_URL}/stories?ids=${storyIds.join(',')}`);
      const stories = await response.json();

      if (!response.ok) {
        console.error('❌ Erreur chargement stories:', stories.error);
        return [];
      }

      console.log('📦 Stories brutes trouvées:', stories.map((s: DBStory) => s.id));

      const orderedStories = stories.map((story: DBStory) => ({
        id: story.id,
        content: story.content,
        thumbnail: story.thumbnail,
        profile_image: story.profile_image || undefined,
        profile_name: story.profile_name || undefined
      }));

      console.log('✅ Stories traitées:', orderedStories.map((s: Story) => s.id));
      return orderedStories;

    } catch (error) {
      console.error('❌ Erreur inattendue stories:', error);
      return [];
    }
  };

  // Fonction d'initialisation du widget
  const initWidget = async (element: HTMLElement, widgetId: string) => {
    console.log('🚀 Initialisation du widget:', widgetId);
    console.log('📍 Element DOM cible:', element);
    
    try {
      const widget = await loadWidgetData(widgetId);
      if (!widget) {
        console.error('❌ Widget non trouvé:', widgetId);
        return;
      }

      console.log('📱 Chargement des stories pour le widget:', widget.story_ids);
      const stories = await loadStories(widget.story_ids);
      console.log('✨ Stories chargées:', stories.length);
      console.log('📊 Détails des stories:', stories.map(s => ({ id: s.id, thumbnail: s.thumbnail })));

      // Créer un conteneur pour le viewer avec debug
      let viewerContainer = document.getElementById('hehostory-viewer-container');
      console.log('🔍 Recherche du conteneur existant:', viewerContainer ? 'trouvé' : 'non trouvé');
      
      if (!viewerContainer) {
        viewerContainer = document.createElement('div');
        viewerContainer.id = 'hehostory-viewer-container';
        document.body.appendChild(viewerContainer);
        console.log('✨ Nouveau conteneur créé et ajouté au DOM');
      }

      // Render le widget avec React
      console.log('🎨 Début du rendu React du carousel');
      ReactDOM.render(
        React.createElement(StoryCarousel, {
          stories,
          variant: widget.format.type,
          size: widget.format.size,
          alignment: widget.format.alignment,
          onStorySelect: (story) => {
            console.log('👆 Story sélectionnée:', story.id);
            console.log('📐 Format du widget:', widget.format);
            console.log('🎯 Conteneur du viewer:', viewerContainer);
            
            // Utiliser createPortal via StoryViewer pour afficher la story
            if (viewerContainer) {
              console.log('🎭 Montage du viewer dans le conteneur:', viewerContainer.id);
              ReactDOM.render(
                React.createElement(StoryViewer, {
                  stories,
                  selectedStoryId: story.id,
                  onClose: () => {
                    if (viewerContainer) {
                      console.log('🔚 Fermeture du viewer');
                      console.log('🧹 Nettoyage du conteneur:', viewerContainer.id);
                      ReactDOM.unmountComponentAtNode(viewerContainer);
                      console.log('✅ Viewer démonté avec succès');
                    } else {
                      console.error('❌ Conteneur du viewer non trouvé lors de la fermeture');
                    }
                  }
                }),
                viewerContainer
              );
              console.log('✅ Viewer monté avec succès');
            } else {
              console.error('❌ Conteneur du viewer non trouvé');
            }
          }
        }),
        element
      );
      console.log('✅ Carousel rendu avec succès');
    } catch (error: any) {
      console.error('❌ Erreur initialisation widget:', error);
      console.error('📑 Stack trace:', error.stack);
    }
  };

  // Initialisation de tous les widgets sur la page
  const widgets = document.querySelectorAll('[data-hehostory-widget]');
  console.log('🔎 Widgets trouvés:', widgets.length);
  
  widgets.forEach(element => {
    const widgetId = element.getAttribute('data-hehostory-widget');
    console.log('📍 Widget ID trouvé:', widgetId);
    if (widgetId) {
      initWidget(element as HTMLElement, widgetId);
    }
  });
})(); 