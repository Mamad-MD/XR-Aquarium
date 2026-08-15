import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

// حداکثر حجم فایل قابل آپلود: ۵۰ مگابایت
const MAX_FILE_SIZE = 50 * 1024 * 1024;

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "برای این کار باید وارد حساب کاربری خود شوید" }, { status: 401 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isMentor = session.user.role === "MENTOR";

    if (!isAdmin && !isMentor) {
      return NextResponse.json({ message: "فقط مدیر سیستم یا منتور می‌تواند فایل آپلود کند" }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const title = formData.get("title") as string | null;
    const description = formData.get("description") as string | null;
    const projectId = formData.get("projectId") as string | null;

    if (!file) {
      return NextResponse.json({ message: "فایلی ارسال نشده است" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ message: "حجم فایل نباید بیشتر از ۵۰ مگابایت باشد" }, { status: 400 });
    }

    // فایل‌های عمومی (بدون پروژه) فقط توسط ادمین قابل آپلود هستند
    if (!projectId && !isAdmin) {
      return NextResponse.json({ message: "فقط مدیر سیستم می‌تواند فایل عمومی آپلود کند" }, { status: 403 });
    }

    // فایل‌های مخصوص یک پروژه، فقط توسط منتور همان پروژه یا ادمین قابل آپلود هستند
    if (projectId) {
      const project = await db.project.findUnique({ where: { id: projectId } });
      if (!project) {
        return NextResponse.json({ message: "پروژه مورد نظر یافت نشد" }, { status: 404 });
      }
      if (project.mentorId !== session.user.id && !isAdmin) {
        return NextResponse.json({ message: "شما منتور این پروژه نیستید" }, { status: 403 });
      }
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });
    await writeFile(path.join(uploadsDir, uniqueName), buffer);

    const resource = await db.resource.create({
      data: {
        title: title?.trim() || file.name,
        description: description?.trim() || null,
        fileType: file.type || safeName.split(".").pop() || "file",
        fileSize: file.size,
        url: `/uploads/${uniqueName}`,
        uploadedById: session.user.id,
        projectId: projectId || null,
      },
    });

    return NextResponse.json({ message: "فایل با موفقیت آپلود شد", resource }, { status: 201 });
  } catch (error) {
    console.error("[RESOURCE_UPLOAD]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد، لطفاً دوباره تلاش کنید" }, { status: 500 });
  }
}
