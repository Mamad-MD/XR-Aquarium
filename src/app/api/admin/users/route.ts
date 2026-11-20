// DESTINATION: src/app/api/admin/users/route.ts (replace the whole file)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

type Action = "BAN" | "UNBAN" | "CONFIRM_PAYMENT" | "REVOKE_PAYMENT";

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
    } catch (dbError: unknown) {
      // خطای کلید خارجی: یعنی این کاربر جایی به‌عنوان منتور/سرپرست تیم و... رفرنس شده است
      if (dbError instanceof Object && "code" in dbError && (dbError.code === "P2003" || dbError.code === "P2014")) {
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

// بن / آنبن کاربر و تایید یا لغو تایید پرداخت
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "شما دسترسی این عملیات را ندارید" },
        { status: 403 }
      );
    }

    const { userId, action } = (await req.json()) as {
      userId?: string;
      action?: Action;
    };

    if (!userId || !action) {
      return NextResponse.json(
        { message: "اطلاعات ناقص است" },
        { status: 400 }
      );
    }

    if (userId === session.user.id && action === "BAN") {
      return NextResponse.json(
        { message: "امکان مسدود کردن حساب خودتان وجود ندارد" },
        { status: 400 }
      );
    }

    let data: Record<string, boolean> = {};
    let successMessage = "";

    switch (action) {
      case "BAN":
        data = { isBanned: true };
        successMessage = "کاربر با موفقیت مسدود شد";
        break;
      case "UNBAN":
        data = { isBanned: false };
        successMessage = "کاربر با موفقیت رفع مسدودیت شد";
        break;
      case "CONFIRM_PAYMENT":
        data = { paymentConfirmed: true };
        successMessage = "پرداخت کاربر تایید و دسترسی او باز شد";
        break;
      case "REVOKE_PAYMENT":
        data = { paymentConfirmed: false };
        successMessage = "تایید پرداخت کاربر لغو شد";
        break;
      default:
        return NextResponse.json(
          { message: "عملیات نامعتبر است" },
          { status: 400 }
        );
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data,
    });

    return NextResponse.json(
      { message: successMessage, user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN_USERS_PATCH]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
