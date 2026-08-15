import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

async function getOrCreateSettings() {
  let settings = await db.systemSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await db.systemSettings.create({ data: { id: "singleton" } });
  }
  return settings;
}

export async function GET() {
  try {
    const settings = await getOrCreateSettings();
    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error("[SETTINGS_GET]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ message: "شما دسترسی این عملیات را ندارید" }, { status: 403 });
    }

    const body = await req.json();
    const data: Record<string, boolean> = {};

    if (typeof body.studentRegistrationEnabled === "boolean") {
      data.studentRegistrationEnabled = body.studentRegistrationEnabled;
    }
    if (typeof body.projectSelectionEnabled === "boolean") {
      data.projectSelectionEnabled = body.projectSelectionEnabled;
    }
    if (typeof body.maintenanceMode === "boolean") {
      data.maintenanceMode = body.maintenanceMode;
    }

    await getOrCreateSettings();

    const settings = await db.systemSettings.update({
      where: { id: "singleton" },
      data,
    });

    return NextResponse.json({ message: "تنظیمات با موفقیت به‌روزرسانی شد", settings }, { status: 200 });
  } catch (error) {
    console.error("[SETTINGS_PATCH]", error);
    return NextResponse.json({ message: "خطایی در سرور رخ داد" }, { status: 500 });
  }
}
