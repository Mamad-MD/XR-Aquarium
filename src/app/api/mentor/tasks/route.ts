import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function assertMentorOwnsProject(userId: string, role: string, projectId: string) {
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) return { error: "پروژه مورد نظر یافت نشد", status: 404 };
  if (project.mentorId !== userId && role !== "ADMIN") {
    return { error: "شما منتور این پروژه نیستید", status: 403 };
  }
  return { project };
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MENTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "فقط منتور پروژه می‌تواند وظیفه اضافه کند" }, { status: 403 });
    }

    const { projectId, title, description } = await req.json();
    if (!projectId || !title) {
      return NextResponse.json({ message: "عنوان وظیفه و شناسه پروژه الزامی است" }, { status: 400 });
    }

    const check = await assertMentorOwnsProject(session.user.id, session.user.role, projectId);
    if ("error" in check) {
      return NextResponse.json({ message: check.error }, { status: check.status });
    }

    const task = await db.projectTask.create({
      data: {
        projectId,
        title: title.trim(),
        description: description?.trim() || null,
      },
    });

    return NextResponse.json({ message: "وظیفه با موفقیت اضافه شد", task }, { status: 201 });
  } catch (error) {
    console.error("[MENTOR_TASK_CREATE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MENTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ message: "شناسه وظیفه الزامی است" }, { status: 400 });
    }

    const task = await db.projectTask.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) {
      return NextResponse.json({ message: "وظیفه مورد نظر یافت نشد" }, { status: 404 });
    }

    if (task.project.mentorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "شما منتور این پروژه نیستید" }, { status: 403 });
    }

    await db.projectTask.delete({ where: { id: taskId } });

    return NextResponse.json({ message: "وظیفه حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("[MENTOR_TASK_DELETE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}
