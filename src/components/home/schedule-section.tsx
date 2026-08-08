"use client";

import { motion } from "framer-motion";
import { AlertCircle, CalendarClock, Flag, MonitorPlay, Users } from "lucide-react";
import { ScheduleEvent } from "@prisma/client";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4 },
  },
};

const getTypeConfig = (type: string) => {
  switch (type.toLowerCase()) {
    case 'workshop':
      return { icon: MonitorPlay, color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' };
    case 'deadline':
      return { icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30' };
    case 'presentation':
      return { icon: Flag, color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' };
    case 'meeting':
      return { icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30' };
    case 'event':
    default:
      return { icon: CalendarClock, color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30' };
  }
};

export function ScheduleSection({ scheduleItems }: { scheduleItems: ScheduleEvent[] }) {
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
            Schedule & Guidelines
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Key milestones and mandatory events for the cohort.
            All times are in local time (IRST).
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-5xl mx-auto flex flex-col gap-4"
        >
          {scheduleItems.map((item) => {
            const config = getTypeConfig(item.type);
            const Icon = config.icon;

            return (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className={`glass rounded-xl p-6 transition-all duration-300 hover:scale-[1.01] border-s-4 ${config.border.replace('border-', 'border-l-')}`}
              >
                <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                  {/* Date/Time Block */}
                  <div className="min-w-[180px] flex flex-col">
                    <span className="text-white font-bold text-lg">{new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    <span className="text-gray-400 text-sm flex items-center gap-2 mt-1">
                      <CalendarClock className="w-4 h-4" />
                      {new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {/* Icon & Details */}
                  <div className="flex-grow flex gap-4 items-start">
                    <div className={`p-3 rounded-lg ${config.bg} ${config.color} shrink-0`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-grow">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{item.title}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider ${config.bg} ${config.color} border ${config.border}`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                      {item.location && (
                        <p className="text-cyan-500/80 text-xs mt-2 font-medium">📍 {item.location}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}