import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { getLocale } from "next-intl/server"; // ایمپورت برای سمت سرور

export default async function DashboardPage() {
  const session = await auth();
  const locale = await getLocale(); // دریافت زبان در سرور

  if (!session?.user) {
    redirect("/auth/login");
  }

  const announcements = await db.announcement.findMany({
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

    const safeAnnouncements = announcements.map(a => ({
      ...a,
      createdAt: new Date().toISOString()
    }));

    return (
      // تنظیم جهت و تراز متن بر اساس زبان
      <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className={`w-full flex-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
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
      </div>
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
    createdAt: new Date().toISOString()
  }));

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

  return (
    // تنظیم جهت و تراز متن بر اساس زبان
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className={`w-full flex-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
      <StudentDashboard user={session.user} data={safeData} />
    </div>
  );
}
