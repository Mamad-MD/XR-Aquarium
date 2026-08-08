import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const json = await req.json();
    const { title, content, priority } = json;

    if (!title || !content) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const announcement = await db.announcement.create({
      data: {
        title,
        content,
        priority: priority || "MEDIUM",
        authorId: session.user.id,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error("[ANNOUNCEMENTS_POST]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
