import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/journal
 * Get all journal entries for the current user
 */
export async function GET(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get journal entries
    const { data, error } = await supabase
      .from('journal_entries')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      entries: data || [],
    });
  } catch (error) {
    console.error('Error in GET /api/journal:', error);
    return NextResponse.json(
      { error: 'Failed to get journal entries' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/journal
 * Create a new journal entry
 */
export async function POST(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get entry data from request body
    const body = await request.json();
    const { title, body: entryBody, mood, tags } = body;

    // Validate
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!entryBody || !entryBody.trim()) {
      return NextResponse.json(
        { error: 'Body is required' },
        { status: 400 }
      );
    }

    // Create journal entry
    const { data, error } = await supabase
      .from('journal_entries')
      .insert([
        {
          user_id: payload.userId,
          title: title.trim(),
          body: entryBody.trim(),
          mood: mood || null,
          tags: tags || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Journal entry created successfully',
      entry: data,
    });
  } catch (error) {
    console.error('Error in POST /api/journal:', error);
    return NextResponse.json(
      { error: 'Failed to create journal entry' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/journal
 * Update an existing journal entry
 */
export async function PUT(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get entry data from request body
    const body = await request.json();
    const { id, title, body: entryBody, mood, tags } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Validate
    if (!title || !title.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!entryBody || !entryBody.trim()) {
      return NextResponse.json(
        { error: 'Body is required' },
        { status: 400 }
      );
    }

    // Update journal entry (RLS will ensure user can only update their own entries)
    const { data, error } = await supabase
      .from('journal_entries')
      .update({
        title: title.trim(),
        body: entryBody.trim(),
        mood: mood || null,
        tags: tags || null,
      })
      .eq('id', id)
      .eq('user_id', payload.userId)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { error: 'Journal entry not found or you do not have permission' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Journal entry updated successfully',
      entry: data,
    });
  } catch (error) {
    console.error('Error in PUT /api/journal:', error);
    return NextResponse.json(
      { error: 'Failed to update journal entry' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/journal
 * Delete a journal entry
 */
export async function DELETE(request: NextRequest) {
  try {
    // Get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get entry ID from query params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Entry ID is required' },
        { status: 400 }
      );
    }

    // Delete journal entry (RLS will ensure user can only delete their own entries)
    const { error } = await supabase
      .from('journal_entries')
      .delete()
      .eq('id', id)
      .eq('user_id', payload.userId);

    if (error) throw error;

    return NextResponse.json({
      message: 'Journal entry deleted successfully',
    });
  } catch (error) {
    console.error('Error in DELETE /api/journal:', error);
    return NextResponse.json(
      { error: 'Failed to delete journal entry' },
      { status: 500 }
    );
  }
}
