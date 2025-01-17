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
      folders: {
        Row: {
          id: string
          name: string
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          author_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          author_id?: string
          created_at?: string
        }
      }
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
          folder_id: string | null
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
          folder_id?: string | null
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
          folder_id?: string | null
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

export interface Folder {
  id: string
  name: string
  author_id: string
  created_at: string
}

export interface Widget {
  id: string
  name: string
  format: WidgetFormat
  story_ids: string[]
  stories?: Story[]
  created_at: string
  settings?: any
  published: boolean
  author_id: string
  folder_id: string | null
} 