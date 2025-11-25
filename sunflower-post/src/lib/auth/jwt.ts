/**
 * JWT token utilities for session management
 */

import jwt from 'jsonwebtoken';

// In production, this should be an environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'sunflower-post-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d'; // Token expires in 7 days

export interface TokenPayload {
  userId: string;
  email: string;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
