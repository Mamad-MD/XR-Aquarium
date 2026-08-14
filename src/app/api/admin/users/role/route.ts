import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

const ALLOWED_ROLES = ["PARTICIPANT", "MENTOR", "ADMIN"];

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { userId, role } = await req.json();

    if (!userId || !ALLOWED_ROLES.includes(role)) {
      return NextResponse.json({ message: "اطلاعات ارسالی نامعتبر است" }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ message: "کاربر مورد نظر یافت نشد" }, { status: 404 });
    }

    await db.user.update({
      where: { id: userId },
      data: { role },
    });

    return NextResponse.json({ message: "نقش کاربر با موفقیت به‌روزرسانی شد" }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_USER_ROLE_UPDATE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}
