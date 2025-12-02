import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/users/:id/preview
 * Get a quick preview of a user for hover cards
 */
export async function GET(
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

    const { id: userId } = await params;

    // Get user details
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, name, alias, bio, profile_picture')
      .eq('id', userId)
      .single();

    if (userError || !userData) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if current user is following this user
    const { data: followData } = await supabase
      .from('followers')
      .select('id')
      .eq('follower_id', payload.userId)
      .eq('following_id', userId)
      .eq('status', 'approved')
      .single();

    return NextResponse.json({
      id: userData.id,
      name: userData.name,
      alias: userData.alias,
      bio: userData.bio,
      avatarUrl: userData.profile_picture,
      isFollowing: !!followData,
    });
  } catch (error) {
    console.error('Error in GET /api/users/:id/preview:', error);
    return NextResponse.json(
      { error: 'Failed to get user preview' },
      { status: 500 }
    );
  }
}
