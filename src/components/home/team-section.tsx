"use client";

import { motion } from "framer-motion";
import { Link as LinkIcon } from "lucide-react";
import Image from "next/image";
import { User } from "@prisma/client";

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

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function TeamSection({ team }: { team: User[] }) {
  const t = useTranslations('Team');
  const locale = useLocale();

  if (!team || team.length === 0) {
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden bg-gradient-to-b from-background via-purple-900/10 to-background">
      {/* Background elements */}
      <div className="absolute top-0 end-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

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
            {t('subtitle')}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto"
        >
          {team.map((member) => (
            <motion.div
              key={member.id}
              variants={cardVariants}
              className="group glass rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:scale-[1.02] hover:neon-purple hover:bg-white/[0.05]"
            >
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-transparent group-hover:border-cyan-400 group-hover:neon-cyan transition-all duration-300 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 p-1">
                  <div className="w-full h-full rounded-full overflow-hidden bg-background">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={member.image || "https://i.pravatar.cc/150"}
                      alt={member.name || "Member"}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
                {locale === 'fa' && (member as any).nameFa ? (member as any).nameFa : member.name}
              </h3>

              <div className="h-px w-12 bg-gradient-to-r from-transparent via-purple-500 to-transparent my-3 opacity-50" />

              <p className="text-cyan-400 text-sm font-medium mb-1">
                {locale === 'fa' && (member as any).roleFa ? (member as any).roleFa : member.role}
              </p>

              <div className="flex gap-4 mt-auto">
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}