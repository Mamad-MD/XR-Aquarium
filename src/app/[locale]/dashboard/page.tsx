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

  // اطلاعیه‌ها: جدیدترین‌ها اول
  const announcements = await db.announcement.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });

  // ۳. بررسی نقش مستقیماً از روی دیتابیس (کاملاً امن و بدون باگ کش)
  if (dbUser.role === "ADMIN" || dbUser.role === "admin") {
    const studentsCount = await db.user.count({ where: { role: "PARTICIPANT" } });
    const mentorsCount = await db.user.count({ where: { role: "MENTOR" } });
    const projectsCount = await db.project.count();
    const allStudents = await db.user.findMany({ where: { role: "PARTICIPANT" } });
    const allProjects = await db.project.findMany({ include: { mentor: true } });
    const allMentors = await db.user.findMany({
      where: { role: "MENTOR" },
      select: { id: true, name: true, nameFa: true },
    });

    const applications = await db.projectApplication.findMany({
      include: {
        user: true,
        project: true,
        team: { select: { id: true, name: true, nameFa: true } },
      },
      orderBy: { appliedAt: 'desc' }
    });

    // تیم‌ها برای تب تایید تیم‌ها
    const allTeams = await db.team.findMany({
      include: {
        leader: { select: { name: true, nameFa: true } },
        members: { include: { user: { select: { name: true, nameFa: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // تجهیزات برای تب مدیریت تجهیزات
    const equipmentInventory = await db.equipment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const pendingEquipmentRequests = await db.equipmentRequest.findMany({
      where: { status: 'PENDING' },
      include: {
        equipment: { select: { id: true, name: true, nameFa: true } },
        team: { select: { id: true, name: true, nameFa: true } },
        requestedBy: { select: { name: true, nameFa: true } },
      },
      orderBy: { requestedAt: 'desc' },
    });

    const assignedEquipmentRequests = await db.equipmentRequest.findMany({
      where: { status: 'APPROVED' },
      include: {
        equipment: { select: { id: true, name: true, nameFa: true } },
        team: { select: { id: true, name: true, nameFa: true } },
        requestedBy: { select: { name: true, nameFa: true } },
      },
      orderBy: { reviewedAt: 'desc' },
    });

    const safeAnnouncements = announcements.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
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
            mentors: allMentors,
            teams: allTeams,
            equipmentInventory,
            pendingEquipmentRequests,
            assignedEquipmentRequests,
          }}
        />
      </div>
    );
  }

  // ۴. اطلاعات تیم کاربر (در صورت عضویت) — شامل پروژه‌ی اختصاص‌یافته به تیم، در صورت وجود
  const myTeamMembership = await db.teamMember.findFirst({
    where: { userId: dbUser.id },
    include: {
      team: {
        include: {
          members: { include: { user: true } },
          joinRequests: {
            where: { status: "PENDING" },
            include: { user: true },
          },
          equipmentRequests: {
            where: { status: "APPROVED" },
            include: { equipment: { select: { name: true, nameFa: true } } },
          },
          projectApplications: {
            include: { project: true },
          },
        },
      },
    },
  });

  const myTeam = myTeamMembership
    ? {
        id: myTeamMembership.team.id,
        name: myTeamMembership.team.name,
        nameFa: myTeamMembership.team.nameFa,
        description: myTeamMembership.team.description,
        leaderId: myTeamMembership.team.leaderId,
        status: myTeamMembership.team.status,
        members: myTeamMembership.team.members.map((m) => ({
          id: m.id,
          userId: m.userId,
          user: { name: m.user.name, nameFa: m.user.nameFa },
        })),
        joinRequests: myTeamMembership.team.joinRequests.map((r) => ({
          id: r.id,
          userId: r.userId,
          user: { name: r.user.name, nameFa: r.user.nameFa },
        })),
        assignedEquipment: myTeamMembership.team.equipmentRequests.map((eq) => ({
          id: eq.id,
          quantity: eq.quantity,
          equipment: { name: eq.equipment.name, nameFa: eq.equipment.nameFa },
        })),
      }
    : null;

  // ۵. «پروژه من» باید برای همه‌ی اعضای تیم یکسان باشد، نه فقط سرپرست که واقعاً درخواست را ثبت کرده
  const teamProjectApplications = myTeamMembership
    ? myTeamMembership.team.projectApplications.map((a) => ({
        id: a.id,
        status: a.status,
        appliedAt: a.appliedAt.toISOString(),
        reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
        project: { ...a.project },
      }))
    : [];

  // برای کاربرانی که هنوز تیمی ندارند اما به‌صورت قدیمی درخواست فردی ثبت کرده باشند (سازگاری با داده‌های قبلی)
  const ownApplications = await db.projectApplication.findMany({
    where: { userId: dbUser.id },
    include: { project: true },
  });

  const projectApplications = teamProjectApplications.length > 0
    ? teamProjectApplications
    : ownApplications.map((a) => ({
        id: a.id,
        status: a.status,
        appliedAt: a.appliedAt.toISOString(),
        reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
        project: { ...a.project },
      }));

  const safeAnnouncements = announcements.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  const safeData = {
    id: dbUser.id,
    createdAt: dbUser.createdAt.toISOString(),
    updatedAt: dbUser.updatedAt.toISOString(),
    projectApplications,
    announcements: safeAnnouncements,
    myTeam,
  };

  return (
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className={`w-full flex-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
      <StudentDashboard user={session.user} data={safeData} />
    </div>
  );
}
