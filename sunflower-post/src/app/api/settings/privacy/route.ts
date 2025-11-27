import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * PUT /api/settings/privacy
 * Update the current user's privacy settings
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

    // Get settings from request body
    const body = await request.json();
    const {
      profileVisibility,
      followerApprovalRequired,
      defaultAnonymousMode,
      activityVisible,
      dataExportEnabled,
    } = body;

    // Validate profile visibility
    if (profileVisibility && !['public', 'followers_only', 'private'].includes(profileVisibility)) {
      return NextResponse.json(
        { error: 'Invalid profile visibility value' },
        { status: 400 }
      );
    }

    // Update user settings
    const updates: any = {};
    if (profileVisibility !== undefined) updates.profileVisibility = profileVisibility;
    if (followerApprovalRequired !== undefined) updates.followerApprovalRequired = followerApprovalRequired;
    if (defaultAnonymousMode !== undefined) updates.defaultAnonymousMode = defaultAnonymousMode;
    if (activityVisible !== undefined) updates.activityVisible = activityVisible;
    if (dataExportEnabled !== undefined) updates.dataExportEnabled = dataExportEnabled;

    const updatedUser = await updateUser(payload.userId, updates);

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;

    return NextResponse.json({
      message: 'Privacy settings updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error in PUT /api/settings/privacy:', error);
    return NextResponse.json(
      { error: 'Failed to update privacy settings' },
      { status: 500 }
    );
  }
}
