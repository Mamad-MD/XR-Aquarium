import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { message: "برای این کار باید وارد حساب کاربری خود شوید" },
        { status: 401 }
      );
    }

    const { requestId, status } = await req.json();

    if (!requestId || !["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "اطلاعات ارسالی نامعتبر است" },
        { status: 400 }
      );
    }

    const joinRequest = await db.teamJoinRequest.findUnique({
      where: { id: requestId },
      include: { team: true },
    });

    if (!joinRequest) {
      return NextResponse.json(
        { message: "درخواست مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    // فقط سرتیم (یا ادمین) اجازه بررسی درخواست را دارد
    if (
      joinRequest.team.leaderId !== session.user.id &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { message: "شما اجازه انجام این عملیات را ندارید" },
        { status: 403 }
      );
    }

    if (joinRequest.status !== "PENDING") {
      return NextResponse.json(
        { message: "این درخواست قبلاً بررسی شده است" },
        { status: 400 }
      );
    }

    if (status === "ACCEPTED") {
      // بررسی دوباره که کاربر در این فاصله عضو تیم دیگری نشده باشد
      const alreadyInTeam = await db.teamMember.findFirst({
        where: { userId: joinRequest.userId },
      });

      if (alreadyInTeam) {
        await db.teamJoinRequest.update({
          where: { id: requestId },
          data: { status: "REJECTED", reviewedAt: new Date() },
        });
        return NextResponse.json(
          { message: "این کاربر در حال حاضر عضو تیم دیگری است" },
          { status: 400 }
        );
      }

      await db.$transaction([
        db.teamJoinRequest.update({
          where: { id: requestId },
          data: { status: "ACCEPTED", reviewedAt: new Date() },
        }),
        db.teamMember.create({
          data: { teamId: joinRequest.teamId, userId: joinRequest.userId },
        }),
      ]);

      return NextResponse.json(
        { message: "کاربر با موفقیت به تیم اضافه شد" },
        { status: 200 }
      );
    }

    await db.teamJoinRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED", reviewedAt: new Date() },
    });

    return NextResponse.json(
      { message: "درخواست عضویت رد شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[TEAM_JOIN_RESPOND]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
