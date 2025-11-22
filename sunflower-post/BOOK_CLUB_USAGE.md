# Book Club Usage Guide

## Features

The Book Club now includes three major features:

### 1. Book-themed Reactions
Users can react to books with Book Club-specific reactions:
- 🌻 Sunburst (Warmth)
- ❤️ Heart (Love)
- 🤝 With you
- ✨ Shine
- 📖 Bookmark
- 🧠 Thoughtful
- 💬 Reflecting

These reactions are personal and only visible to the user who sent them (dopamine-safe design).

### 2. Reading Status Management
Users can change their reading status for any book using the dropdown next to the status badge:
- **To read** - Books on the reading list
- **Reading** - Currently reading
- **Finished** - Completed books

The status dropdown appears on each book card and changes are saved immediately.

### 3. Database Integration
All book data, reactions, and reading statuses are now persisted in a database.

## Using the Database

### Initialize the Database
```bash
npm run db:init
```

This creates the `data/db.json` file with seed data.

### Reset the Database
```bash
npm run db:reset
```

This deletes the existing database and creates a fresh one.

### API Usage in Components

To use the database in your React components:

```typescript
import { fetchBooks, updateBookStatus, toggleBookReaction } from "@/lib/api/book-club";

// Fetch all books
const books = await fetchBooks();

// Update a user's reading status
await updateBookStatus(bookId, "Reading");

// Toggle a reaction
await toggleBookReaction(bookId, "bookmark", true);
```

## Current Implementation

### Frontend (BookClubRoom.tsx)
The component currently uses local state for development and testing. The data is stored in memory and resets on page refresh.

### Backend (API Routes)
Fully functional API routes are available at:
- `GET /api/book-club` - Get all books
- `POST /api/book-club` - Create a book
- `PATCH /api/book-club/[id]` - Update a book
- `PATCH /api/book-club/[id]/status` - Update reading status
- `POST /api/book-club/[id]/reactions` - Toggle reactions

### Database
File-based JSON storage in `data/db.json`. This can be upgraded to PostgreSQL, MySQL, or any database later.

## Connecting Frontend to Backend

To connect the BookClubRoom component to the database API, you'll need to:

1. Replace local state with API calls
2. Add loading states
3. Handle errors gracefully
4. Implement optimistic updates for better UX

Example:
```typescript
// Instead of local state
const [books, setBooks] = useState(INITIAL_BOOKS);

// Use SWR or React Query
import useSWR from 'swr';

const { data: books, mutate } = useSWR('/api/book-club',
  () => fetchBooks()
);

// Update status with optimistic update
async function handleStatusChange(bookId: string, newStatus: BookStatus) {
  // Optimistic update
  mutate(
    books.map(b => b.id === bookId ? {...b, status: newStatus} : b),
    false
  );

  // API call
  await updateBookStatus(bookId, newStatus);

  // Revalidate
  mutate();
}
```

## Authentication Note

Currently, the system uses a placeholder `"current-user"` for user IDs. When you add authentication:

1. Install your auth provider (NextAuth, Clerk, Auth0, etc.)
2. Get the user ID from the session
3. Pass it to the API calls

Example with NextAuth:
```typescript
import { useSession } from "next-auth/react";

function BookClubRoom() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Use userId in API calls
  await updateBookStatus(bookId, status, userId);
}
```

## Upgrading to a Real Database

See [DATABASE.md](./DATABASE.md) for detailed instructions on upgrading to PostgreSQL, MySQL, or another database using Prisma or another ORM.

## Testing

To test the features:

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit the Book Club page at `/book-club`

3. Try:
   - Clicking on reactions below each book
   - Changing the reading status using the dropdown
   - Adding a new book
   - Refreshing the page to see data persistence

## Troubleshooting

### Database file not found
Run `npm run db:init` to create the database file.

### Changes not persisting
Make sure the API routes are being called. Check the Network tab in browser DevTools.

### TypeScript errors
Run `npm run build` to check for type errors.

### Port already in use
If port 3000 is already in use, set a different port:
```bash
PORT=3001 npm run dev
```
