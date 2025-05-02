import { MongoClient, type Db } from "mongodb";

// Simple cache to reuse the database connection
const cache = {
  client: null as MongoClient | null,
  db: null as Db | null,
};

// Connects to MongoDB and returns the client and db instance
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  // Return cached connection if available
  if (cache.client && cache.db) {
    return { client: cache.client, db: cache.db };
  }

  // Ensure the MongoDB URI is set
  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  // Create and connect a new MongoDB client
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("task-app");

  // Cache the client and db for future use
  cache.client = client;
  cache.db = db;

  return { client, db };
}
