import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MENTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "دسترسی غیرمجاز" }, { status: 403 });
    }

    const { taskId, approved } = await req.json();
    if (!taskId || typeof approved !== "boolean") {
      return NextResponse.json({ message: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
    }

    const task = await db.projectTask.findUnique({ where: { id: taskId }, include: { project: true } });
    if (!task) {
      return NextResponse.json({ message: "وظیفه مورد نظر یافت نشد" }, { status: 404 });
    }

    if (task.project.mentorId !== session.user.id && session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "شما منتور این پروژه نیستید" }, { status: 403 });
    }

    if (task.status !== "DONE") {
      return NextResponse.json({ message: "این وظیفه هنوز توسط تیم انجام‌شده علامت زده نشده است" }, { status: 400 });
    }

    const updated = await db.projectTask.update({
      where: { id: taskId },
      data: approved
        ? { status: "APPROVED", approvedAt: new Date() }
        : { status: "PENDING", completedAt: null },
    });

    return NextResponse.json(
      { message: approved ? "وظیفه تایید شد" : "وظیفه به تیم برای انجام مجدد بازگردانده شد", task: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("[MENTOR_TASK_APPROVE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}
