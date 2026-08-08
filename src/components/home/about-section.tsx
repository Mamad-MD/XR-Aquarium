"use client";

import { motion } from "framer-motion";
import { Calendar, Code, TestTube, Trophy, Users } from "lucide-react";

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
            About the Aquarium
          </h2>
          <p className="text-gray-400 max-w-3xl mx-auto text-lg leading-relaxed">
            The XR Lab Aquarium is an intensive, hands-on incubator for spatial computing talent.
            Over the course of two months, participants are immersed in a high-pressure, high-support
            environment to build functional XR prototypes that solve real-world problems.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto glass-strong rounded-3xl p-8 md:p-12 border-gradient">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-[27px] md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent -translate-x-1/2 rounded-full hidden md:block" />
            <div className="absolute left-[27px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-cyan-500/50 via-purple-500/50 to-transparent rounded-full md:hidden" />

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
                    <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? "md:pr-16 text-left md:text-right" : "md:pl-16 text-left"}`}>
                      <div className="glass p-6 rounded-2xl hover:neon-cyan transition-all duration-300">
                        <span className="text-cyan-400 font-mono text-sm tracking-wider font-semibold mb-2 block">
                          {item.week}
                        </span>
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </div>

                    {/* Glowing Dot & Icon */}
                    <div className="absolute left-0 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full glass-strong border border-cyan-500/30 neon-cyan bg-background z-10 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
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