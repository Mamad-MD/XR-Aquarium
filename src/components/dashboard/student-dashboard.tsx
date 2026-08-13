"use client"

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, Boxes, Calendar, FileText, Download,
  Bell, Clock, AlertCircle, Settings, UsersRound
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { format } from "date-fns";
import { ChangePasswordForm } from "./change-password-form";
import { MyTeamCard, type MyTeamData } from "./my-team-card";

export function StudentDashboard({ user, data }: {
 user: { name?: string | null, email?: string | null, image?: string | null, id?: string | null }, data: { announcements?: Array<{ id: string, title: string, content: string, priority: string, createdAt: string }>, projectApplications?: Array<{ status: string, project: Record<string, unknown> }>, myTeam?: MyTeamData | null } }) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const isFa = locale === 'fa';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (!user || !data) return null;

  const announcements = data.announcements || [];
  const acceptedApp = data.projectApplications?.find((a: { status: string, project: Record<string, unknown> }) => a.status === 'ACCEPTED');
  const projectApp = acceptedApp || data.projectApplications?.[0];
  const selectedProject = projectApp?.project;
  const myTeam = data.myTeam || null;

  return (
    <div dir={isFa ? 'rtl' : 'ltr'} className="flex flex-col md:flex-row min-h-screen bg-black text-white p-4 md:p-6 gap-6 pt-24 w-full">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 glass rounded-xl p-6 flex flex-col gap-8 h-fit sticky top-24"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-20"></div>
            <Avatar className="w-24 h-24 border-2 border-cyan-500/50">
              <AvatarImage src={user.image || undefined} alt={user.name || "Student"} />
              <AvatarFallback className="bg-slate-800 text-cyan-400 text-2xl">
                {user.name ? user.name.charAt(0) : "S"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{user.name || (isFa ? "دانشجو" : "Student")}</h2>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" dir="ltr">
              ID: {user.email?.split('@')[0] || user.id?.slice(0, 8)}
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 max-w-6xl w-full"
      >
        <Tabs defaultValue="overview" className="w-full" dir={isFa ? 'rtl' : 'ltr'}>
          {/* تعداد ستون‌ها را به 6 تغییر دادیم تا تب تیم هم جا شود */}
          <TabsList className="grid grid-cols-6 w-full md:w-auto md:inline-flex bg-slate-900/50 border border-slate-800 p-1 mb-8 overflow-x-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <LayoutDashboard className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("overview")}</span>
            </TabsTrigger>
            <TabsTrigger value="project" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Boxes className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("myProject")}</span>
            </TabsTrigger>
            <TabsTrigger value="team" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <UsersRound className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("myTeam")}</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Calendar className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("schedule")}</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <FileText className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("downloads")}</span>
            </TabsTrigger>
            {/* اضافه شدن دکمه تنظیمات */}
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Settings className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{tCommon("settings")}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-3 flex items-center flex-wrap gap-2">
                  {isFa ? (
                    <>
                        <span className="gradient-text">{user.name?.split(' ')[0] || 'دانشجو'}</span>
                        <span>عزیز، خوش‌آمدید</span>
                    </>
                  ) : (
                    <>
                        <span>Welcome back,</span>
                        <span className="gradient-text">{user.name?.split(' ')[0] || 'Student'}</span>
                    </>
                  )}
                </h1>
                <p className="text-slate-400">{t("whatsHappening")}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                      {t('status')}
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isFa ? "text-right" : "text-left"}>
                    <div className="text-2xl font-bold text-white">{t('active')}</div>
                    <p className="text-xs text-slate-500 mt-2">{isFa ? 'دوره توسعه XR شماره ۴' : 'XR Development Cohort 4'}</p>
                  </CardContent>
                </Card>

                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 text-start">{t('cohortProgress')}</CardTitle>
                  </CardHeader>
                  <CardContent className="w-full">
                    <div className={`text-2xl font-bold text-white mb-3 ${isFa ? 'text-right' : 'text-left'}`}>
                      {isFa ? 'هفته ۴ از ۱۲' : 'Week 4 of 12'}
                    </div>
                    <Progress value={33} className="h-2 bg-slate-800 w-full" dir={isFa ? 'rtl' : 'ltr'} />
                  </CardContent>
                </Card>

                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> {t('nextDeadline')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={isFa ? "text-right" : "text-left"}>
                    <div className="text-xl font-bold text-white truncate">{isFa ? 'پروپوزال پروژه' : 'Project Proposal'}</div>
                    <p className="text-xs font-medium mt-2 text-cyan-400">{isFa ? '۳ روز دیگر' : 'In 3 days'}</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" /> {t("recentAnnouncements")}
                </h3>
                <ScrollArea className="h-[400px] rounded-xl border border-slate-800 bg-slate-950/50 p-4" dir={isFa ? 'rtl' : 'ltr'}>
                  <div className="flex flex-col gap-4">
                    {announcements.map((announcement: any) => (
                      <motion.div
                        key={announcement.id}
                        variants={itemVariants}
                        className={`p-5 rounded-lg border ${
                          announcement.priority === 'HIGH' || announcement.priority === 'URGENT'
                            ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            : 'glass border-slate-800'
                        }`}
                      >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-3 gap-2">
                          <h4 className={`font-semibold text-lg flex items-center gap-2 ${
                            announcement.priority === 'HIGH' || announcement.priority === 'URGENT' ? 'text-red-400' : 'text-cyan-400'
                          }`}>
                            {(announcement.priority === 'HIGH' || announcement.priority === 'URGENT') && <AlertCircle className="w-5 h-5" />}
                            {isFa && announcement.titleFa ? announcement.titleFa : announcement.title}
                          </h4>
                          <span className="text-xs font-medium px-3 py-1 rounded bg-black/50 text-slate-400 shrink-0" dir="ltr">
                            {announcement.createdAt ? format(new Date(announcement.createdAt), 'yyyy/MM/dd - HH:mm') : ''}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap text-justify">
                          {isFa && announcement.contentFa ? announcement.contentFa : announcement.content}
                        </p>
                      </motion.div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="text-center text-slate-500 py-10">
                        {t("noAnnouncements")}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="project">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {selectedProject ? (
                <Card className="glass-strong border-purple-500/30 overflow-hidden relative">
                  <div className="absolute top-0 end-0 p-32 bg-purple-500/10 blur-3xl -z-10 rounded-full"></div>
                  <CardHeader>
                    <CardTitle className="text-2xl neon-purple" dir="auto">
                      {isFa && (selectedProject as any).titleFa ? String((selectedProject as any).titleFa) : String(selectedProject.title)}
                    </CardTitle>
                    <CardDescription className="text-slate-400 leading-relaxed" dir="auto">
                      {isFa && (selectedProject as any).descriptionFa ? String((selectedProject as any).descriptionFa) : String(selectedProject.description)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-5">
                    <div>
                      <div className="flex justify-between text-sm mb-3">
                        <span className="text-slate-400">{t("projectProgress")}</span>
                        <span className="text-purple-400 font-bold" dir="ltr">0%</span>
                      </div>
                      <Progress value={0} className="h-2 bg-slate-800" dir={isFa ? 'rtl' : 'ltr'} />
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className={`p-4 rounded-lg bg-slate-900/50 border border-slate-800 ${isFa ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm text-slate-400 mb-1">{t('category')}</p>
                        <p className="text-lg font-medium" dir="ltr">{String(selectedProject.category)}</p>
                      </div>
                      <div className={`p-4 rounded-lg bg-slate-900/50 border border-slate-800 ${isFa ? 'text-right' : 'text-left'}`}>
                        <p className="text-sm text-slate-400 mb-1">{t('statusLabel')}</p>
                        <p className="text-lg font-medium text-green-400">
                          {projectApp.status === "ACCEPTED" ? t('activeTeamMember') : t('applicationPending')}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-slate-800/50 pt-6">
                    <Button variant="outline" asChild className="border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300">
                      <Link href={`/projects/${selectedProject.id}`}>{t('viewProjectDetails')}</Link>
                    </Button>
                    {projectApp.status === "ACCEPTED" && (
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                        {t('submitUpdate')}
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ) : (
                <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-slate-800">
                  <Boxes className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{t('noProjectSelected')}</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
                    {t('noProjectDesc')}
                  </p>
                  <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]">
                    <Link href="/projects">{t('browseProjects')}</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="team">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <MyTeamCard team={myTeam} currentUserId={user.id || ""} />
            </motion.div>
          </TabsContent>

          <TabsContent value="schedule">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" /> {t('upcomingSessions')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-s-2 border-slate-800 ms-3 flex flex-col gap-4 pb-4">
                    {[
                      { title: isFa ? "مقدمه‌ای بر رابط کاربری WebXR" : "Intro to WebXR API", date: isFa ? "امروز، ۱۴:۰۰" : "Today, 2:00 PM", type: isFa ? "ارائه" : "Lecture", speaker: "Alex Vance" },
                      { title: isFa ? "آزمایشگاه اصول اولیه Three.js" : "Three.js Fundamentals Lab", date: isFa ? "فردا، ۱۰:۰۰" : "Tomorrow, 10:00 AM", type: isFa ? "آزمایشگاه" : "Lab", speaker: "Sarah Chen" },
                      { title: isFa ? "بررسی پروپوزال پروژه‌ها" : "Project Proposal Review", date: isFa ? "جمعه، ۱۳:۰۰" : "Friday, 1:00 PM", type: isFa ? "ارزیابی" : "Review", speaker: isFa ? "منتورهای دوره" : "Cohort Mentors" }
                    ].map((item, i) => (
                      <div key={i} className={`relative px-6 ${isFa ? 'text-right border-r-2 border-l-0' : 'text-left border-l-2 border-r-0'}`}>
                        <div className={`absolute w-3 h-3 bg-cyan-500 rounded-full top-1.5 shadow-[0_0_8px_rgba(6,182,212,0.8)] ${isFa ? '-right-[7px]' : '-left-[7px]'}`} />
                        <div className="glass p-4 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-semibold text-white text-lg" dir="auto">{item.title}</h4>
                            <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-cyan-400 shrink-0">{item.type}</span>
                          </div>
                          <div className="text-sm text-slate-400 flex items-center gap-4">
                            <span className="flex items-center gap-1 font-medium" dir="ltr"><Clock className="w-3 h-3" /> {item.date}</span>
                            <span>•</span>
                            <span dir="auto">{item.speaker}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="downloads">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: isFa ? "سرفصل‌های دوره نسخه ۱.۲" : "Cohort Syllabus v1.2", size: "2.4 MB", type: "PDF" },
                  { name: isFa ? "قالب پایه پروژه" : "Starter Project Template", size: "15 MB", type: "ZIP" },
                  { name: isFa ? "راهنمای طراحی XR" : "XR Design Guidelines", size: "8.1 MB", type: "PDF" },
                  { name: isFa ? "پکیج یکپارچه‌سازی یونیتی" : "Unity Integration Package", size: "45 MB", type: "UNITYPACKAGE" }
                ].map((file, i) => (
                  <Card key={i} className="glass border-slate-800 hover:border-cyan-500/30 transition-colors group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 transition-colors shrink-0">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div className={isFa ? "text-right" : "text-left"}>
                          <p className="font-medium text-base text-slate-200 mb-1" dir="auto">{file.name}</p>
                          <p className="text-xs text-slate-500 font-sans" dir="ltr">{file.type} • {file.size}</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10">
                        <Download className="w-5 h-5" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>

          {/* تب تنظیمات (محل قرارگیری کامپوننت فرم تغییر رمز) */}
          <TabsContent value="settings">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-slate-800">
                <CardHeader>
                  <CardTitle>{isFa ? "تغییر رمز عبور" : "Change Password"}</CardTitle>
                  <CardDescription>
                    {isFa ? "برای امنیت بیشتر، توصیه می‌شود رمز عبور خود را تغییر دهید." : "For better security, it is recommended to change your password."}
                  </CardDescription>
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
