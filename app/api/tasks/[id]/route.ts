import { verifyAuth } from "@/lib/auth-verifier";
import { connectToDatabase } from "@/lib/db";
import { taskRateLimiter } from "@/lib/rate-limit";
import { taskSchema } from "@/lib/validations";
import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Get a specific task for the authenticated user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Verify user authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Fetch task from the database
    const { db } = await connectToDatabase();
    const task = await db.collection("tasks").findOne({
      _id: new ObjectId(params.id),
      userId: user.userId,
    });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    // Log the server error
    console.error("Get task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update a specific task for the authenticated user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate title/description if provided
    if (body.title !== undefined || body.description !== undefined) {
      try {
        taskSchema.parse({
          title: body.title,
          description: body.description,
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json(
            { error: error.errors[0].message },
            { status: 400 }
          );
        }
      }
    }

    // Prepare update data
    const updateData: {
      title?: string;
      description?: string;
      completed?: boolean;
      updatedAt: Date;
    } = { updatedAt: new Date() };

    // Update title/description if provided
    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.completed !== undefined) updateData.completed = body.completed;

    // Update task
    const { db } = await connectToDatabase();
    const result = await db
      .collection("tasks")
      .updateOne(
        { _id: new ObjectId(params.id), userId: user.userId },
        { $set: updateData }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task updated successfully" });
  } catch (error) {
    // Log the server error
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a specific task for the authenticated user
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Rate limiting
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    // Verify user authentication
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Delete task
    const { db } = await connectToDatabase();
    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(params.id),
      userId: user.userId,
    });
    // Check if task was deleted
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    // Log the server error
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
