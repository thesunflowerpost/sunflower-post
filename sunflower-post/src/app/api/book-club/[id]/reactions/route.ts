import { NextRequest, NextResponse } from "next/server";
import { toggleReaction, getUserReactions } from "@/lib/db";

/**
 * POST /api/book-club/[id]/reactions
 * Toggle a reaction for a book
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // In a real app, get userId from session/auth
    // For now, using a placeholder
    const userId = body.userId || "current-user";
    const reactionId = body.reactionId;
    const active = body.active;

    if (!reactionId || typeof active !== "boolean") {
      return NextResponse.json(
        { error: "reactionId and active (boolean) are required" },
        { status: 400 }
      );
    }

    await toggleReaction(id, userId, reactionId, active);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling reaction:", error);
    return NextResponse.json(
      { error: "Failed to toggle reaction" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/book-club/reactions
 * Get all reactions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "current-user";

    const reactions = await getUserReactions(userId);

    return NextResponse.json({ reactions });
  } catch (error) {
    console.error("Error fetching reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reactions" },
      { status: 500 }
    );
  }
}
