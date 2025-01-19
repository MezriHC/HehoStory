import React from 'react';
import ReactDOM from 'react-dom';
import { createClient } from '@supabase/supabase-js';
import { Story, Size, Variant, Alignment } from './types';
import { StoryStyle, StoryCarousel, StoryViewer } from './components/EmbedStoryStyle';
import './styles.css';

// Types pour la base de données
interface DBStory {
  id: string;
  content: string;
  thumbnail: string;
  profile_image?: string;
  profile_name?: string;
  published: boolean;
}

interface DBWidget {
  id: string;
  format: string;
  story_ids: string[];
  settings: string;
  border_color?: string;
  published: boolean;
}

// Types pour les composants
interface Widget {
  id: string;
  format: {
    type: Variant;
    size: Size;
    alignment: Alignment;
  };
  story_ids: string[];
  settings: {
    autoplay?: boolean;
    loop?: boolean;
  };
}

// Point d'entrée du script d'embed HehoStory
(() => {
  // Configuration Supabase
  const SUPABASE_URL = 'https://moayozcwypbsmnnbtkdv.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vYXlvemN3eXBic21ubmJ0a2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY2MTQ1OTIsImV4cCI6MjA1MjE5MDU5Mn0.aiV5-q7F-5z-CIs8pVsTotAsyziGyP5tVpaydYgYZs8';
  
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: false
    },
    global: {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      }
    }
  });

  // Fonction pour charger les données d'un widget
  const loadWidgetData = async (widgetId: string): Promise<Widget | null> => {
    try {
      const { data: widget, error } = await supabase
        .from('widgets')
        .select('*')
        .eq('id', widgetId)
        .eq('published', true)
        .single();

      if (error || !widget) {
        console.error('Error loading widget:', error);
        return null;
      }

      // Parse le format du widget
      let format;
      try {
        format = typeof widget.format === 'string' 
          ? JSON.parse(widget.format)
          : widget.format;
      } catch (e) {
        console.error('Error parsing widget format:', e);
        return null;
      }

      return {
        id: widget.id,
        format: {
          type: format.type,
          size: format.size,
          alignment: format.alignment
        },
        story_ids: widget.story_ids,
        settings: typeof widget.settings === 'string' 
          ? JSON.parse(widget.settings)
          : widget.settings
      };
    } catch (error) {
      console.error('Unexpected error loading widget:', error);
      return null;
    }
  };

  // Fonction pour charger les stories
  const loadStories = async (storyIds: string[]): Promise<Story[]> => {
    try {
      const { data: stories, error } = await supabase
        .from('stories')
        .select('id, content, thumbnail, profile_image, profile_name')
        .in('id', storyIds)
        .eq('published', true);

      if (error || !stories) {
        console.error('Error loading stories:', error);
        return [];
      }

      return stories.map(story => ({
        id: story.id,
        content: story.content,
        thumbnail: story.thumbnail,
        profile_image: story.profile_image,
        profile_name: story.profile_name
      }));
    } catch (error) {
      console.error('Unexpected error loading stories:', error);
      return [];
    }
  };

  // Fonction d'initialisation du widget
  const initWidget = async (element: HTMLElement, widgetId: string) => {
    try {
      const widget = await loadWidgetData(widgetId);
      if (!widget) {
        console.error('Widget not found or not published:', widgetId);
        return;
      }

      const stories = await loadStories(widget.story_ids);
      if (!stories.length) {
        console.error('No published stories found for widget:', widgetId);
        return;
      }

      // Render le widget avec React
      ReactDOM.render(
        React.createElement(StoryCarousel, {
          stories,
          variant: widget.format.type,
          size: widget.format.size,
          alignment: widget.format.alignment,
          onStorySelect: (story) => {
            ReactDOM.render(
              React.createElement(StoryViewer, {
                stories,
                selectedStoryId: story.id,
                onClose: () => {
                  ReactDOM.unmountComponentAtNode(element);
                  // Re-render le carousel
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
      console.error('Error initializing widget:', error);
    }
  };

  // Initialisation de tous les widgets sur la page
  const widgets = document.querySelectorAll('[data-hehostory-widget]');
  widgets.forEach(element => {
    const widgetId = element.getAttribute('data-hehostory-widget');
    if (widgetId) {
      initWidget(element as HTMLElement, widgetId);
    }
  });
})(); 