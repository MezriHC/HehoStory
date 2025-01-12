export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface WidgetSettings {
  appearance: {
    borderColor: string;
    borderWidth?: number;
    borderStyle?: 'solid' | 'dashed' | 'dotted';
    borderRadius?: number;
    backgroundColor?: string;
    textColor?: string;
  };
  display: {
    format: 'bubble' | 'card' | 'square' | 'sticky' | 'iframe';
    size?: 'sm' | 'md' | 'lg';
    position?: {
      bottom?: number;
      right?: number;
    };
  };
  behavior: {
    autoPlay?: boolean;
    loop?: boolean;
    showControls?: boolean;
  };
}

export interface Database {
  public: {
    Tables: {
      user_preferences: {
        Row: {
          id: string
          user_id: string
          created_at: string
          updated_at: string
          default_widget_settings: Json
          theme: 'light' | 'dark'
          language: string
        }
        Insert: {
          id?: string
          user_id: string
          created_at?: string
          updated_at?: string
          default_widget_settings?: Json
          theme?: 'light' | 'dark'
          language?: string
        }
        Update: {
          id?: string
          user_id?: string
          created_at?: string
          updated_at?: string
          default_widget_settings?: Json
          theme?: 'light' | 'dark'
          language?: string
        }
      }
      stories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          user_id: string
          slides: Json[]
          duration: number
          status: 'draft' | 'published'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          user_id: string
          slides: Json[]
          duration: number
          status?: 'draft' | 'published'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          user_id?: string
          slides?: Json[]
          duration?: number
          status?: 'draft' | 'published'
        }
      }
      widgets: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          user_id: string
          story_ids: string[]
          settings: Json
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          user_id: string
          story_ids: string[]
          settings: Json
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          user_id?: string
          story_ids?: string[]
          settings?: Json
          status?: 'active' | 'inactive'
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          avatar_url: string | null
          website: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          avatar_url?: string | null
          website?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          avatar_url?: string | null
          website?: string | null
        }
      }
    }
  }
} 