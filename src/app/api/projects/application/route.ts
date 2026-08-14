import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: "دسترسی غیرمجاز" }, { status: 401 });
    }

    const { applicationId, status } = await req.json();

    if (!applicationId || !status) {
      return NextResponse.json({ error: "شناسه درخواست یا وضعیت مشخص نشده است" }, { status: 400 });
    }

    const application = await db.projectApplication.findUnique({
      where: { id: applicationId },
    });

    if (!application) {
      return NextResponse.json({ error: "درخواست مورد نظر یافت نشد" }, { status: 404 });
    }

    if (status === 'ACCEPTED') {
      // هر پروژه فقط یک تیم پذیرفته‌شده دارد
      const alreadyAccepted = await db.projectApplication.findFirst({
        where: { projectId: application.projectId, status: 'ACCEPTED' },
      });

      if (alreadyAccepted && alreadyAccepted.id !== applicationId) {
        return NextResponse.json(
          { error: "این پروژه قبلاً به یک تیم دیگر اختصاص یافته است" },
          { status: 400 }
        );
      }

      // پذیرفتن این درخواست + رد خودکار سایر درخواست‌های در انتظار همین پروژه + تغییر وضعیت پروژه
      await db.$transaction([
        db.projectApplication.update({
          where: { id: applicationId },
          data: { status: 'ACCEPTED', reviewedAt: new Date() },
        }),
        db.projectApplication.updateMany({
          where: {
            projectId: application.projectId,
            id: { not: applicationId },
            status: { in: ['APPLIED', 'UNDER_REVIEW'] },
          },
          data: { status: 'REJECTED', reviewedAt: new Date() },
        }),
        db.project.update({
          where: { id: application.projectId },
          data: { status: 'IN_PROGRESS' },
        }),
      ]);

      return NextResponse.json(
        { success: true, message: "تیم با موفقیت به این پروژه اختصاص یافت و سایر درخواست‌ها رد شدند" },
        { status: 200 }
      );
    }

    const updated = await db.projectApplication.update({
      where: { id: applicationId },
      data: {
        status,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "وضعیت درخواست با موفقیت به‌روزرسانی شد", application: updated }, { status: 200 });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "خطای داخلی سرور رخ داد" }, { status: 500 });
  }
}
