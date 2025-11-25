import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';
import { comparePassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';

/**
 * POST /api/auth/login
 * Authenticate a user and return a token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(body.email);
    if (!user) {
      return NextResponse.json(
        { error: 'We don\'t recognize that email. Want to sign up instead?' },
        { status: 401 }
      );
    }

    // Verify password
    const isValidPassword = await comparePassword(body.password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Hmm, that password doesn\'t match. Try again?' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      email: user.email,
    });

    // Return user data (without password hash) and token
    const { passwordHash: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Welcome back! 🌻',
    });
  } catch (error) {
    console.error('Error in login:', error);
    return NextResponse.json(
      { error: 'Failed to log in. Please try again.' },
      { status: 500 }
    );
  }
}
