import { NextRequest, NextResponse } from "next/server";
import { getTVMovieReplies, createTVMovieReply } from "@/lib/db";

/**
 * GET /api/tv-movies/[id]/discussions/[discussionId]/replies
 * Get all replies for a discussion
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; discussionId: string }> }
) {
  try {
    const { discussionId } = await params;
    const replies = await getTVMovieReplies(discussionId);

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json(
      { error: "Failed to fetch replies" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tv-movies/[id]/discussions/[discussionId]/replies
 * Create a new reply for a discussion
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; discussionId: string }> }
) {
  try {
    const { discussionId } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.author || !body.body) {
      return NextResponse.json(
        { error: "Author and body are required" },
        { status: 400 }
      );
    }

    const newReply = await createTVMovieReply({
      discussionId,
      author: body.author,
      body: body.body,
      isSpoiler: body.isSpoiler || false,
    });

    return NextResponse.json({ reply: newReply }, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json(
      { error: "Failed to create reply" },
      { status: 500 }
    );
  }
}
