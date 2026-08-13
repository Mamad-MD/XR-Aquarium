import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(_req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "برای این کار باید وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const membership = await db.teamMember.findFirst({
      where: { userId: session.user.id },
      include: { team: true },
    });

    if (!membership) {
      return NextResponse.json(
        { message: "شما عضو هیچ تیمی نیستید" },
        { status: 400 }
      );
    }

    if (membership.team.leaderId === session.user.id) {
      // اگر سرتیم خارج شود، کل تیم منحل می‌شود
      // (اعضا و درخواست‌های عضویت به‌صورت خودکار حذف می‌شوند - onDelete: Cascade)
      await db.team.delete({ where: { id: membership.teamId } });
      return NextResponse.json(
        { message: "شما از تیم خارج شدید و تیم منحل شد" },
        { status: 200 }
      );
    }

    await db.teamMember.delete({ where: { id: membership.id } });

    return NextResponse.json(
      { message: "شما با موفقیت از تیم خارج شدید" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TEAM_LEAVE]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
