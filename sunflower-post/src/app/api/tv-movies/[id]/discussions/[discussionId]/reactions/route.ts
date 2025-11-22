import { NextRequest, NextResponse } from "next/server";
import { toggleTVMovieDiscussionReaction, getUserTVMovieDiscussionReactions } from "@/lib/db";

/**
 * POST /api/tv-movies/[id]/discussions/[discussionId]/reactions
 * Toggle a reaction for a discussion
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; discussionId: string }> }
) {
  try {
    const { discussionId } = await params;
    const body = await request.json();

    const userId = body.userId || "current-user";
    const reactionId = body.reactionId;
    const active = body.active;

    if (!reactionId || typeof active !== "boolean") {
      return NextResponse.json(
        { error: "reactionId and active (boolean) are required" },
        { status: 400 }
      );
    }

    await toggleTVMovieDiscussionReaction(discussionId, userId, reactionId, active);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling discussion reaction:", error);
    return NextResponse.json(
      { error: "Failed to toggle discussion reaction" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tv-movies/discussions/reactions
 * Get all discussion reactions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "current-user";

    const reactions = await getUserTVMovieDiscussionReactions(userId);

    return NextResponse.json({ reactions });
  } catch (error) {
    console.error("Error fetching discussion reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussion reactions" },
      { status: 500 }
    );
  }
}
