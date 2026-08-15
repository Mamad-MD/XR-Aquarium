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

    const {
      title,
      titleFa,
      description,
      category,
      difficulty,
      maxCapacity,
      duration,
      techStack,
      mentorId,
      thumbnailUrl,
      objectives,
      prerequisites,
    } = await req.json();

    if (
      !title ||
      !description ||
      !category ||
      !difficulty ||
      !maxCapacity ||
      !duration ||
      !techStack ||
      !mentorId
    ) {
      return NextResponse.json(
        { message: "لطفاً تمامی فیلدهای الزامی را پر کنید" },
        { status: 400 }
      );
    }

    const mentor = await db.user.findUnique({ where: { id: mentorId } });
    if (!mentor) {
      return NextResponse.json(
        { message: "منتور انتخاب‌شده یافت نشد" },
        { status: 404 }
      );
    }

    const objectivesArray = (objectives || "")
      .split("\n")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const project = await db.project.create({
      data: {
        title: title.trim(),
        titleFa: titleFa?.trim() || null,
        description: description.trim(),
        category,
        difficulty,
        maxCapacity: Number(maxCapacity),
        duration: duration.trim(),
        techStack: techStack.trim(),
        thumbnailUrl: thumbnailUrl?.trim() || null,
        objectives: objectivesArray.length ? JSON.stringify(objectivesArray) : null,
        prerequisites: prerequisites?.trim() || null,
        mentorId,
      },
      include: { mentor: true },
    });

    return NextResponse.json(
      { message: "پروژه با موفقیت ساخته شد", project },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ADMIN_PROJECT_CREATE]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}

// تغییر منتور یک پروژه
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "شما دسترسی این عملیات را ندارید" },
        { status: 403 }
      );
    }

    const { projectId, mentorId } = await req.json();
    if (!projectId || !mentorId) {
      return NextResponse.json(
        { message: "شناسه پروژه و منتور الزامی است" },
        { status: 400 }
      );
    }

    const mentor = await db.user.findUnique({ where: { id: mentorId } });
    if (!mentor || mentor.role !== "MENTOR") {
      return NextResponse.json(
        { message: "کاربر انتخاب‌شده منتور معتبر نیست" },
        { status: 400 }
      );
    }

    const project = await db.project.update({
      where: { id: projectId },
      data: { mentorId },
      include: { mentor: true },
    });

    return NextResponse.json(
      { message: "منتور پروژه با موفقیت تغییر کرد", project },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN_PROJECT_MENTOR_UPDATE]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "شما دسترسی این عملیات را ندارید" },
        { status: 403 }
      );
    }

    const { projectId } = await req.json();
    if (!projectId) {
      return NextResponse.json({ message: "شناسه پروژه الزامی است" }, { status: 400 });
    }

    const project = await db.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return NextResponse.json({ message: "پروژه مورد نظر یافت نشد" }, { status: 404 });
    }

    await db.project.delete({ where: { id: projectId } });

    return NextResponse.json({ message: "پروژه با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("[ADMIN_PROJECT_DELETE]", error);
    return NextResponse.json(
      { message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" },
      { status: 500 }
    );
  }
}
