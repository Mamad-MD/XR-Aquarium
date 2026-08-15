import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db as prisma } from "@/lib/db";

// آرایه‌های مجاز برای تخصیص نقش‌ها (در محیط واقعی بهتر است از متغیرهای محیطی ENV خوانده شوند)
const ADMIN_IDS = ["40333253", "40333254","40666256"]; // دومی یک نمونه تستی است
const MENTOR_IDS = ["40555255"]; // جایگاه برای منتورها

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "لطفاً تمامی فیلدها را پر کنید." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "این شماره دانشجویی قبلاً در سیستم ثبت شده است." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // استخراج شماره دانشجویی از ایمیل ساختگی (مثلاً 40333253@xrlab.ir -> 40333253)
    const studentId = email.split('@')[0];

    // لاجیک تشخیص نقش
    let dbRole = "PARTICIPANT"; // پیش‌فرض برای همه
    if (ADMIN_IDS.includes(studentId) || ADMIN_IDS.includes(email)) {
      dbRole = "ADMIN";
    } else if (MENTOR_IDS.includes(studentId) || MENTOR_IDS.includes(email)) {
      dbRole = "MENTOR";
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: dbRole,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "خطای سرور. لطفاً با پشتیبانی تماس بگیرید." },
      { status: 500 }
    );
  }
}
