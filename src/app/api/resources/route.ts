import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ message: "برای این کار باید وارد حساب کاربری خود شوید" }, { status: 401 });
    }

    const { resourceId } = await req.json();
    if (!resourceId) {
      return NextResponse.json({ message: "شناسه فایل الزامی است" }, { status: 400 });
    }

    const resource = await db.resource.findUnique({ where: { id: resourceId } });
    if (!resource) {
      return NextResponse.json({ message: "فایل مورد نظر یافت نشد" }, { status: 404 });
    }

    const isAdmin = session.user.role === "ADMIN";
    const isUploader = resource.uploadedById === session.user.id;

    if (!isAdmin && !isUploader) {
      return NextResponse.json({ message: "شما اجازه حذف این فایل را ندارید" }, { status: 403 });
    }

    await db.resource.delete({ where: { id: resourceId } });

    // تلاش برای حذف فایل فیزیکی از دیسک (اگر داخل پوشه uploads بود)
    if (resource.url.startsWith("/uploads/")) {
      try {
        await unlink(path.join(process.cwd(), "public", resource.url));
      } catch {
        // اگر فایل فیزیکی از قبل موجود نبود، مشکلی نیست
      }
    }

    return NextResponse.json({ message: "فایل با موفقیت حذف شد" }, { status: 200 });
  } catch (error) {
    console.error("[RESOURCE_DELETE]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}
