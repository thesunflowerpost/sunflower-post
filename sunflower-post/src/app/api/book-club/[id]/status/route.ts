import { NextRequest, NextResponse } from "next/server";
import { updateUserBookStatus, getUserBookStatus } from "@/lib/db";
import type { BookStatus } from "@/lib/db/schema";

/**
 * PATCH /api/book-club/[id]/status
 * Update a user's reading status for a book
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
    const status: BookStatus = body.status;

    if (!status || !["Reading", "Finished", "To read"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'Reading', 'Finished', or 'To read'" },
        { status: 400 }
      );
    }

    await updateUserBookStatus(id, userId, status);

    return NextResponse.json({ success: true, status });
  } catch (error) {
    console.error("Error updating book status:", error);
    return NextResponse.json(
      { error: "Failed to update book status" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/book-club/[id]/status
 * Get a user's reading status for a book
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "current-user";

    const status = await getUserBookStatus(id, userId);

    return NextResponse.json({ status });
  } catch (error) {
    console.error("Error fetching book status:", error);
    return NextResponse.json(
      { error: "Failed to fetch book status" },
      { status: 500 }
    );
  }
}
