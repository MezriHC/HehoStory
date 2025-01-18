export interface Widget {
  id: string;
  name: string;
  format: WidgetFormat;
  story_ids: string[];
  settings: WidgetSettings;
  published: boolean;
  author_id: string;
  folder_id?: string;
  embed_code?: string; // Code d'intégration généré automatiquement
  created_at: string;
} 