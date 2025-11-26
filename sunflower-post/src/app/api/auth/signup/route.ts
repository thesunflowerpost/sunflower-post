import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { hashPassword } from '@/lib/auth/password';
import { generateToken } from '@/lib/auth/jwt';
import { generateAlias } from '@/lib/utils/aliasGenerator';

/**
 * POST /api/auth/signup
 * Create a new user account
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Name, email and password are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Validate password length
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Hash the password
    const passwordHash = await hashPassword(body.password);

    // Generate a unique alias for anonymous posting
    const alias = generateAlias();

    // Create the user
    const newUser = await createUser({
      name: body.name,
      email: body.email.toLowerCase(),
      passwordHash,
      alias,
      sunflowerColor: body.color || 'classic',
      profilePicture: undefined,
    });

    // Generate JWT token
    const token = generateToken({
      userId: newUser.id,
      email: newUser.email,
    });

    // Return user data (without password hash) and token
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        user: userWithoutPassword,
        token,
        message: 'Account created successfully! Welcome to the Circle 🌻',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in signup:', error);

    if (error instanceof Error && error.message === 'User with this email already exists') {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}
