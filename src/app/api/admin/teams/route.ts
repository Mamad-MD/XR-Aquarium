import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "شما دسترسی این عملیات را ندارید" },
        { status: 403 }
      );
    }

    const { teamId, status } = await req.json();

    if (!teamId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "اطلاعات ارسالی نامعتبر است" },
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

    await db.team.update({
      where: { id: teamId },
      data: { status, reviewedAt: new Date() },
    });

    return NextResponse.json(
      {
        message:
          status === "APPROVED"
            ? "تیم با موفقیت تایید شد"
            : "تیم رد شد",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN_TEAM_REVIEW]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
