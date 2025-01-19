export interface Story {
  id: string
  content?: string
  thumbnail?: string
  profile_image?: string
  profile_name?: string
}

export interface MediaItem {
  type: 'image' | 'video'
  url: string
}

export type Size = 'S' | 'M' | 'L'
export type Variant = 'bubble' | 'card' | 'square' | 'preview'
export type Alignment = 'left' | 'center' | 'right' 