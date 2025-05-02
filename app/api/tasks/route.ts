import { verifyAuth } from "@/lib/auth-verifier";
import { connectToDatabase } from "@/lib/db";
import { taskRateLimiter } from "@/lib/rate-limit";
import { taskSchema } from "@/lib/validations";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Get all tasks for the authenticated user
export async function GET(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Verify user authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch tasks from the database for the user
    const { db } = await connectToDatabase();
    const tasks = await db
      .collection("tasks")
      .find({ userId: user.userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Create a new task for the authenticated user
export async function POST(request: NextRequest) {
  // Rate limiting
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Verify user authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate request body using schema
    try {
      taskSchema.parse(body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: error.errors[0].message },
          { status: 400 }
        );
      }
    }

    const { title, description = "" } = body;

    // Prepare and insert the new task
    const { db } = await connectToDatabase();
    const task = {
      title,
      description,
      completed: false,
      userId: user.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("tasks").insertOne(task);

    return NextResponse.json(
      { ...task, _id: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    // Log the server error
    console.error("Create task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
