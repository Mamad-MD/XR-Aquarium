// DESTINATION: src/app/api/mentor/projects/[id]/availability/route.ts (new file)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MENTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { id } = await params;

    const project = await db.project.findUnique({ where: { id } });
    if (!project) {
      return NextResponse.json({ message: "پروژه یافت نشد" }, { status: 404 });
    }
    if (session.user.role !== "ADMIN" && project.mentorId !== session.user.id) {
      return NextResponse.json({ message: "این پروژه به شما اختصاص داده نشده است" }, { status: 403 });
    }

    const { availabilityDays, availabilityHours } = await req.json();

    const updated = await db.project.update({
      where: { id },
      data: {
        availabilityDays: availabilityDays?.trim() || null,
        availabilityHours: availabilityHours?.trim() || null,
      },
    });

    return NextResponse.json(
      { message: "زمان‌بندی در دسترس بودن با موفقیت ذخیره شد", project: updated },
      { status: 200 }
    );
  } catch (error) {
    console.error("[MENTOR_AVAILABILITY_PATCH]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}
