import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    // Récupère le widget
    const { data: widget, error: widgetError } = await supabase
      .from('widgets')
      .select('*')
      .eq('id', params.id)
      .single();
      
    if (widgetError || !widget) {
      return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    }
    
    // Récupère les stories associées
    const { data: stories, error: storiesError } = await supabase
      .from('stories')
      .select('id, title, thumbnail')
      .in('id', widget.story_ids)
      .eq('published', true);
      
    if (storiesError) {
      return NextResponse.json({ error: 'Error fetching stories' }, { status: 500 });
    }
    
    // Réorganise les stories dans l'ordre du widget.story_ids
    const orderedStories = widget.story_ids
      .map(id => stories?.find(story => story.id === id))
      .filter(Boolean);
    
    return NextResponse.json({
      ...widget,
      stories: orderedStories,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 