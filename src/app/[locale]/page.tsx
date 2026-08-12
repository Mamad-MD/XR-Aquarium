import { HeroSection } from "@/components/home/hero-section";
import { AboutSection } from "@/components/home/about-section";
import { TeamSection } from "@/components/home/team-section";
import { ScheduleSection } from "@/components/home/schedule-section";
import { CTASection } from "@/components/home/cta-section";
import { db } from "@/lib/db";

export default async function Home() {
  const scheduleItems = await db.scheduleEvent.findMany({
    orderBy: { date: 'asc' },
  });

  const teamMembers = await db.user.findMany({
    where: {
      isVisible: true,
      role: {
        in: [
          "MENTOR",
          "EXECUTIVE",
          "Technical Lead, Mentor & XR Core Team Member",
          "Deputy Event Secretary & XR Core Team Member",
          "Event Secretary & XR Core Team Member"
        ]
      }
    },
  });

  return (
    <main className="flex min-h-screen flex-col">
      <HeroSection />
      <AboutSection />
      <TeamSection team={teamMembers} />
      <ScheduleSection scheduleItems={scheduleItems} />
      <CTASection />
    </main>
  );
}
