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
        { message: "فقط شرکت‌کنندگان می‌توانند درخواست عضویت بدهند" },
        { status: 403 }
      );
    }

    const { teamId, message } = await req.json();

    if (!teamId) {
      return NextResponse.json(
        { message: "شناسه تیم الزامی است" },
        { status: 400 }
      );
    }

    const team = await db.team.findUnique({ where: { id: teamId } });
    if (!team) {
      return NextResponse.json(
        { message: "تیم مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // آیا کاربر از قبل عضو یک تیم است؟ (همین تیم یا تیم دیگر)
    const existingMembership = await db.teamMember.findFirst({
      where: { userId: session.user.id },
    });
    if (existingMembership) {
      return NextResponse.json(
        { message: "شما در حال حاضر عضو یک تیم هستید" },
        { status: 400 }
      );
    }

    // بررسی درخواست قبلی برای همین تیم
    const existingRequest = await db.teamJoinRequest.findUnique({
      where: {
        userId_teamId: {
          userId: session.user.id,
          teamId,
        },
      },
    });

    if (existingRequest?.status === "PENDING") {
      return NextResponse.json(
        { message: "شما قبلاً برای این تیم درخواست داده‌اید" },
        { status: 400 }
      );
    }

    if (existingRequest) {
      // اگر قبلاً رد شده بود، درخواست را دوباره فعال می‌کنیم
      await db.teamJoinRequest.update({
        where: { id: existingRequest.id },
        data: {
          status: "PENDING",
          message: message?.trim() || null,
          reviewedAt: null,
        },
      });
    } else {
      await db.teamJoinRequest.create({
        data: {
          teamId,
          userId: session.user.id,
          message: message?.trim() || null,
        },
      });
    }

    return NextResponse.json(
      { message: "درخواست عضویت شما با موفقیت برای سرتیم ارسال شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TEAM_JOIN_REQUEST]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
