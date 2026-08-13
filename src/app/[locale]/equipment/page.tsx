import { db } from "@/lib/db";
import { auth } from "@/auth";
import { EquipmentClient } from "@/components/equipment/equipment-client";

export default async function EquipmentPage() {
  const session = await auth();

  const equipment = await db.equipment.findMany({
    orderBy: { createdAt: "desc" },
  });

  let myTeam: { id: string; status: string } | null = null;
  let myTeamRequests: {
    id: string;
    equipmentId: string;
    quantity: number;
    status: string;
  }[] = [];

  if (session?.user?.id) {
    const team = await db.team.findFirst({
      where: { leaderId: session.user.id },
      select: { id: true, status: true },
    });
    myTeam = team;

    if (team) {
      const requests = await db.equipmentRequest.findMany({
        where: { teamId: team.id, status: { in: ["PENDING", "APPROVED"] } },
      });
      myTeamRequests = requests.map((r) => ({
        id: r.id,
        equipmentId: r.equipmentId,
        quantity: r.quantity,
        status: r.status,
      }));
    }
  }

  return (
    <EquipmentClient
      equipment={equipment}
      isLeader={!!myTeam}
      teamStatus={myTeam?.status || null}
      myTeamRequests={myTeamRequests}
    />
  );
}
