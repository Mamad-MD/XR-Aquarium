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

    const { equipmentId, quantity } = await req.json();

    if (!equipmentId) {
      return NextResponse.json(
        { message: "شناسه تجهیز الزامی است" },
        { status: 400 }
      );
    }

    const qty = Number(quantity) > 0 ? Number(quantity) : 1;

    // فقط سرپرست یک تیم تاییدشده می‌تواند تجهیز درخواست دهد
    const team = await db.team.findFirst({
      where: { leaderId: session.user.id },
    });

    if (!team) {
      return NextResponse.json(
        { message: "فقط سرپرست تیم می‌تواند درخواست تجهیز ثبت کند" },
        { status: 403 }
      );
    }

    if (team.status !== "APPROVED") {
      return NextResponse.json(
        { message: "تیم شما هنوز توسط مدیر سیستم تایید نشده است" },
        { status: 403 }
      );
    }

    const equipment = await db.equipment.findUnique({
      where: { id: equipmentId },
    });

    if (!equipment) {
      return NextResponse.json(
        { message: "تجهیز مورد نظر یافت نشد" },
        { status: 404 }
      );
    }

    if (equipment.availableQuantity < qty) {
      return NextResponse.json(
        { message: "موجودی کافی برای این درخواست وجود ندارد" },
        { status: 400 }
      );
    }

    const existingPending = await db.equipmentRequest.findFirst({
      where: { equipmentId, teamId: team.id, status: "PENDING" },
    });

    if (existingPending) {
      return NextResponse.json(
        { message: "شما قبلاً برای این تجهیز درخواست ثبت کرده‌اید" },
        { status: 400 }
      );
    }

    await db.equipmentRequest.create({
      data: {
        equipmentId,
        teamId: team.id,
        quantity: qty,
        requestedById: session.user.id,
      },
    });

    return NextResponse.json(
      { message: "درخواست تجهیز شما ثبت شد و در انتظار تایید منتور مربوطه است" },
      { status: 200 }
    );
  } catch (error) {
    console.error("[EQUIPMENT_REQUEST]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
