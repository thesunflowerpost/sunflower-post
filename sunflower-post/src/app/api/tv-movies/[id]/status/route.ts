import { NextRequest, NextResponse } from "next/server";
import { updateUserTVMovieStatus, getUserTVMovieStatus } from "@/lib/db";
import type { TVMovieStatus } from "@/lib/db/schema";

/**
 * PATCH /api/tv-movies/[id]/status
 * Update a user's watch status for a TV show/movie
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // In a real app, get userId from session/auth
    // For now, using a placeholder
    const userId = body.userId || "current-user";
    const status: TVMovieStatus = body.status;

    if (!status || !["Watching", "Watched", "Want to watch"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'Watching', 'Watched', or 'Want to watch'" },
        { status: 400 }
      );
    }

    await updateUserTVMovieStatus(id, userId, status);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error updating TV show/movie status:", error);
    return NextResponse.json(
      { error: "Failed to update TV show/movie status" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/tv-movies/[id]/status
 * Get a user's watch status for a TV show/movie
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "current-user";

    const status = await getUserTVMovieStatus(id, userId);

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error fetching TV show/movie status:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV show/movie status" },
      { status: 500 }
    );
  }
}
