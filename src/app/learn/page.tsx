import { db } from "@/lib/db";
import { LearnClient } from "@/components/learn/learn-client";

export default async function LearnPage() {
  const courses = await db.course.findMany({
    include: { lessons: true }
  });

  const resources = await db.resource.findMany({
    include: { uploadedBy: true }
  });

  return <LearnClient courses={courses} resources={resources} />;
}
