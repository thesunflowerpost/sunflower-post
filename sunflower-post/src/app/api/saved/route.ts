import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/saved
 * Get all saved items for the current user
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

    // Get optional filter by item type
    const { searchParams } = new URL(request.url);
    const itemType = searchParams.get('type');

    let query = supabase
      .from('saved_items')
      .select('*')
      .eq('user_id', payload.userId)
      .order('created_at', { ascending: false });

    if (itemType) {
      query = query.eq('item_type', itemType);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({
      items: data || [],
    });
  } catch (error) {
    console.error('Error in GET /api/saved:', error);
    return NextResponse.json(
      { error: 'Failed to get saved items' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/saved
 * Save an item
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

    // Get item data from request body
    const body = await request.json();
    const { itemType, itemId } = body;

    // Validate
    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: 'Item type and ID are required' },
        { status: 400 }
      );
    }

    const validTypes = ['post', 'book', 'tv_movie', 'music', 'discussion'];
    if (!validTypes.includes(itemType)) {
      return NextResponse.json(
        { error: 'Invalid item type' },
        { status: 400 }
      );
    }

    // Save item (upsert to handle duplicates)
    const { data, error } = await supabase
      .from('saved_items')
      .upsert(
        {
          user_id: payload.userId,
          item_type: itemType,
          item_id: itemId,
        },
        {
          onConflict: 'user_id,item_type,item_id',
        }
      )
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Item saved successfully',
      item: data,
    });
  } catch (error) {
    console.error('Error in POST /api/saved:', error);
    return NextResponse.json(
      { error: 'Failed to save item' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/saved
 * Remove a saved item
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

    // Get item data from request body
    const body = await request.json();
    const { itemType, itemId } = body;

    if (!itemType || !itemId) {
      return NextResponse.json(
        { error: 'Item type and ID are required' },
        { status: 400 }
      );
    }

    // Delete saved item
    const { error } = await supabase
      .from('saved_items')
      .delete()
      .eq('user_id', payload.userId)
      .eq('item_type', itemType)
      .eq('item_id', itemId);

    if (error) throw error;

    return NextResponse.json({
      message: 'Item removed from saved',
    });
  } catch (error) {
    console.error('Error in DELETE /api/saved:', error);
    return NextResponse.json(
      { error: 'Failed to remove saved item' },
      { status: 500 }
    );
  }
}
