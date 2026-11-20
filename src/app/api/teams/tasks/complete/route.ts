import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "برای این کار باید وارد حساب کاربری خود شوید" }, { status: 401 });
    }

    const { taskId } = await req.json();
    if (!taskId) {
      return NextResponse.json({ message: "شناسه وظیفه الزامی است" }, { status: 400 });
    }

    const task = await db.projectTask.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ message: "وظیفه مورد نظر یافت نشد" }, { status: 404 });
    }

    // فقط سرپرست تیمی که این پروژه به آن اختصاص یافته می‌تواند وظیفه را انجام‌شده علامت بزند
    const acceptedApplication = await db.projectApplication.findFirst({
      where: { projectId: task.projectId, status: "ACCEPTED" },
      include: { team: true },
    });

    if (!acceptedApplication?.team || acceptedApplication.team.leaderId !== session.user.id) {
      return NextResponse.json({ message: "فقط سرپرست تیم این پروژه می‌تواند وظیفه را تکمیل کند" }, { status: 403 });
    }

    if (task.status !== "PENDING") {
      return NextResponse.json({ message: "این وظیفه در وضعیت قابل تکمیل نیست" }, { status: 400 });
    }

    const updated = await db.projectTask.update({
      where: { id: taskId },
      data: { status: "DONE", completedAt: new Date() },
    });

    return NextResponse.json({ message: "وظیفه به‌عنوان انجام‌شده ثبت شد و منتظر تایید منتور است", task: updated }, { status: 200 });
  } catch (error) {
    console.error("[TEAM_TASK_COMPLETE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}
