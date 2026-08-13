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

    const { requestId } = await req.json();
    if (!requestId) {
      return NextResponse.json(
        { message: "شناسه درخواست الزامی است" },
        { status: 400 }
      );
    }

    const equipmentRequest = await db.equipmentRequest.findUnique({
      where: { id: requestId },
      include: { team: true },
    });

    if (!equipmentRequest) {
      return NextResponse.json(
        { message: "درخواست مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    const isLeader = equipmentRequest.team.leaderId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isLeader && !isAdmin) {
      return NextResponse.json(
        { message: "شما اجازه انجام این عملیات را ندارید" },
        { status: 403 }
      );
    }

    if (equipmentRequest.status !== "APPROVED") {
      return NextResponse.json(
        { message: "این تجهیز در حال حاضر در اختیار تیم نیست" },
        { status: 400 }
      );
    }

    await db.$transaction([
      db.equipmentRequest.update({
        where: { id: requestId },
        data: { status: "RETURNED", returnedAt: new Date() },
      }),
      db.equipment.update({
        where: { id: equipmentRequest.equipmentId },
        data: { availableQuantity: { increment: equipmentRequest.quantity } },
      }),
    ]);

    return NextResponse.json(
      {
        message: isAdmin && !isLeader
          ? "تجهیز از تیم بازپس گرفته شد"
          : "تجهیز با موفقیت آزاد شد",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[EQUIPMENT_RETURN]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
