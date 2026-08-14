// DESTINATION: src/app/api/mentor/profile/route.ts (new file)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "MENTOR") {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { telegramUsername } = await req.json();
    const cleaned = (telegramUsername || "").toString().trim().replace(/^@/, "");

    const updatedUser = await db.user.update({
      where: { id: session.user.id },
      data: { telegramUsername: cleaned || null },
    });

    return NextResponse.json(
      { message: "آیدی تلگرام با موفقیت ذخیره شد", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("[MENTOR_PROFILE_PATCH]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}
