import { NextRequest, NextResponse } from "next/server";
import { getTVMovieDiscussions, createTVMovieDiscussion } from "@/lib/db";

/**
 * GET /api/tv-movies/[id]/discussions
 * Get all discussions for a TV show/movie
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const discussions = await getTVMovieDiscussions(id);

    return NextResponse.json({ discussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
    return NextResponse.json(
      { error: "Failed to fetch discussions" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tv-movies/[id]/discussions
 * Create a new discussion for a TV show/movie
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.body || !body.author) {
      return NextResponse.json(
        { error: "Title, body, and author are required" },
        { status: 400 }
      );
    }

    const newDiscussion = await createTVMovieDiscussion({
      tvMovieId: id,
      title: body.title,
      body: body.body,
      author: body.author,
      isSpoiler: body.isSpoiler || false,
    });

    return NextResponse.json({ discussion: newDiscussion }, { status: 201 });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json(
      { error: "Failed to create discussion" },
      { status: 500 }
    );
  }
}
