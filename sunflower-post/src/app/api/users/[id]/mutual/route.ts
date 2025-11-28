import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * GET /api/users/:id/mutual
 * Get mutual connections between current user and target user
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const targetUserId = params.id;
    const currentUserId = payload.userId;

    // If viewing own profile, return suggestions instead
    if (targetUserId === currentUserId) {
      return getSuggestedUsers(currentUserId);
    }

    // Get users that both current user and target user follow
    const { data: mutualFollowing, error: followingError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', currentUserId)
      .eq('status', 'approved');

    if (followingError) throw followingError;

    const { data: targetFollowing, error: targetError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', targetUserId)
      .eq('status', 'approved');

    if (targetError) throw targetError;

    // Find mutual connections (users both follow)
    const currentFollowingIds = new Set(
      mutualFollowing?.map((f) => f.following_id) || []
    );
    const mutualIds = (targetFollowing || [])
      .map((f) => f.following_id)
      .filter((id) => currentFollowingIds.has(id));

    if (mutualIds.length === 0) {
      return NextResponse.json({
        mutualCount: 0,
        mutualUsers: [],
      });
    }

    // Get user details for mutual connections
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, alias, bio, profile_picture')
      .in('id', mutualIds)
      .limit(10); // Limit to first 10

    if (usersError) throw usersError;

    const users = usersData?.map((user) => ({
      id: user.id,
      name: user.name,
      alias: user.alias,
      bio: user.bio,
      avatarUrl: user.profile_picture,
    })) || [];

    return NextResponse.json({
      mutualCount: mutualIds.length,
      mutualUsers: users,
    });
  } catch (error) {
    console.error('Error in GET /api/users/:id/mutual:', error);
    return NextResponse.json(
      { error: 'Failed to get mutual connections' },
      { status: 500 }
    );
  }
}

/**
 * Get suggested users based on mutual connections and similar interests
 */
async function getSuggestedUsers(userId: string) {
  try {
    // Get users that the current user's connections follow (but current user doesn't)
    const { data: userFollowing, error: followingError } = await supabase
      .from('followers')
      .select('following_id')
      .eq('follower_id', userId)
      .eq('status', 'approved');

    if (followingError) throw followingError;

    const followingIds = userFollowing?.map((f) => f.following_id) || [];

    // Get who the people current user follows are following
    const { data: secondDegree, error: secondError } = await supabase
      .from('followers')
      .select('following_id')
      .in('follower_id', followingIds)
      .eq('status', 'approved')
      .limit(50);

    if (secondError) throw secondError;

    // Count occurrences to find most common connections
    const suggestionCounts = new Map<string, number>();
    secondDegree?.forEach((f) => {
      if (f.following_id !== userId && !followingIds.includes(f.following_id)) {
        suggestionCounts.set(
          f.following_id,
          (suggestionCounts.get(f.following_id) || 0) + 1
        );
      }
    });

    // Sort by count and get top suggestions
    const topSuggestions = Array.from(suggestionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([id]) => id);

    if (topSuggestions.length === 0) {
      // If no suggestions from network, get random active users
      const { data: randomUsers, error: randomError } = await supabase
        .from('users')
        .select('id, name, alias, bio, profile_picture')
        .neq('id', userId)
        .limit(5);

      if (randomError) throw randomError;

      const users = randomUsers?.map((user) => ({
        id: user.id,
        name: user.name,
        alias: user.alias,
        bio: user.bio,
        avatarUrl: user.profile_picture,
      })) || [];

      return NextResponse.json({
        suggestions: users,
      });
    }

    // Get user details for suggestions
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id, name, alias, bio, profile_picture')
      .in('id', topSuggestions);

    if (usersError) throw usersError;

    const users = usersData?.map((user) => ({
      id: user.id,
      name: user.name,
      alias: user.alias,
      bio: user.bio,
      avatarUrl: user.profile_picture,
    })) || [];

    return NextResponse.json({
      suggestions: users,
    });
  } catch (error) {
    console.error('Error getting suggested users:', error);
    return NextResponse.json({
      suggestions: [],
    });
  }
}
