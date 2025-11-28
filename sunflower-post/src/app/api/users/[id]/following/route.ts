import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/users/:id/following
 * Get the list of users that a specific user is following
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

    // Get following from the followers table
    const { data: followingData, error: followingError } = await supabase
      .from('followers')
      .select('following_id, status')
      .eq('follower_id', userId)
      .eq('status', 'approved');

    if (followingError) throw followingError;

    if (!followingData || followingData.length === 0) {
      return NextResponse.json({ users: [] });
    }

    // Get user details for all users being followed
    const followingIds = followingData.map((f) => f.following_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, alias, bio, profile_picture')
      .in('id', followingIds);

    if (usersError) throw usersError;

    // Check which users the current user is following
    const { data: currentUserFollowing, error: currentFollowingError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', payload.userId)
      .eq('status', 'approved');

    if (currentFollowingError) throw currentFollowingError;

    const currentFollowingIds = new Set(
      currentUserFollowing?.map((f) => f.following_id) || []
    );

    // Map to user summary format
    const users = usersData?.map((user) => ({
      id: user.id,
      name: user.name,
      alias: user.alias,
      bio: user.bio,
      avatarUrl: user.profile_picture,
      isFollowing: currentFollowingIds.has(user.id),
    })) || [];

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in GET /api/users/:id/following:', error);
    return NextResponse.json(
      { error: 'Failed to get following' },
      { status: 500 }
    );
  }
}
