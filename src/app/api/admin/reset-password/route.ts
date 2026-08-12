import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    // ۱. بررسی دسترسی ادمین
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "شما دسترسی این عملیات را ندارید." }, { status: 403 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "آیدی کاربر ارسال نشده است." }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return NextResponse.json({ error: "کاربر مورد نظر یافت نشد." }, { status: 404 });
    }

    // ۲. استخراج شماره دانشجویی (از ایمیلی که قبلاً با @xrlab.ir ذخیره کرده بودیم)
    const newPasswordRaw = targetUser.email ? targetUser.email.split('@')[0] : "123456";
    const hashedPassword = await bcrypt.hash(newPasswordRaw, 10);

    // ۳. آپدیت دیتابیس
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    return NextResponse.json({
      message: "رمز عبور با موفقیت ریست شد.",
      newPassword: newPasswordRaw
    }, { status: 200 });

  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ error: "خطای سرور. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
