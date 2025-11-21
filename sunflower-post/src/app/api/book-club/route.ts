import { NextRequest, NextResponse } from "next/server";
import { getBooks, createBook } from "@/lib/db";
import type { Book } from "@/lib/db/schema";

/**
 * GET /api/book-club
 * Fetch all books
 */
export async function GET() {
  try {
    const books = await getBooks();
    return NextResponse.json({ books });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { error: "Failed to fetch books" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/book-club
 * Create a new book
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.author) {
      return NextResponse.json(
        { error: "Title and author are required" },
        { status: 400 }
      );
    }

    const newBook = await createBook({
      title: body.title,
      author: body.author,
      status: body.status || "To read",
      mood: body.mood || "Other",
      theme: body.theme,
      format: body.format,
      sharedBy: body.sharedBy || "Anon",
      note: body.note,
      coverUrl: body.coverUrl,
      link: body.link,
      discussionCount: 0,
    });

    return NextResponse.json({ book: newBook }, { status: 201 });
  } catch (error) {
    console.error("Error creating book:", error);
    return NextResponse.json(
      { error: "Failed to create book" },
      { status: 500 }
    );
  }
}
