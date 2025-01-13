import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export type Story = {
  id: string;
  created_at: string;
  title: string;
  content: string;
  author_id: string;
  published: boolean;
  thumbnail: string | null;
  profile_image?: string;
  profile_name?: string;
  tags?: string[];
}; 