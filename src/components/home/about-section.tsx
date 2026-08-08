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
      description: t('timeline.w2.desc'),
      icon: Code,
    },
    {
      week: t('timeline.w3.week'),
      title: t('timeline.w3.title'),
      description: t('timeline.w3.desc'),
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
      description: t('timeline.w5.desc'),
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
            {t('description')}
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-8 md:p-12 border-gradient">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute start-[27px] md:start-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent -translate-x-1/2 rounded-full hidden md:block" />
            <div className="absolute start-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent rounded-full md:hidden" />

            <div className="space-y-12">
              {timelineItems.map((item, index) => {
                const isEven = index % 2 === 0;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex items-start md:items-center ${
                      isEven ? "md:flex-row-reverse" : "md:flex-row"
                    } flex-row`}
                  >
                    {/* Timeline Node Content */}
                    <div className={`w-full md:w-1/2 ps-16 md:ps-0 ${isEven ? "md:pe-16 text-start md:text-end" : "md:ps-16 text-start"}`}>
                      <div className="glass p-6 rounded-2xl hover:neon-cyan transition-all duration-300">
                        <span className="text-cyan-400 font-mono text-sm tracking-wider font-semibold mb-2 block">
                          {item.week}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Glowing Dot & Icon */}
                    <div className="absolute start-0 md:start-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full glass-strong border border-cyan-500/30 neon-cyan bg-background z-10 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                      <item.icon className="w-6 h-6 text-cyan-400" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}