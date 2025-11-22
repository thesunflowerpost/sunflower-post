import { NextRequest, NextResponse } from "next/server";
import { getTVMovie, updateTVMovie, deleteTVMovie } from "@/lib/db";

/**
 * GET /api/tv-movies/[id]
 * Get a single TV show/movie by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tvMovie = await getTVMovie(id);

    if (!tvMovie) {
      return NextResponse.json(
        { error: "TV show/movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tvMovie });
  } catch (error) {
    console.error("Error fetching TV show/movie:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV show/movie" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/tv-movies/[id]
 * Update a TV show/movie
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedTVMovie = await updateTVMovie(id, body);

    if (!updatedTVMovie) {
      return NextResponse.json(
        { error: "TV show/movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ tvMovie: updatedTVMovie });
  } catch (error) {
    console.error("Error updating TV show/movie:", error);
    return NextResponse.json(
      { error: "Failed to update TV show/movie" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tv-movies/[id]
 * Delete a TV show/movie
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteTVMovie(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "TV show/movie not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting TV show/movie:", error);
    return NextResponse.json(
      { error: "Failed to delete TV show/movie" },
      { status: 500 }
    );
  }
}
