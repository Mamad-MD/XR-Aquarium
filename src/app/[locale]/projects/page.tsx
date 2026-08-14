// DESTINATION: src/app/[locale]/projects/page.tsx (replace the whole file)
import { db } from "@/lib/db";
import { ProjectsClient } from "@/components/projects/projects-client";

export default async function ProjectsPage() {
  const projects = await db.project.findMany({
    include: {
      mentor: true,
      steps: { orderBy: { order: "asc" } },
      applications: {
        where: { status: "ACCEPTED" },
        include: { team: { select: { id: true, name: true, nameFa: true } } },
        take: 1,
      },
    },
  });

  // هر پروژه حداکثر یک درخواست پذیرفته‌شده دارد (چون هر پروژه فقط به یک تیم اختصاص می‌یابد)
  // توجه: فیلد deadline در steps از نوع Date است و باید قبل از عبور به کامپوننت کلاینتی
  // به رشته تبدیل شود، وگرنه Next.js هنگام سریالایز کردن props خطا می‌دهد.
  const projectsWithTeam = projects.map(({ applications, steps, ...project }) => ({
    ...project,
    steps: steps.map((s) => ({
      ...s,
      deadline: s.deadline ? s.deadline.toISOString() : null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    assignedTeam: applications[0]?.team || null,
  }));

  return <ProjectsClient initialProjects={projectsWithTeam} />;
}
