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

    const application = await db.projectApplication.update({
      where: { id: applicationId },
      data: {
        status,
        reviewedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, message: "وضعیت درخواست با موفقیت به‌روزرسانی شد", application }, { status: 200 });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json({ error: "خطای داخلی سرور رخ داد" }, { status: 500 });
  }
}
