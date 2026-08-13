"use client";

import { motion } from "framer-motion";
import { Calendar, Code, TestTube, Trophy, Users } from "lucide-react";
import { useTranslations } from "next-intl";

const timelineItems = [
  {
    week: "Week 1-2",
    title: "Orientation & Team Formation",
    description: "Get introduced to the lab environment, meet mentors, and form multidisciplinary teams based on project interests.",
    icon: Users,
  },
  {
    week: "Week 3-4",
    title: "Core Training & Workshops",
    description: "Intensive deep dives into Unity/Unreal, spatial design patterns, and platform-specific XR SDKs.",
    icon: Code,
  },
  {
    week: "Week 5-6",
    title: "Project Development",
    description: "Hands-on building phase. Architect and implement the core mechanics of your XR experience.",
    icon: Calendar,
  },
  {
    week: "Week 7-8",
    title: "Testing & Iteration",
    description: "User testing, performance optimization on target hardware, and refining the user experience.",
    icon: TestTube,
  },
  {
    week: "Week 8-9",
    title: "Final Presentations & Demo Day",
    description: "Showcase your polished XR application to industry partners, peers, and sponsors.",
    icon: Trophy,
  },
];

export function AboutSection() {
  const t = useTranslations('About');

  const timelineItems = [
    {
      week: t('timeline.w1.week'),
      title: t('timeline.w1.title'),
      description: t('timeline.w1.desc'),
      icon: Users,
    },
    {
      week: t('timeline.w2.week'),
      title: t('timeline.w2.title'),
      description: t.rich('timeline.w2.desc', { ltr: (chunks) => <span dir="ltr">{chunks}</span> }),
      icon: Code,
    },
    {
      week: t('timeline.w3.week'),
      title: t('timeline.w3.title'),
      description: t.rich('timeline.w3.desc', { ltr: (chunks) => <span dir="ltr">{chunks}</span> }),
      icon: Calendar,
    },
    {
      week: t('timeline.w4.week'),
      title: t('timeline.w4.title'),
      description: t('timeline.w4.desc'),
      icon: TestTube,
    },
    {
      week: t('timeline.w5.week'),
      title: t('timeline.w5.title'),
      description: t.rich('timeline.w5.desc', { ltr: (chunks) => <span dir="ltr">{chunks}</span> }),
      icon: Trophy,
    },
  ];
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text inline-block pb-2">
            {t('title')}
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            {t.rich('description', { ltr: (chunks) => <span dir="ltr">{chunks}</span>, })}
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {timelineItems.map((item, index) => {
              // Create a distinct look by using cards instead of a timeline
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass p-8 rounded-3xl hover:neon-cyan transition-all duration-300 flex flex-col items-start border-t-4 border-t-cyan-500/50 bg-gradient-to-b from-white/[0.03] to-transparent relative group overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-cyan-500/20 transition-all duration-500" />

                  <div className="w-12 h-12 rounded-2xl glass-strong border border-cyan-500/30 flex items-center justify-center mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-6 h-6 text-cyan-400" />
                  </div>

                  <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-bold mb-4 relative z-10">
                    {item.week}
                  </span>

                  <h3 className="text-xl font-bold text-white mb-3 relative z-10">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed relative z-10">{item.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
