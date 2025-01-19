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
    // Récupérer l'ID du widget depuis les paramètres
    const { searchParams } = new URL(request.url);
    const widgetId = searchParams.get('id');

    if (!widgetId) {
      return new NextResponse(
        JSON.stringify({ error: 'Widget ID is required' }),
        {
          status: 400,
          headers: corsHeaders,
        }
      );
    }

    // Récupérer le widget
    const { data: widget, error } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', widgetId)
      .single();

    if (error) {
      console.error('Error fetching widget:', error);
      return new NextResponse(
        JSON.stringify({ error: 'Failed to fetch widget' }),
        {
          status: 500,
          headers: corsHeaders,
        }
      );
    }

    if (!widget) {
      return new NextResponse(
        JSON.stringify({ error: 'Widget not found' }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return new NextResponse(
      JSON.stringify(widget),
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