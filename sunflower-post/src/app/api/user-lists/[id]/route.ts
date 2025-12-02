import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * PATCH /api/user-lists/[id]
 * Update a list item (status, rating, note, etc.)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;
    const body = await request.json();

    // Check if item exists and belongs to user
    const { data: existing, error: fetchError } = await supabase
      .from('user_list_items')
      .select('*')
      .eq('id', id)
      .eq('user_id', payload.userId)
      .single();

    if (fetchError || !existing) {
      return NextResponse.json(
        { error: 'List item not found or access denied' },
        { status: 404 }
      );
    }

    // Update the item
    const updates: any = {
      updated_at: new Date().toISOString(),
    };

    if (body.status !== undefined) updates.status = body.status;
    if (body.rating !== undefined) updates.rating = body.rating;
    if (body.note !== undefined) updates.note = body.note;
    if (body.title !== undefined) updates.title = body.title;
    if (body.subtitle !== undefined) updates.subtitle = body.subtitle;
    if (body.imageUrl !== undefined) updates.image_url = body.imageUrl;

    const { data, error } = await supabase
      .from('user_list_items')
      .update(updates)
      .eq('id', id)
      .eq('user_id', payload.userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating list item:', error);
      return NextResponse.json(
        { error: 'Failed to update list item' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      title: data.title,
      subtitle: data.subtitle,
      status: data.status,
      imageUrl: data.image_url,
      addedAt: data.added_at,
      rating: data.rating,
      note: data.note,
    });
  } catch (error) {
    console.error('Error in PATCH /api/user-lists/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to update list item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user-lists/[id]
 * Remove an item from user's list
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Delete the item (only if it belongs to the user)
    const { error } = await supabase
      .from('user_list_items')
      .delete()
      .eq('id', id)
      .eq('user_id', payload.userId);

    if (error) {
      console.error('Error deleting list item:', error);
      return NextResponse.json(
        { error: 'Failed to delete list item' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/user-lists/[id]:', error);
    return NextResponse.json(
      { error: 'Failed to delete list item' },
      { status: 500 }
    );
  }
}
