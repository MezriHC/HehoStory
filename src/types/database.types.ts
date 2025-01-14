export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      stories: {
        Row: {
          id: string
          created_at: string
          title: string
          content: Json
          thumbnail: string | null
          profile_image: string | null
          profile_name: string | null
          published: boolean
          author_id: string
          tags: string[]
          updated_at: string
          widget_border_color: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          content: Json
          thumbnail?: string | null
          profile_image?: string | null
          profile_name?: string | null
          published?: boolean
          author_id: string
          tags?: string[]
          updated_at?: string
          widget_border_color?: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          content?: Json
          thumbnail?: string | null
          profile_image?: string | null
          profile_name?: string | null
          published?: boolean
          author_id?: string
          tags?: string[]
          updated_at?: string
          widget_border_color?: string
        }
      }
      widgets: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          author_id: string
          story_ids: string[]
          settings: Json
          status: 'active' | 'inactive'
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          author_id: string
          story_ids: string[]
          settings: Json
          status?: 'active' | 'inactive'
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          author_id?: string
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