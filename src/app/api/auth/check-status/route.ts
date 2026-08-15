// DESTINATION: src/app/api/auth/check-status/route.ts (new file)
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// این روت عمداً عمومی (بدون نیاز به لاگین) است، چون باید قبل از تلاش برای
// ورود صدا زده شود تا بشود پیام «حساب مسدود است» را بدون رفرش صفحه نشان داد.
// فقط وضعیت مسدود بودن را برمی‌گرداند، نه هیچ اطلاعات حساس دیگری.
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ banned: false }, { status: 200 });
    }

    const user = await db.user.findUnique({
      where: { email },
      select: { isBanned: true },
    });

    return NextResponse.json({ banned: !!user?.isBanned }, { status: 200 });
  } catch (error) {
    console.error("[AUTH_CHECK_STATUS]", error);
    // در صورت بروز خطای غیرمنتظره، اجازه می‌دهیم روند عادی signIn ادامه پیدا کند
    return NextResponse.json({ banned: false }, { status: 200 });
  }
}
