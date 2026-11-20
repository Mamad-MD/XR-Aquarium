import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";
import { MentorDashboard } from "@/components/dashboard/mentor-dashboard";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { getLocale } from "next-intl/server";

async function getOrCreateSettings() {
  let settings = await db.systemSettings.findUnique({ where: { id: "singleton" } });
  if (!settings) {
    settings = await db.systemSettings.create({ data: { id: "singleton" } });
  }
  return settings;
}

export default async function DashboardPage() {
  const session = await auth();
  const locale = await getLocale();

  if (!session?.user?.email) {
    redirect("/auth/login");
  }

  const dbUser = await db.user.findUnique({
    where: { email: session.user.email }
  });

  if (!dbUser) {
    redirect("/auth/login");
  }


  // ۲.۵ اگر کاربر مسدود شده باشد، اجازه دسترسی به هیچ داشبوردی داده نمی‌شود
  if (dbUser.isBanned) {
    const isFa = locale === "fa";
    return (
      <div
        dir={isFa ? "rtl" : "ltr"}
        className="min-h-screen flex items-center justify-center p-6 pt-24 w-full bg-black"
      >
        <div className="glass border border-red-500/30 rounded-xl p-8 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-400 mb-3">
            {isFa ? "دسترسی شما مسدود شده است" : "Your access has been blocked"}
          </h2>
          <p className="text-slate-400 leading-relaxed">
            {isFa
              ? "حساب کاربری شما توسط مدیر سیستم مسدود شده است. برای اطلاعات بیشتر با پشتیبانی دوره تماس بگیرید."
              : "Your account has been blocked by the system admin. Please contact course support for more information."}
          </p>
        </div>
      </div>
    );
  }

  const announcements = await db.announcement.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
  });
  const safeAnnouncements = announcements.map(a => ({
    ...a,
    createdAt: a.createdAt.toISOString(),
  }));

  // ============ ADMIN ============
  if (dbUser.role === "ADMIN" || dbUser.role === "admin") {
    const studentsCount = await db.user.count({ where: { role: "PARTICIPANT" } });
    const mentorsCount = await db.user.count({ where: { role: "MENTOR" } });
    const projectsCount = await db.project.count();
    const students = await db.user.findMany({ orderBy: { createdAt: "desc" } });
    const allUsers = await db.user.findMany({
      select: { id: true, name: true, email: true, role: true },
      orderBy: { createdAt: 'desc' },
    });
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

    const allTeams = await db.team.findMany({
      include: {
        leader: { select: { name: true, nameFa: true } },
        members: { include: { user: { select: { name: true, nameFa: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const equipmentInventory = await db.equipment.findMany({ orderBy: { createdAt: 'desc' } });

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

    const scheduleEventsRaw = await db.scheduleEvent.findMany({ orderBy: { date: 'asc' } });
    const scheduleEvents = scheduleEventsRaw.map(ev => ({ ...ev, date: ev.date.toISOString() }));

    const generalResourcesRaw = await db.resource.findMany({
      where: { projectId: null, lessonId: null },
      orderBy: { createdAt: 'desc' },
    });
    const generalResources = generalResourcesRaw.map(r => ({
      id: r.id, title: r.title, url: r.url, fileSize: r.fileSize, uploadedById: r.uploadedById,
    }));

    const settings = await getOrCreateSettings();

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
            students,
            users: allUsers,
            projects: allProjects,
            mentors: allMentors,
            teams: allTeams,
            equipmentInventory,
            pendingEquipmentRequests,
            assignedEquipmentRequests,
            scheduleEvents,
            generalResources,
            settings: {
              studentRegistrationEnabled: settings.studentRegistrationEnabled,
              projectSelectionEnabled: settings.projectSelectionEnabled,
              maintenanceMode: settings.maintenanceMode,
            },
          }}
        />
      </div>
    );
  }

  // ============ MENTOR ============
  if (dbUser.role === "MENTOR") {
    const myProjects = await db.project.findMany({
      where: { mentorId: dbUser.id },
      include: {
        steps: { orderBy: { order: "asc" } },
        tasks: { orderBy: { createdAt: 'asc' } },
        resources: { orderBy: { createdAt: 'desc' } },
        updates: { include: { author: true }, orderBy: { createdAt: 'desc' } },
        applications: {
          where: { status: "ACCEPTED" },
          include: { team: { include: { members: { include: { user: { select: { name: true, nameFa: true } } } }, equipmentRequests: { where: { status: "APPROVED" }, include: { equipment: { select: { name: true, nameFa: true } } } } } } },
          take: 1,
        },
      },
    });

    const projects = myProjects.map((p) => ({
      id: p.id,
      title: p.title,
      titleFa: p.titleFa,
      description: p.description,
      category: p.category,
      difficulty: p.difficulty,
      duration: p.duration,
      availabilityDays: p.availabilityDays,
      availabilityHours: p.availabilityHours,
      maxCapacity: p.maxCapacity,
      status: p.status,
      assignedTeam: p.applications[0]?.team
        ? {
            id: p.applications[0].team?.id,
            name: p.applications[0].team?.name,
            nameFa: p.applications[0].team?.nameFa,
            members: (p.applications[0].team?.members || []).map((m) => ({
              user: { name: m.user.name, nameFa: m.user.nameFa },
            })),
          }
        : null,
      steps: p.steps.map((s) => ({ id: s.id, title: s.title, titleFa: s.titleFa, deadline: s.deadline ? s.deadline.toISOString() : null, status: s.status, order: s.order })),
      teams: p.applications.filter((a) => a.team).map((a) => ({ id: a.team!.id, name: a.team!.name, nameFa: a.team!.nameFa, members: a.team!.members.map((m) => ({ id: m.id, user: { name: m.user.name, nameFa: m.user.nameFa } })), equipment: a.team!.equipmentRequests.map((eq) => ({ id: eq.id, quantity: eq.quantity, equipment: { name: eq.equipment.name, nameFa: eq.equipment.nameFa } })) })),
      tasks: p.tasks.map((tsk) => ({
        id: tsk.id,
        title: tsk.title,
        description: tsk.description,
        status: tsk.status,
        createdAt: tsk.createdAt.toISOString(),
        completedAt: tsk.completedAt ? tsk.completedAt.toISOString() : null,
        approvedAt: tsk.approvedAt ? tsk.approvedAt.toISOString() : null,
      })),
      resources: p.resources.map((r) => ({
        id: r.id, title: r.title, url: r.url, fileSize: r.fileSize, createdAt: r.createdAt.toISOString(), uploadedById: r.uploadedById,
      })),
      updates: p.updates.map((u) => ({
        id: u.id,
        content: u.content,
        createdAt: u.createdAt.toISOString(),
        author: { name: u.author.name, nameFa: u.author.nameFa },
      })),
    }));

    return (
      <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className={`w-full flex-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
        <MentorDashboard
          user={{ ...session.user, name: dbUser.name }}
          data={{ projects, telegramUsername: dbUser.telegramUsername }}
        />
      </div>
    );
  }

  // ============ STUDENT / PARTICIPANT ============
  const myTeamMembership = await db.teamMember.findFirst({
    where: { userId: dbUser.id },
    include: {
      team: {
        include: {
          members: { include: { user: true } },
          joinRequests: { where: { status: "PENDING" }, include: { user: true } },
          equipmentRequests: { where: { status: "APPROVED" }, include: { equipment: { select: { name: true, nameFa: true } } } },
          projectApplications: { include: { project: { include: { mentor: { select: { name: true, nameFa: true, telegramUsername: true } } } } } },
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

  const isTeamLeader = myTeamMembership?.team.leaderId === dbUser.id;

  const teamProjectApplications = myTeamMembership
    ? myTeamMembership.team.projectApplications.map((a) => ({
        id: a.id,
        status: a.status,
        appliedAt: a.appliedAt.toISOString(),
        reviewedAt: a.reviewedAt ? a.reviewedAt.toISOString() : null,
        project: { ...a.project },
      }))
    : [];

  const ownApplications = await db.projectApplication.findMany({
    where: { userId: dbUser.id },
    include: { project: { include: { mentor: { select: { name: true, nameFa: true, telegramUsername: true } } } } },
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

  const acceptedProjectId = projectApplications.find((a) => a.status === "ACCEPTED")?.project?.id as string | undefined;

  let projectTasks: { id: string; title: string; description: string | null; status: string }[] = [];
  let projectUpdates: { id: string; content: string; createdAt: string; author: { name: string | null; nameFa: string | null } }[] = [];
  let projectResources: { id: string; title: string; url: string; fileSize: number }[] = [];

  if (acceptedProjectId) {
    const [tasksRaw, updatesRaw, resourcesRaw] = await Promise.all([
      db.projectTask.findMany({ where: { projectId: acceptedProjectId }, orderBy: { createdAt: 'asc' } }),
      db.projectUpdate.findMany({ where: { projectId: acceptedProjectId }, include: { author: true }, orderBy: { createdAt: 'desc' } }),
      db.resource.findMany({ where: { projectId: acceptedProjectId }, orderBy: { createdAt: 'desc' } }),
    ]);

    projectTasks = tasksRaw.map((tsk) => ({ id: tsk.id, title: tsk.title, description: tsk.description, status: tsk.status }));
    projectUpdates = updatesRaw.map((u) => ({
      id: u.id, content: u.content, createdAt: u.createdAt.toISOString(),
      author: { name: u.author.name, nameFa: u.author.nameFa },
    }));
    projectResources = resourcesRaw.map((r) => ({ id: r.id, title: r.title, url: r.url, fileSize: r.fileSize }));
  }

  const generalResourcesRaw = await db.resource.findMany({
    where: { projectId: null, lessonId: null },
    orderBy: { createdAt: 'desc' },
  });
  const generalResources = generalResourcesRaw.map(r => ({ id: r.id, title: r.title, url: r.url, fileSize: r.fileSize }));

  const safeData = {
    id: dbUser.id,
    createdAt: dbUser.createdAt.toISOString(),
    updatedAt: dbUser.updatedAt.toISOString(),
    paymentConfirmed: dbUser.paymentConfirmed,
    projectApplications,
    announcements: safeAnnouncements,
    myTeam,
    isTeamLeader,
    projectTasks,
    projectUpdates,
    projectResources,
    generalResources,
  };

  return (
    <div dir={locale === 'fa' ? 'rtl' : 'ltr'} className={`w-full flex-1 ${locale === 'fa' ? 'text-right' : 'text-left'}`}>
      <StudentDashboard user={session.user} data={safeData} />
    </div>
  );
}
