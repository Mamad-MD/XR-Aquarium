import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "برای این کار باید وارد حساب کاربری خود شوید" }, { status: 401 });
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ message: "شناسه پروژه الزامی است" }, { status: 400 });
    }

    // فقط سرپرست یک تیم می‌تواند برای پروژه درخواست دهد
    const team = await db.team.findFirst({
      where: { leaderId: session.user.id },
    });

    if (!team) {
      return NextResponse.json(
        { message: "فقط سرپرست تیم می‌تواند برای پروژه درخواست دهد. ابتدا یک تیم بسازید" },
        { status: 403 }
      );
    }

    if (team.status !== "APPROVED") {
      return NextResponse.json(
        { message: "تیم شما هنوز توسط مدیر سیستم تایید نشده است" },
        { status: 403 }
      );
    }

    const project = await db.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json({ message: "پروژه مورد نظر یافت نشد" }, { status: 404 });
    }

    const enrolledCount = await db.projectApplication.count({
      where: { projectId, status: "ACCEPTED" }
    });

    if (enrolledCount >= project.maxCapacity) {
      return NextResponse.json({ message: "ظرفیت این پروژه تکمیل شده است" }, { status: 400 });
    }

    // آیا تیم قبلاً برای پروژه دیگری پذیرفته شده است؟
    const activeAcceptance = await db.projectApplication.findFirst({
      where: { teamId: team.id, status: "ACCEPTED" }
    });

    if (activeAcceptance) {
      return NextResponse.json({ message: "تیم شما هم‌اکنون در پروژه دیگری پذیرفته شده است" }, { status: 400 });
    }

    const existingApplication = await db.projectApplication.findFirst({
      where: {
        userId: session.user.id,
        projectId
      }
    });

    if (existingApplication) {
      return NextResponse.json({ message: "شما قبلاً برای این پروژه درخواست داده‌اید" }, { status: 400 });
    }

    await db.projectApplication.create({
      data: {
        userId: session.user.id,
        projectId,
        teamId: team.id,
        status: "APPLIED"
      }
    });

    return NextResponse.json({ message: "درخواست تیم شما با موفقیت ثبت شد" }, { status: 200 });
  } catch (error) {
    console.error("[PROJECT_APPLY]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}
