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

    const { requestId, status } = await req.json();

    if (!requestId || !["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { message: "اطلاعات ارسالی نامعتبر است" },
        { status: 400 }
      );
    }

    const request = await db.equipmentRequest.findUnique({
      where: { id: requestId },
      include: { equipment: true },
    });

    if (!request) {
      return NextResponse.json(
        { message: "درخواست مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    if (request.status !== "PENDING") {
      return NextResponse.json(
        { message: "این درخواست قبلاً بررسی شده است" },
        { status: 400 }
      );
    }

    if (status === "APPROVED") {
      if (request.equipment.availableQuantity < request.quantity) {
        return NextResponse.json(
          { message: "موجودی کافی برای تایید این درخواست وجود ندارد" },
          { status: 400 }
        );
      }

      await db.$transaction([
        db.equipmentRequest.update({
          where: { id: requestId },
          data: { status: "APPROVED", reviewedAt: new Date() },
        }),
        db.equipment.update({
          where: { id: request.equipmentId },
          data: { availableQuantity: { decrement: request.quantity } },
        }),
      ]);

      return NextResponse.json(
        { message: "درخواست تجهیز تایید و به تیم اختصاص یافت" },
        { status: 200 }
      );
    }

    await db.equipmentRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED", reviewedAt: new Date() },
    });

    return NextResponse.json(
      { message: "درخواست تجهیز رد شد" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN_EQUIPMENT_REQUEST_REVIEW]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
