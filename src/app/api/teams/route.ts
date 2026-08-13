import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "برای این کار باید وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    if (session.user.role !== "PARTICIPANT") {
      return NextResponse.json(
        { message: "فقط شرکت‌کنندگان می‌توانند تیم بسازند" },
        { status: 403 }
      );
    }

    const { name, nameFa, description } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { message: "نام تیم الزامی است" },
        { status: 400 }
      );
    }

    // هر کاربر فقط می‌تواند عضو یک تیم باشد
    const existingMembership = await db.teamMember.findFirst({
      where: { userId: session.user.id },
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "شما در حال حاضر عضو یک تیم هستید و نمی‌توانید تیم جدید بسازید" },
        { status: 400 }
      );
    }

    const team = await db.team.create({
      data: {
        name: name.trim(),
        nameFa: nameFa?.trim() || null,
        description: description?.trim() || null,
        leaderId: session.user.id,
        members: {
          create: { userId: session.user.id },
        },
      },
      include: {
        leader: true,
        members: { include: { user: true } },
      },
    });

    return NextResponse.json(
      { message: "تیم شما با موفقیت ساخته شد", team },
      { status: 201 }
    );
  } catch (error) {
    console.error("[TEAMS_CREATE]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
