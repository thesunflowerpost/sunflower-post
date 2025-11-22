import { NextRequest, NextResponse } from "next/server";
import { toggleTVMovieReplyReaction, getUserTVMovieReplyReactions } from "@/lib/db";

/**
 * POST /api/tv-movies/[id]/discussions/[discussionId]/replies/[replyId]/reactions
 * Toggle a reaction for a reply
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; discussionId: string; replyId: string }> }
) {
  try {
    const { replyId } = await params;
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

    await toggleTVMovieReplyReaction(replyId, userId, reactionId, active);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling reply reaction:", error);
    return NextResponse.json(
      { error: "Failed to toggle reply reaction" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tv-movies/replies/reactions
 * Get all reply reactions for the current user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "current-user";

    const reactions = await getUserTVMovieReplyReactions(userId);

    return NextResponse.json({ reactions });
  } catch (error) {
    console.error("Error fetching reply reactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch reply reactions" },
      { status: 500 }
    );
  }
}
