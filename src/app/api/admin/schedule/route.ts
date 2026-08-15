import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { title, titleFa, type, date, location, locationFa, description, descriptionFa } = await req.json();

    if (!title || !type || !date) {
      return NextResponse.json({ message: "عنوان، نوع و تاریخ الزامی هستند" }, { status: 400 });
    }

    const event = await db.scheduleEvent.create({
      data: {
        title: title.trim(),
        titleFa: titleFa?.trim() || null,
        type,
        date: new Date(date),
        location: location?.trim() || null,
        locationFa: locationFa?.trim() || null,
        description: description?.trim() || null,
        descriptionFa: descriptionFa?.trim() || null,
      },
    });

    return NextResponse.json({ message: "رویداد با موفقیت ثبت شد", event }, { status: 201 });
  } catch (error) {
    console.error("[SCHEDULE_CREATE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { id, title, titleFa, type, date, location, locationFa, description, descriptionFa } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "شناسه رویداد الزامی است" }, { status: 400 });
    }

    const event = await db.scheduleEvent.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(titleFa !== undefined && { titleFa: titleFa?.trim() || null }),
        ...(type !== undefined && { type }),
        ...(date !== undefined && { date: new Date(date) }),
        ...(location !== undefined && { location: location?.trim() || null }),
        ...(locationFa !== undefined && { locationFa: locationFa?.trim() || null }),
        ...(description !== undefined && { description: description?.trim() || null }),
        ...(descriptionFa !== undefined && { descriptionFa: descriptionFa?.trim() || null }),
      },
    });

    return NextResponse.json({ message: "رویداد با موفقیت به‌روزرسانی شد", event }, { status: 200 });
  } catch (error) {
    console.error("[SCHEDULE_UPDATE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) {
      return NextResponse.json({ message: "شناسه رویداد الزامی است" }, { status: 400 });
    }

    await db.scheduleEvent.delete({ where: { id } });

    return NextResponse.json({ message: "رویداد حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("[SCHEDULE_DELETE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}
