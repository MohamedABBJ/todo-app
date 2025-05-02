import { verifyAuth } from "@/lib/auth-verifier";
import { connectToDatabase } from "@/lib/db";
import { taskRateLimiter } from "@/lib/rate-limit";
import { taskSchema } from "@/lib/validations";
import { ObjectId } from "mongodb";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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
    console.error("Get task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

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

    const updateData: {
      title?: string;
      description?: string;
      completed?: boolean;
      updatedAt: Date;
    } = { updatedAt: new Date() };

    if (body.title !== undefined) updateData.title = body.title;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.completed !== undefined) updateData.completed = body.completed;

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
    console.error("Update task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const rateLimitResult = await taskRateLimiter(request);
  if (rateLimitResult) return rateLimitResult;

  try {
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("tasks").deleteOne({
      _id: new ObjectId(params.id),
      userId: user.userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
