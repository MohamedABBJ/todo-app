import { MongoClient, type Db } from "mongodb";

const cache = {
  client: null as MongoClient | null,
  db: null as Db | null,
};

export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  if (cache.client && cache.db) {
    return { client: cache.client, db: cache.db };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Please define the MONGODB_URI environment variable");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  const db = client.db("task-app");

  cache.client = client;
  cache.db = db;

  return { client, db };
}
