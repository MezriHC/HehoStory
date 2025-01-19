import React from 'react';
import ReactDOM from 'react-dom';
import { Story, Size, Variant, Alignment } from './types';
import { StoryStyle, StoryCarousel, StoryViewer } from './components/EmbedStoryStyle';
import './styles.css';

console.log('🎬 Démarrage du script HehoStory');

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
    : `${process.env.NEXT_PUBLIC_PROD_URL}/api/embed`;
  
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
    
    try {
      const widget = await loadWidgetData(widgetId);
      if (!widget) {
        console.error('❌ Widget non trouvé:', widgetId);
        return;
      }

      console.log('📱 Chargement des stories pour le widget:', widget.story_ids);
      const stories = await loadStories(widget.story_ids);
      console.log('✨ Stories chargées:', stories.length);

      // Render le widget avec React
      ReactDOM.render(
        React.createElement(StoryCarousel, {
          stories,
          variant: widget.format.type,
          size: widget.format.size,
          alignment: widget.format.alignment,
          onStorySelect: (story) => {
            console.log('👆 Story sélectionnée:', story.id);
            ReactDOM.render(
              React.createElement(StoryViewer, {
                stories,
                selectedStoryId: story.id,
                onClose: () => {
                  console.log('🔚 Fermeture du viewer');
                  ReactDOM.unmountComponentAtNode(element);
                  initWidget(element, widgetId);
                }
              }),
              element
            );
          }
        }),
        element
      );
    } catch (error) {
      console.error('❌ Erreur initialisation widget:', error);
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