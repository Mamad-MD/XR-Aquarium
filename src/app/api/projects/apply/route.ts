import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (session.user.role !== "PARTICIPANT") {
      return new NextResponse("Only participants can apply", { status: 403 });
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return new NextResponse("Project ID required", { status: 400 });
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return new NextResponse("Project not found", { status: 404 });
    }

    // You might want to actually count enrolled students here instead of 0
    // But as per instructions: check if not full
    const enrolledCount = await db.projectApplication.count({
      where: { projectId, status: "ACCEPTED" } // Example status
    });

    if (enrolledCount >= project.maxCapacity) {
      return new NextResponse("Project is full", { status: 400 });
    }

    const existingApplication = await db.projectApplication.findFirst({
      where: {
        userId: session.user.id,
        projectId
      }
    });

    if (existingApplication) {
      return new NextResponse("Already applied to this project", { status: 400 });
    }

    await db.projectApplication.create({
      data: {
        userId: session.user.id,
        projectId,
        status: "APPLIED"
      }
    });

    return new NextResponse("OK", { status: 200 });
  } catch (error) {
    console.error("[PROJECT_APPLY]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
