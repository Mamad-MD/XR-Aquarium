import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ message: "شناسه کاربر الزامی است" }, { status: 400 });
    }

    if (userId === session.user.id) {
      return NextResponse.json({ message: "نمی‌توانید حساب کاربری خودتان را حذف کنید" }, { status: 400 });
    }

    const targetUser = await db.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ message: "کاربر مورد نظر یافت نشد" }, { status: 404 });
    }

    try {
      await db.user.delete({ where: { id: userId } });
    } catch (dbError: any) {
      // خطای کلید خارجی: یعنی این کاربر جایی به‌عنوان منتور/سرپرست تیم و... رفرنس شده است
      if (dbError?.code === "P2003" || dbError?.code === "P2014") {
        return NextResponse.json(
          {
            message:
              "این کاربر قابل حذف نیست چون در جای دیگری استفاده شده (مثلاً منتور یک پروژه یا سرپرست یک تیم است). ابتدا آن ارتباط را حذف یا تغییر دهید.",
          },
          { status: 400 }
        );
      }
      throw dbError;
    }

    return NextResponse.json({ message: "کاربر با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_USER_DELETE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}
