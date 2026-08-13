import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ team: null }, { status: 200 });
    }

    const team = await db.team.findFirst({
      where: { leaderId: session.user.id },
      select: { id: true, name: true, status: true },
    });

    return NextResponse.json({ team: team || null }, { status: 200 });
  } catch (error) {
    console.error("[MY_LEADER_TEAM]", error);
    return NextResponse.json({ team: null }, { status: 200 });
  }
}
