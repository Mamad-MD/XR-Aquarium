import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";
import { auth } from "@/auth";

export async function POST(req: Request) {
  try {
    // ۱. بررسی احراز هویت کاربر
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "شما وارد سیستم نشده‌اید." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "لطفاً تمامی فیلدها را پر کنید." }, { status: 400 });
    }

    // ۲. پیدا کردن کاربر در دیتابیس
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "کاربر یافت نشد." }, { status: 404 });
    }

    // ۳. بررسی صحت رمز عبور فعلی
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "رمز عبور فعلی اشتباه است." }, { status: 400 });
    }

    // ۴. هش کردن رمز جدید و ذخیره در دیتابیس
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return NextResponse.json({ message: "رمز عبور با موفقیت تغییر کرد." }, { status: 200 });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ error: "خطای سرور. لطفاً دوباره تلاش کنید." }, { status: 500 });
  }
}
