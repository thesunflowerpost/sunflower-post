import { NextRequest, NextResponse } from 'next/server';
import { updateUser } from '@/lib/db';
import { verifyToken } from '@/lib/auth/jwt';

/**
 * PUT /api/profile/customize
 * Update profile customization settings
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

    // Get customization data from request body
    const body = await request.json();
    const { coverPhoto, themeColor, badge, pinnedPostId } = body;

    // Validate theme color (must be valid hex color)
    if (themeColor && !/^#[0-9A-F]{6}$/i.test(themeColor)) {
      return NextResponse.json(
        { error: 'Invalid theme color format' },
        { status: 400 }
      );
    }

    // Validate badge length
    if (badge && badge.length > 50) {
      return NextResponse.json(
        { error: 'Badge must be 50 characters or less' },
        { status: 400 }
      );
    }

    // Update user customization
    const updates: any = {};
    if (coverPhoto !== undefined) updates.coverPhoto = coverPhoto;
    if (themeColor !== undefined) updates.themeColor = themeColor;
    if (badge !== undefined) updates.badge = badge;
    if (pinnedPostId !== undefined) updates.pinnedPostId = pinnedPostId;

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
      message: 'Profile customization updated successfully',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Error in PUT /api/profile/customize:', error);
    return NextResponse.json(
      { error: 'Failed to update profile customization' },
      { status: 500 }
    );
  }
}
