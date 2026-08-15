"use client"

import {
  Card, CardContent, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Boxes, Settings, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { ChangePasswordForm } from "./change-password-form";
import { MentorProjectCard, type MentorProjectData } from "./mentor-project-card";

interface MentorDashboardProps {
  user: { name?: string | null; image?: string | null; id?: string | null };
  data: {
    projects: MentorProjectData[];
  telegramUsername?: string | null;
  };
}

export function MentorDashboard({ user, data }: MentorDashboardProps) {
  const t = useTranslations("Mentor");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const isFa = locale === "fa";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (!user) return null;

  const projects = data?.projects || [];
  const totalTeamsAssigned = projects.filter((p) => p.assignedTeam).length;
  const pendingApprovals = projects.reduce(
    (acc, p) => acc + p.tasks.filter((tsk) => tsk.status === "DONE").length,
    0
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white p-4 md:p-6 gap-6 pt-24 w-full">
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 glass rounded-xl p-6 flex flex-col gap-8 h-fit sticky top-24 border-cyan-500/20"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-20"></div>
            <Avatar className="w-24 h-24 border-2 border-cyan-500/50">
              <AvatarImage src={user.image || undefined} alt={user.name || "Mentor"} />
              <AvatarFallback className="bg-slate-800 text-cyan-400 text-2xl">
                {user.name ? user.name.charAt(0) : "M"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {isFa ? "منتور" : "MENTOR"}
            </div>
          </div>
        </div>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 max-w-6xl w-full min-w-0"
      >
        <Tabs defaultValue="projects" className="w-full" dir={isFa ? "rtl" : "ltr"}>
          <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-flex bg-slate-900/50 border border-slate-800 p-1 mb-8 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <LayoutDashboard className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("overview")}</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Boxes className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("myProjects")}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Settings className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{tCommon("settings")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {isFa ? `${user.name?.split(" ")[0] || "منتور"} عزیز، خوش‌آمدید` : `Welcome, ${user.name?.split(" ")[0] || "Mentor"}`}
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Boxes className="w-4 h-4" /> {t("myProjects")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white" dir="ltr">{projects.length}</div>
                  </CardContent>
                </Card>
                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Users className="w-4 h-4" /> {t("teamsAssigned")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white" dir="ltr">{totalTeamsAssigned}</div>
                  </CardContent>
                </Card>
                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">{t("pendingApprovals")}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-yellow-400" dir="ltr">{pendingApprovals}</div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="projects">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
              {projects.length === 0 ? (
                <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-slate-800">
                  <Boxes className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">{t("noProjectsYet")}</h3>
                </div>
              ) : (
                projects.map((project) => (
                  <MentorProjectCard key={project.id} project={project} currentUserId={user.id || ""} />
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-slate-800">
                <CardHeader>
                  <CardTitle>{isFa ? "تغییر رمز عبور" : "Change Password"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
}
