import { NextRequest, NextResponse } from "next/server";
import { getTVMovies, createTVMovie } from "@/lib/db";
import type { TVMovie } from "@/lib/db/schema";

/**
 * GET /api/tv-movies
 * Fetch all TV shows and movies
 */
export async function GET() {
  try {
    const tvMovies = await getTVMovies();
    return NextResponse.json({ tvMovies });
  } catch (error) {
    console.error("Error fetching TV shows/movies:", error);
    return NextResponse.json(
      { error: "Failed to fetch TV shows/movies" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tv-movies
 * Create a new TV show or movie
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.type) {
      return NextResponse.json(
        { error: "Title and type are required" },
        { status: 400 }
      );
    }

    const newTVMovie = await createTVMovie({
      title: body.title,
      type: body.type,
      status: body.status || "Want to watch",
      mood: body.mood || "Other",
      genre: body.genre,
      era: body.era,
      platform: body.platform,
      note: body.note,
      sharedBy: body.sharedBy || "Anon",
      coverUrl: body.coverUrl,
      trailerUrl: body.trailerUrl,
      link: body.link,
      discussionCount: 0,
    });

    return NextResponse.json({ tvMovie: newTVMovie }, { status: 201 });
  } catch (error) {
    console.error("Error creating TV show/movie:", error);
    return NextResponse.json(
      { error: "Failed to create TV show/movie" },
      { status: 500 }
    );
  }
}
