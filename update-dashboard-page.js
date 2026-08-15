const fs = require('fs');

const origPath = 'D:/XR-Aqurium/src/app/[locale]/dashboard/page.tsx.old'; // from earlier
const v4Path = 'D:/XR-Aqurium/src/app/[locale]/dashboard/page.tsx.v4';
const destPath = 'D:/XR-Aqurium/src/app/[locale]/dashboard/page.tsx';

let v4 = fs.readFileSync(v4Path, 'utf8');

// I will now use regex to replace specific areas of V4 to bring back the original behaviors

// 1. Restore the ban check
const banCheck = `
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
`;

v4 = v4.replace('  const announcements = await db.announcement.findMany({', banCheck + '\n  const announcements = await db.announcement.findMany({');

// 2. Admin modifications
v4 = v4.replace('const allUsers = await db.user.findMany({', 'const students = await db.user.findMany({ orderBy: { createdAt: "desc" } });\n    const allUsers = await db.user.findMany({');
v4 = v4.replace('applications,', 'applications,\n            students,');

// 3. Mentor modifications
v4 = v4.replace('tasks: { orderBy: { createdAt: \'asc\' } },', 'steps: { orderBy: { order: "asc" } },\n        tasks: { orderBy: { createdAt: \'asc\' } },');
v4 = v4.replace('include: { team: { include: { members: { include: { user: true } } } } },', 'include: { team: { include: { members: { include: { user: { select: { name: true, nameFa: true } } } }, equipmentRequests: { where: { status: "APPROVED" }, include: { equipment: { select: { name: true, nameFa: true } } } } } } },');
v4 = v4.replace('titleFa: p.titleFa,', 'titleFa: p.titleFa,\n      description: p.description,\n      category: p.category,\n      difficulty: p.difficulty,\n      duration: p.duration,\n      availabilityDays: p.availabilityDays,\n      availabilityHours: p.availabilityHours,');
v4 = v4.replace('tasks: p.tasks.map', 'steps: p.steps.map((s) => ({ id: s.id, title: s.title, titleFa: s.titleFa, deadline: s.deadline ? s.deadline.toISOString() : null, status: s.status, order: s.order })),\n      teams: p.applications.filter((a) => a.team).map((a) => ({ id: a.team.id, name: a.team.name, nameFa: a.team.nameFa, members: a.team.members.map((m) => ({ id: m.id, user: { name: m.user.name, nameFa: m.user.nameFa } })), equipment: a.team.equipmentRequests.map((eq) => ({ id: eq.id, quantity: eq.quantity, equipment: { name: eq.equipment.name, nameFa: eq.equipment.nameFa } })) })),\n      tasks: p.tasks.map');
v4 = v4.replace('data={{ projects }}', 'data={{ projects, telegramUsername: dbUser.telegramUsername }}');

// 4. Student modifications
v4 = v4.replace('projectApplications: { include: { project: true } },', 'projectApplications: { include: { project: { include: { mentor: { select: { name: true, nameFa: true, telegramUsername: true } } } } } },');
v4 = v4.replace('include: { project: true },', 'include: { project: { include: { mentor: { select: { name: true, nameFa: true, telegramUsername: true } } } } },');
v4 = v4.replace('const safeData = {', 'const safeData = {\n    id: dbUser.id,\n    createdAt: dbUser.createdAt.toISOString(),\n    updatedAt: dbUser.updatedAt.toISOString(),\n    paymentConfirmed: dbUser.paymentConfirmed,');


fs.writeFileSync(destPath, v4);
