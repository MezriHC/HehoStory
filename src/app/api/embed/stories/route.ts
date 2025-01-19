import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

// Configuration Supabase sécurisée (côté serveur)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // Récupérer les IDs des stories depuis les paramètres
    const { searchParams } = new URL(request.url);
    const storyIds = searchParams.get('ids')?.split(',');

    if (!storyIds?.length) {
      return new NextResponse(
        JSON.stringify({ error: 'Story IDs are required' }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Récupérer les stories
    const { data: stories, error } = await supabase
      .from('stories')
      .select('id, content, thumbnail, profile_image, profile_name')
      .in('id', storyIds);

    if (error) {
      console.error('Error fetching stories:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch stories' }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    // Retourner les stories dans l'ordre des IDs fournis
    const orderedStories = storyIds
      .map(id => stories?.find(s => s.id === id))
      .filter(Boolean);

    return new NextResponse(
      JSON.stringify(orderedStories),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}

// Handle CORS preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 