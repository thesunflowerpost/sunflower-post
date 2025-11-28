import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/users/:id/followers
 * Get the list of users following a specific user
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

    const { id: rawId } = await params;
    let userId = rawId;

    // Handle "current-user" special route parameter
    if (rawId === 'current-user') {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser(token);

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }

      userId = user.id;
    }

    // Get followers from the followers table
    const { data: followersData, error: followersError } = await supabase
      .from('followers')
      .select('follower_id, status')
      .eq('following_id', userId)
      .eq('status', 'approved');

    if (followersError) {
      console.error('Error fetching followers:', followersError);
      return NextResponse.json(
        { error: 'Failed to fetch followers', details: followersError.message },
        { status: 500 }
      );
    }

    if (!followersData || followersData.length === 0) {
      return NextResponse.json({ followers: [] });
    }

    // Get user details for all followers
    const followerIds = followersData.map((f) => f.follower_id);
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, alias, bio, profile_picture')
      .in('id', followerIds);

    if (usersError) {
      console.error('Error fetching user details:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch user details', details: usersError.message },
        { status: 500 }
      );
    }

    // Check which users the current user is following
    const { data: currentUserFollowing, error: followingError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', payload.userId)
      .eq('status', 'approved');

    if (followingError) {
      console.error('Error fetching following status:', followingError);
    }

    const followingIds = new Set(
      currentUserFollowing?.map((f) => f.following_id) || []
    );

    // Map to user summary format
    const followers = usersData?.map((user) => ({
      id: user.id,
      name: user.name,
      alias: user.alias,
      bio: user.bio,
      avatarUrl: user.profile_picture,
      isFollowing: followingIds.has(user.id),
    })) || [];

    return NextResponse.json({ followers });
  } catch (error) {
    console.error('Error in GET /api/users/:id/followers:', error);
    return NextResponse.json(
      { error: 'Failed to get followers', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
