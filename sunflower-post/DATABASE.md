# Database Documentation

## Overview

The Sunflower Post currently uses a simple file-based JSON database for development and small-scale deployments. This can be easily upgraded to a full database like PostgreSQL, MySQL, or MongoDB later.

## Current Implementation

### Storage
- **Type**: File-based JSON storage
- **Location**: `data/db.json`
- **Schema**: Defined in `src/lib/db/schema.ts`

### Features
- Books management (CRUD operations)
- User reading status tracking
- Reaction system
- Discussion threads (schema ready)

## Database Schema

### Books
```typescript
{
  id: string
  title: string
  author: string
  status: "Reading" | "Finished" | "To read"
  mood: string
  theme?: string
  format?: string
  sharedBy: string
  note?: string
  coverUrl?: string
  link?: string
  discussionCount: number
  createdAt: string
  updatedAt: string
}
```

### User Book Statuses
Tracks each user's personal reading status for books.
```typescript
{
  id: string
  bookId: string
  userId: string
  status: "Reading" | "Finished" | "To read"
  updatedAt: string
}
```

### Reactions
```typescript
{
  id: string
  bookId: string
  userId: string
  reactionId: string
  createdAt: string
}
```

## API Endpoints

### Books

#### Get all books
```
GET /api/book-club
Response: { books: Book[] }
```

#### Get single book
```
GET /api/book-club/[id]
Response: { book: Book }
```

#### Create a book
```
POST /api/book-club
Body: {
  title: string
  author: string
  status?: BookStatus
  mood?: string
  theme?: string
  format?: string
  sharedBy?: string
  note?: string
  coverUrl?: string
  link?: string
}
Response: { book: Book }
```

#### Update a book
```
PATCH /api/book-club/[id]
Body: Partial<Book>
Response: { book: Book }
```

#### Delete a book
```
DELETE /api/book-club/[id]
Response: { success: boolean }
```

### User Book Status

#### Update user's reading status
```
PATCH /api/book-club/[id]/status
Body: {
  status: BookStatus
  userId?: string  // Optional, defaults to "current-user"
}
Response: { success: boolean, status: BookStatus }
```

#### Get user's reading status
```
GET /api/book-club/[id]/status?userId=xxx
Response: { status: BookStatus | null }
```

### Reactions

#### Toggle a reaction
```
POST /api/book-club/[id]/reactions
Body: {
  reactionId: string
  active: boolean
  userId?: string  // Optional, defaults to "current-user"
}
Response: { success: boolean }
```

#### Get user's reactions
```
GET /api/book-club/reactions?userId=xxx
Response: { reactions: Record<bookId, Record<reactionId, boolean>> }
```

## Initialization

The database is automatically initialized when the server starts. If the `data/db.json` file doesn't exist, it will be created with seed data.

## Upgrading to a Real Database

When you're ready to upgrade to PostgreSQL, MySQL, or another database:

### Option 1: Using Prisma (Recommended)

1. Install Prisma:
```bash
npm install @prisma/client
npm install -D prisma
```

2. Initialize Prisma:
```bash
npx prisma init
```

3. Convert the schema in `src/lib/db/schema.ts` to `prisma/schema.prisma`:
```prisma
model Book {
  id              String   @id @default(cuid())
  title           String
  author          String
  status          String
  mood            String
  theme           String?
  format          String?
  sharedBy        String
  note            String?
  coverUrl        String?
  link            String?
  discussionCount Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  reactions       BookReaction[]
  userStatuses    UserBookStatus[]
}

model BookReaction {
  id         String   @id @default(cuid())
  bookId     String
  userId     String
  reactionId String
  createdAt  DateTime @default(now())

  book       Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)

  @@unique([bookId, userId, reactionId])
}

model UserBookStatus {
  id        String   @id @default(cuid())
  bookId    String
  userId    String
  status    String
  updatedAt DateTime @updatedAt

  book      Book     @relation(fields: [bookId], references: [id], onDelete: Cascade)

  @@unique([bookId, userId])
}
```

4. Run migrations:
```bash
npx prisma migrate dev --name init
```

5. Replace the functions in `src/lib/db/index.ts` with Prisma queries.

### Option 2: Using a Different ORM

You can also use TypeORM, Sequelize, or write raw SQL queries. Just replace the functions in `src/lib/db/index.ts` while keeping the same API interface.

## Authentication Note

Currently, the API uses a placeholder `"current-user"` for the userId. When you add authentication (NextAuth, Clerk, Auth0, etc.), replace this with the actual authenticated user ID from the session.

Example with NextAuth:
```typescript
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id || "guest";
  // ... rest of the handler
}
```

## Backup

To backup your data, simply copy the `data/db.json` file:
```bash
cp data/db.json data/db.backup.json
```

## Data Migration

If you need to migrate from the JSON file to a real database:

1. Read the JSON file
2. Insert all records into the new database
3. Update environment variables to point to the new database
4. Test thoroughly
5. Remove the old JSON file

A migration script example:
```typescript
// scripts/migrate-to-db.ts
import { readDatabase } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrate() {
  const data = await readDatabase();

  for (const book of data.books) {
    await prisma.book.create({ data: book });
  }

  // Migrate other collections...
}

migrate();
```
