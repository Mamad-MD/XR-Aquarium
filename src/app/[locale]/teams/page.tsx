import { db } from "@/lib/db";
import { auth } from "@/auth";
import { TeamsClient } from "@/components/teams/teams-client";

export default async function TeamsPage() {
  const session = await auth();

  const teams = await db.team.findMany({
    include: {
      leader: true,
      members: { include: { user: true } },
      joinRequests: {
        where: { status: "PENDING" },
        include: { user: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  let myTeamId: string | null = null;
  if (session?.user?.id) {
    const membership = await db.teamMember.findFirst({
      where: { userId: session.user.id },
      select: { teamId: true },
    });
    myTeamId = membership?.teamId || null;
  }

  const safeTeams = teams.map((team) => ({
    ...team,
    createdAt: team.createdAt.toISOString(),
    updatedAt: team.updatedAt.toISOString(),
    members: team.members.map((m) => ({
      ...m,
      joinedAt: m.joinedAt.toISOString(),
    })),
    joinRequests: team.joinRequests.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      reviewedAt: r.reviewedAt ? r.reviewedAt.toISOString() : null,
    })),
  }));

  return (
    <TeamsClient
      initialTeams={safeTeams}
      currentUserId={session?.user?.id || null}
      currentTeamId={myTeamId}
    />
  );
}
