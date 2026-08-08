import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  const announcements = await db.announcement.findMany({
    // orderBy: { createdAt: "desc" },  // Removed because createdAt does not exist in Prisma schema for Announcement
    take: 10,
  });

  if (session.user.role === "ADMIN") {
    const studentsCount = await db.user.count({ where: { role: "PARTICIPANT" } });
    const mentorsCount = await db.user.count({ where: { role: "MENTOR" } });
    const projectsCount = await db.project.count();
    const applications = await db.projectApplication.findMany({
      include: { user: true, project: true },
      orderBy: { appliedAt: 'desc' }
    });

    // Use an explicit fallback for createdAt if it doesn't exist, to avoid breaking the UI that expects it
    const safeAnnouncements = announcements.map(a => ({
      ...a,
      createdAt: new Date().toISOString() // Fallback
    }));

    return (
      <AdminDashboard
        user={session.user}
        data={{
          studentsCount,
          mentorsCount,
          projectsCount,
          announcements: safeAnnouncements,
          applications
        }}
      />
    );
  }

  // Student case
  const userWithData = await db.user.findUnique({
    where: { id: session.user.id },
    include: {
      projectApplications: {
        include: {
          project: true,
        },
      },
    },
  });

  const safeAnnouncements = announcements.map(a => ({
    ...a,
    createdAt: new Date().toISOString() // Fallback
  }));

  // Create a safe payload mapping Date objects to strings
  const safeData = {
    ...userWithData,
    createdAt: userWithData?.createdAt.toISOString(),
    updatedAt: userWithData?.updatedAt.toISOString(),
    projectApplications: userWithData?.projectApplications.map(a => ({
      ...a,
      appliedAt: a.appliedAt.toISOString(),
      reviewedAt: a.reviewedAt?.toISOString() || null,
      project: {
        ...a.project,
      }
    })),
    announcements: safeAnnouncements,
  };

  return <StudentDashboard user={session.user} data={safeData} />;
}
