import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth/jwt';
import { getUser } from '@/lib/db';

/**
 * POST /api/users/:id/follow
 * Follow a user
 */
export async function POST(
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

    const userToFollow = params.id;
    const currentUserId = payload.userId;

    // Can't follow yourself
    if (userToFollow === currentUserId) {
      return NextResponse.json(
        { error: 'Cannot follow yourself' },
        { status: 400 }
      );
    }

    // Check if user to follow exists
    const targetUser = await getUser(userToFollow);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Determine if approval is required
    const requiresApproval = targetUser.followerApprovalRequired || false;
    const status = requiresApproval ? 'pending' : 'approved';

    // Create or update follow relationship
    const { error: followError } = await supabase
      .from('followers')
      .upsert(
        {
          follower_id: currentUserId,
          following_id: userToFollow,
          status: status,
        },
        {
          onConflict: 'follower_id,following_id',
        }
      );

    if (followError) throw followError;

    return NextResponse.json({
      message: requiresApproval
        ? 'Follow request sent'
        : 'Successfully followed user',
      status: status,
    });
  } catch (error) {
    console.error('Error in POST /api/users/:id/follow:', error);
    return NextResponse.json(
      { error: 'Failed to follow user' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/:id/follow
 * Unfollow a user
 */
export async function DELETE(
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

    const userToUnfollow = params.id;
    const currentUserId = payload.userId;

    // Delete follow relationship
    const { error: unfollowError } = await supabase
      .from('followers')
      .delete()
      .eq('follower_id', currentUserId)
      .eq('following_id', userToUnfollow);

    if (unfollowError) throw unfollowError;

    return NextResponse.json({
      message: 'Successfully unfollowed user',
    });
  } catch (error) {
    console.error('Error in DELETE /api/users/:id/follow:', error);
    return NextResponse.json(
      { error: 'Failed to unfollow user' },
      { status: 500 }
    );
  }
}
