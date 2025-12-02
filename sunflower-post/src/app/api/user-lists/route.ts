import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/user-lists
 * Get all items in user's personal lists (books, TV/movies, music)
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

    // Get list items for this user
    const { data, error } = await supabase
      .from('user_list_items')
      .select('*')
      .eq('user_id', payload.userId)
      .order('added_at', { ascending: false });

    if (error) {
      console.error('Error fetching user list items:', error);
      return NextResponse.json(
        { error: 'Failed to fetch list items' },
        { status: 500 }
      );
    }

    // Transform data to match frontend format
    const readList = (data || [])
      .filter(item => item.item_type === 'book')
      .map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        status: item.status,
        imageUrl: item.image_url,
        addedAt: item.added_at,
        rating: item.rating,
        note: item.note,
      }));

    const watchList = (data || [])
      .filter(item => item.item_type === 'tv_movie')
      .map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        status: item.status,
        imageUrl: item.image_url,
        addedAt: item.added_at,
        rating: item.rating,
        note: item.note,
      }));

    const listenList = (data || [])
      .filter(item => item.item_type === 'music')
      .map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.subtitle,
        status: item.status,
        imageUrl: item.image_url,
        addedAt: item.added_at,
        rating: item.rating,
        note: item.note,
      }));

    return NextResponse.json({
      readList,
      watchList,
      listenList,
    });
  } catch (error) {
    console.error('Error in GET /api/user-lists:', error);
    return NextResponse.json(
      { error: 'Failed to get user lists' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user-lists
 * Add a new item to user's personal list
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

    const body = await request.json();

    // Validate required fields
    if (!body.itemType || !body.title || !body.status) {
      return NextResponse.json(
        { error: 'itemType, title, and status are required' },
        { status: 400 }
      );
    }

    // Validate itemType
    if (!['book', 'tv_movie', 'music'].includes(body.itemType)) {
      return NextResponse.json(
        { error: 'itemType must be book, tv_movie, or music' },
        { status: 400 }
      );
    }

    // Insert into database
    const { data, error } = await supabase
      .from('user_list_items')
      .insert({
        user_id: payload.userId,
        item_type: body.itemType,
        title: body.title,
        subtitle: body.subtitle || null,
        status: body.status,
        rating: body.rating || null,
        note: body.note || null,
        image_url: body.imageUrl || null,
        metadata: body.metadata || null,
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding list item:', error);
      return NextResponse.json(
        { error: 'Failed to add item to list' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        id: data.id,
        title: data.title,
        subtitle: data.subtitle,
        status: data.status,
        imageUrl: data.image_url,
        addedAt: data.added_at,
        rating: data.rating,
        note: data.note,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/user-lists:', error);
    return NextResponse.json(
      { error: 'Failed to add item to list' },
      { status: 500 }
    );
  }
}
