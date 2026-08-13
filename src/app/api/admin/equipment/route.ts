import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "شما دسترسی این عملیات را ندارید" },
        { status: 403 }
      );
    }

    const { name, nameFa, description, totalQuantity } = await req.json();

    if (!name || !totalQuantity || Number(totalQuantity) <= 0) {
      return NextResponse.json(
        { message: "نام تجهیز و تعداد کل الزامی است" },
        { status: 400 }
      );
    }

    const equipment = await db.equipment.create({
      data: {
        name: name.trim(),
        nameFa: nameFa?.trim() || null,
        description: description?.trim() || null,
        totalQuantity: Number(totalQuantity),
        availableQuantity: Number(totalQuantity),
      },
    });

    return NextResponse.json(
      { message: "تجهیز با موفقیت به انبار اضافه شد", equipment },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN_EQUIPMENT_CREATE]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
