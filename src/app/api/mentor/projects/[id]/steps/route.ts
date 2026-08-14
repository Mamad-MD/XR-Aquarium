// DESTINATION: src/app/api/mentor/projects/[id]/steps/route.ts (new file)
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getOwnedProject(projectId: string, userId: string, role: string) {
  const project = await db.project.findUnique({ where: { id: projectId } });
  if (!project) return null;
  if (role !== "ADMIN" && project.mentorId !== userId) return null;
  return project;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MENTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { id } = await params;
    const project = await getOwnedProject(id, session.user.id, session.user.role);
    if (!project) {
      return NextResponse.json({ message: "این پروژه به شما اختصاص داده نشده است" }, { status: 403 });
    }

    const { title, titleFa, deadline } = await req.json();
    if (!title || !title.trim()) {
      return NextResponse.json({ message: "عنوان استپ الزامی است" }, { status: 400 });
    }

    const stepCount = await db.projectStep.count({ where: { projectId: id } });

    const step = await db.projectStep.create({
      data: {
        projectId: id,
        title: title.trim(),
        titleFa: titleFa?.trim() || null,
        deadline: deadline ? new Date(deadline) : null,
        order: stepCount,
      },
    });

    return NextResponse.json({ message: "استپ با موفقیت اضافه شد", step }, { status: 201 });
  } catch (error) {
    console.error("[MENTOR_STEPS_CREATE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MENTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { id } = await params;
    const project = await getOwnedProject(id, session.user.id, session.user.role);
    if (!project) {
      return NextResponse.json({ message: "این پروژه به شما اختصاص داده نشده است" }, { status: 403 });
    }

    const { stepId, title, titleFa, deadline, status } = await req.json();
    if (!stepId) {
      return NextResponse.json({ message: "شناسه استپ الزامی است" }, { status: 400 });
    }

    const step = await db.projectStep.update({
      where: { id: stepId },
      data: {
        ...(title !== undefined && { title }),
        ...(titleFa !== undefined && { titleFa }),
        ...(deadline !== undefined && { deadline: deadline ? new Date(deadline) : null }),
        ...(status !== undefined && { status }),
      },
    });

    return NextResponse.json({ message: "استپ با موفقیت بروزرسانی شد", step }, { status: 200 });
  } catch (error) {
    console.error("[MENTOR_STEPS_PATCH]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || (session.user.role !== "MENTOR" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const { id } = await params;
    const project = await getOwnedProject(id, session.user.id, session.user.role);
    if (!project) {
      return NextResponse.json({ message: "این پروژه به شما اختصاص داده نشده است" }, { status: 403 });
    }

    const { stepId } = await req.json();
    if (!stepId) {
      return NextResponse.json({ message: "شناسه استپ الزامی است" }, { status: 400 });
    }

    await db.projectStep.delete({ where: { id: stepId } });

    return NextResponse.json({ message: "استپ حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("[MENTOR_STEPS_DELETE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}
