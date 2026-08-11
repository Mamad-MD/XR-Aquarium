"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  const t = useTranslations('CTA');
  return (
    <section className="py-32 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-cyan-900/10 to-background" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto glass-strong rounded-[2.5rem] p-10 md:p-16 text-center border-gradient relative overflow-hidden"
        >
          {/* Decorative grid pattern inside the card */}
          <div className="absolute inset-0 grid-pattern opacity-20 pointer-events-none" />

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center p-4 rounded-full bg-cyan-500/10 text-cyan-400 mb-8 border border-cyan-500/20 neon-cyan"
            >
              <Terminal className="w-8 h-8" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-6xl font-bold mb-4 text-white"
            >
              {t('title')}
            </motion.h2>

            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-medium text-cyan-400 mb-6 font-sans"
            >
              {t('subtitle')}
            </motion.h3>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto"
            >
              {t.rich('description', { ltr: (chunks) => <span dir="ltr">{chunks}</span> })}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="neon-purple bg-gradient-to-r from-purple-600 to-cyan-600 border-none px-10 py-6 text-lg hover:from-purple-500 hover:to-cyan-500">
                <Link href="/auth/register">
                  {t('applyNow')}
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="px-10 py-6 text-lg bg-background/50 backdrop-blur-sm border-white/20 hover:bg-white/10 group flex items-center">
                <Link href="/projects">
                  {t('viewProjects')}
                  <ArrowRight className="ms-2 w-5 h-5 rtl:rotate-180 transition-transform group-hover:rtl:-translate-x-1 group-hover:ltr:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}