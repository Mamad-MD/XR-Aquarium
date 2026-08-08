"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight, Boxes, Clock, Sparkles, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as any },
  },
};



export function HeroSection() {
  const t = useTranslations('Hero');

  const stats = [
    { icon: Boxes, value: "20+", label: t('stats.projects') },
    { icon: Users, value: "50", label: t('stats.students') },
    { icon: Users, value: "5", label: t('stats.mentors') },
    { icon: Clock, value: "2", label: t('stats.duration') },
  ];
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-10">
      {/* Background decorations */}
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse-glow pointer-events-none" style={{ animationDelay: "1.5s" }} />

      {/* Abstract Orbs */}
      <div className="absolute top-1/3 end-1/4 w-32 h-32 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 blur-xl opacity-50 animate-float pointer-events-none" />
      <div className="absolute bottom-1/3 start-1/4 w-24 h-24 rounded-full bg-gradient-to-bl from-purple-500 to-violet-500 blur-xl opacity-50 animate-float pointer-events-none" style={{ animationDelay: "2s", animationDuration: "8s" }} />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-4xl mx-auto text-center flex flex-col items-center"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border-cyan-500/30 text-cyan-400 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>{t('badge')}</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-4 tracking-tight">
            <span className="gradient-text neon-text-cyan block pb-2">{t('title')}</span>
          </motion.h1>

          <motion.h2 variants={itemVariants} className="text-2xl md:text-4xl font-medium text-gray-300 mb-6 font-sans" dir="rtl">
            {t('subtitle')}
          </motion.h2>

          <motion.p variants={itemVariants} className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            {t('description')}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-20 w-full justify-center">
            <Button asChild size="lg" className="neon-cyan px-8 py-6 text-lg">
              <Link href="/projects">
                {t('exploreProjects')}
                <ArrowRight className="ms-2 w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="px-8 py-6 text-lg glass-strong border-white/20">
              <Link href="/auth/register">
                {t('joinCohort')}
              </Link>
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-xl p-6 flex flex-col items-center justify-center border-t-white/10 border-b-transparent border-s-transparent border-e-transparent shadow-lg transition-transform hover:-translate-y-1 hover:neon-purple">
                <stat.icon className="w-8 h-8 text-cyan-400 mb-3" />
                <span className="text-2xl font-bold text-white mb-1">{stat.value}</span>
                <span className="text-sm text-gray-400 uppercase tracking-wider block text-center">{stat.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}