/**
 * Database Initialization Script
 *
 * Run this script to initialize or reset the database.
 * Usage:
 *   npm run db:init
 *   npm run db:reset
 */

import { initializeDatabase, readDatabase } from "../src/lib/db";

async function main() {
  console.log("🌻 Initializing Sunflower Post database...");

  try {
    await initializeDatabase();

    const db = await readDatabase();
    console.log(`✅ Database initialized successfully!`);
    console.log(`📚 Books: ${db.books.length}`);
    console.log(`💬 Discussions: ${db.discussions.length}`);
    console.log(`❤️ Reactions: ${db.reactions.length}`);
    console.log(`📊 User statuses: ${db.userBookStatuses.length}`);
    console.log(``);
    console.log(`Database location: data/db.json`);
  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  }
}

main();
