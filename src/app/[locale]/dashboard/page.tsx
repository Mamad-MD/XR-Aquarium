import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { getLocale } from "next-intl/server";

export default async function DashboardPage() {
  const session = await auth();
  const locale = await getLocale();

  // ۱. بررسی لاگین بودن کاربر
  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  // ۲. 🔥 راه‌حل قطعی: خواندن مستقیم و لحظه‌ای اطلاعات کاربر از دیتابیس
  const dbUser = await db.user.findUnique({
    where: { email: session.user.email }
  });

  // اگر کاربری در دیتابیس پیدا نشد
  if (!dbUser) {
    redirect("/auth/login");
  }

  const announcements = await db.announcement.findMany({
    take: 10,
  });

  // ۳. بررسی نقش مستقیماً از روی دیتابیس (کاملاً امن و بدون باگ کش)
  if (dbUser.role === "ADMIN" || dbUser.role === "admin") {
    const studentsCount = await db.user.count({ where: { role: "PARTICIPANT" } });
    const mentorsCount = await db.user.count({ where: { role: "MENTOR" } });
    const projectsCount = await db.project.count();
    const allStudents = await db.user.findMany({ where: { role: "PARTICIPANT" } });
    const allProjects = await db.project.findMany({ include: { mentor: true } });

    const applications = await db.projectApplication.findMany({
      include: { user: true, project: true },
      orderBy: { appliedAt: 'desc' }
    });

    const safeAnnouncements = announcements.map(a => ({
      ...a,
      createdAt: new Date().toISOString()
    }));

    return (
      <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className={`w-full flex-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
        <AdminDashboard
          user={{ ...session.user, name: dbUser.name }}
          data={{
            studentsCount,
            mentorsCount,
            projectsCount,
            announcements: safeAnnouncements,
            applications,
            students: allStudents,
            projects: allProjects,
          }}
        />
      </div>
    );
  }

  // ۴. در غیر این صورت، بارگذاری اطلاعات برای داشبورد دانشجو
  const userWithData = await db.user.findUnique({
    where: { id: dbUser.id },
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
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className={`w-full flex-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
      <StudentDashboard user={session.user} data={safeData} />
    </div>
  );
}
