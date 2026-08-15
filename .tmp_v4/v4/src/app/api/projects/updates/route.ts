import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "برای این کار باید وارد حساب کاربری خود شوید" }, { status: 401 });
    }

    const { projectId, content } = await req.json();
    if (!projectId || !content?.trim()) {
      return NextResponse.json({ message: "متن گزارش الزامی است" }, { status: 400 });
    }

    const acceptedApplication = await db.projectApplication.findFirst({
      where: { projectId, status: "ACCEPTED" },
      include: { team: true },
    });

    if (!acceptedApplication?.team || acceptedApplication.team.leaderId !== session.user.id) {
      return NextResponse.json({ message: "فقط سرپرست تیم این پروژه می‌تواند گزارش پیشرفت ثبت کند" }, { status: 403 });
    }

    const update = await db.projectUpdate.create({
      data: {
        projectId,
        content: content.trim(),
        authorId: session.user.id,
      },
    });

    return NextResponse.json({ message: "گزارش پیشرفت با موفقیت ثبت شد", update }, { status: 201 });
  } catch (error) {
    console.error("[PROJECT_UPDATE_CREATE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}
