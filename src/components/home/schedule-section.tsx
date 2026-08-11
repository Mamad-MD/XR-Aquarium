"use client";

import { motion } from "framer-motion";
import { AlertCircle, CalendarClock, Flag, MonitorPlay, Users } from "lucide-react";
import { ScheduleEvent } from "@prisma/client";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations('Schedule');
  const locale = useLocale();

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
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {t('description')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-5xl mx-auto relative"
        >
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-0.5 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent -translate-x-1/2 z-0" />

          <div className="flex flex-col gap-8 relative z-10">
            {scheduleItems.map((item, index) => {
              const config = getTypeConfig(item.type);
              const Icon = config.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className={`flex flex-col md:flex-row items-center justify-between w-full gap-4 md:gap-8 ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Content Box (Half Width on Desktop) */}
                  <div className={`w-full md:w-5/12 ${isEven ? 'md:text-right' : 'md:text-left'} text-start`}>
                    <div className={`glass rounded-xl p-8 transition-all duration-300 hover:scale-[1.02] border-t-4 md:border-t-0 md:border-s-4 ${config.border.replace('border-', 'border-t-').replace('border-', 'border-s-')} relative group bg-gradient-to-b from-white/[0.02] to-transparent`} dir={locale === 'fa' ? 'rtl' : 'ltr'}>

                      {/* Connection Line to Center (Desktop only) */}
                      <div className={`hidden md:block absolute top-1/2 w-8 h-[2px] bg-gradient-to-r from-transparent to-${config.border.split('-')[1]}-500/50 -translate-y-1/2 ${
                        isEven ? 'left-0 -translate-x-full bg-gradient-to-l' : 'right-0 translate-x-full'
                      } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                      <div className="flex flex-col gap-5">
                        {/* Header: Date and Icon */}
                        <div className={`flex items-center gap-4 ${isEven && locale === 'ltr' ? 'md:flex-row-reverse' : ''} ${!isEven && locale === 'fa' ? 'md:flex-row-reverse' : ''}`}>
                          <div className={`p-4 rounded-xl ${config.bg} ${config.color} shrink-0 shadow-lg`}>
                            <Icon className="w-7 h-7" />
                          </div>
                          <div className={`flex flex-col ${isEven && locale === 'ltr' ? 'md:items-end' : ''} ${!isEven && locale === 'fa' ? 'md:items-end' : ''}`}>
                            <span className="text-white font-bold text-xl flex items-center justify-center">
                              {locale === 'fa' ? (
                                <span className="font-sans tracking-tight" dir="rtl">
                                  {new Date(item.date).toLocaleDateString('fa-IR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                </span>
                              ) : (
                                <span className="font-mono tracking-wider" dir="ltr">
                                  {new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                </span>
                              )}
                            </span>
                            <span className={`text-gray-400 text-sm flex items-center gap-2 mt-1 font-sans ${isEven && locale === 'ltr' ? 'md:flex-row-reverse' : ''} ${!isEven && locale === 'fa' ? 'md:flex-row-reverse' : ''}`}>
                              <CalendarClock className="w-4 h-4" />
                              {locale === 'fa' ? (
                                <span className="inline-block mt-0.5" dir="rtl">
                                  {new Date(item.date).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }).replace('ق.ظ', '').replace('ب.ظ', '').trim()}
                                </span>
                              ) : (
                                <span dir="ltr" className="inline-block mt-0.5">
                                  {new Date(item.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Body: Details */}
                        <div className={`flex-grow flex flex-col ${isEven && locale === 'ltr' ? 'md:items-end text-right' : ''} ${!isEven && locale === 'fa' ? 'md:items-end text-right' : ''}`}>
                          <div className={`flex flex-wrap items-center gap-3 mb-3 ${isEven && locale === 'ltr' ? 'justify-end' : ''} ${!isEven && locale === 'fa' ? 'justify-end' : ''}`}>
                            <h3 className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors">{locale === 'fa' && (item as any).titleFa ? (item as any).titleFa : item.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${config.bg} ${config.color} border ${config.border}`}>
                              {locale === 'fa' ? t(item.type.toLowerCase() as any) : item.type.charAt(0).toUpperCase() + item.type.slice(1).toLowerCase()}
                            </span>
                          </div>
                          <p className="text-gray-400 text-base leading-relaxed">
                            {locale === 'fa' && (item as any).descriptionFa ? (item as any).descriptionFa : item.description}
                          </p>
                          {item.location && (
                            <div className={`mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/5 text-cyan-400 text-sm font-medium w-max ${isEven && locale === 'ltr' ? 'ml-auto' : ''} ${!isEven && locale === 'fa' ? 'mr-auto' : ''}`}>
                              <span>📍</span>
                              {locale === 'fa' && (item as any).locationFa ? (item as any).locationFa : item.location}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center Node (Desktop only) */}
                  <div className="hidden md:flex flex-col items-center justify-center w-2/12 z-10">
                    <div className={`w-12 h-12 rounded-full ${config.bg} border-2 ${config.border} flex items-center justify-center shadow-[0_0_15px_rgba(var(--color-${config.color.split('-')[1]}),0.3)] transition-transform duration-300 hover:scale-125 hover:shadow-[0_0_25px_rgba(var(--color-${config.color.split('-')[1]}),0.5)]`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                  </div>

                  {/* Empty space for the other half (Desktop only) */}
                  <div className="hidden md:block w-5/12"></div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}