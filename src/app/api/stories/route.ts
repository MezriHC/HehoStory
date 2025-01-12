import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: Request) {
  try {
    const { title, content, authorId, tags } = await request.json();

    const { data, error } = await supabase
      .from('stories')
      .insert([
        {
          title,
          content,
          author_id: authorId,
          tags,
          published: false,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating story:', error);
    return NextResponse.json(
      { error: 'Error creating story' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stories:', error);
    return NextResponse.json(
      { error: 'Error fetching stories' },
      { status: 500 }
    );
  }
} 