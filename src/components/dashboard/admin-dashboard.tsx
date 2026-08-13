"use client"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, Users, Boxes, Bell, Settings,
  Search, Plus, Activity, Mail, FileText, Check, X, UsersRound, Package
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChangePasswordForm } from "./change-password-form"; // ایمپورت فرم تغییر رمز
import { CreateProjectDialog } from "./create-project-dialog";
import { AdminTeamsPanel, type AdminTeamData } from "./admin-teams-panel";
import { AdminEquipmentPanel, type AdminEquipmentItem, type AdminEquipmentRequestItem } from "./admin-equipment-panel";

export function AdminDashboard({ user, data }: {
  user: { name?: string | null, image?: string | null, id?: string | null },
  data: {
    studentsCount?: number,
    mentorsCount?: number,
    projectsCount?: number,
    announcements?: Array<{ id: string, title: string, content: string, priority: string, createdAt: string }>,
    applications?: Array<{
      id: string,
      status: string,
      appliedAt: Date | string,
      user: { name: string | null },
      project: { title: string }
    }>,
    students?: Array<any>,
    projects?: Array<any>,
    mentors?: Array<{ id: string, name: string | null, nameFa: string | null }>,
    teams?: AdminTeamData[],
    equipmentInventory?: AdminEquipmentItem[],
    pendingEquipmentRequests?: AdminEquipmentRequestItem[],
    assignedEquipmentRequests?: AdminEquipmentRequestItem[],
  }
}) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const locale = useLocale();
  const isFa = locale === 'fa';
  const router = useRouter();

  const announcements = data?.announcements || [];
  const applications = data?.applications || [];
  const students = data?.students || [];
  const projects = data?.projects || [];
  const mentors = data?.mentors || [];
  const teams = data?.teams || [];
  const equipmentInventory = data?.equipmentInventory || [];
  const pendingEquipmentRequests = data?.pendingEquipmentRequests || [];
  const assignedEquipmentRequests = data?.assignedEquipmentRequests || [];

  const pendingTeamsCount = teams.filter((tm) => tm.status === "PENDING").length;

  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement),
      });
      if (res.ok) {
        setNewAnnouncement({ title: "", content: "", priority: "MEDIUM" });
        toast.success(isFa ? "اطلاعیه با موفقیت ثبت شد." : "Announcement posted successfully.");
        router.refresh();
      }
    } catch (error) {
      toast.error(isFa ? "خطا در ارتباط با سرور." : "Error posting announcement.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (studentId: string) => {
    if (confirm(isFa ? `آیا از ریست کردن رمز عبور مطمئن هستید؟ رمز جدید برابر با شماره دانشجویی خواهد شد.` : `Are you sure you want to reset the password?`)) {
      try {
        const res = await fetch('/api/admin/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: studentId })
        });
        const responseData = await res.json();
        if (res.ok) {
          toast.success(isFa ? `رمز با موفقیت ریست شد. رمز جدید: ${responseData.newPassword}` : `Password reset successfully.`);
        } else {
          toast.error(responseData.error);
        }
      } catch (e) {
        toast.error(isFa ? 'خطا در ارتباط با سرور' : 'Server error');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white p-4 md:p-6 gap-6 pt-24 w-full">
      {/* Admin Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 glass rounded-xl p-6 flex flex-col gap-8 h-fit sticky top-24 border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.1)]"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-20"></div>
            <Avatar className="w-24 h-24 border-2 border-purple-500/50">
              <AvatarImage src={user.image || undefined} alt={user.name || "Admin"} />
              <AvatarFallback className="bg-slate-800 text-purple-400 text-2xl">
                {user.name ? user.name.charAt(0) : "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
              {isFa ? "مدیر سیستم" : "SYSTEM ADMIN"}
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
          <TabsList className="grid grid-cols-8 w-full md:w-auto md:inline-flex bg-slate-900/50 border border-slate-800 p-1 mb-8 overflow-x-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <LayoutDashboard className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("overview")}</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Users className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("users")}</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Boxes className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("activeProjects")}</span>
            </TabsTrigger>
            <TabsTrigger value="teams" className="relative data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <UsersRound className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("teamsTab")}</span>
              {pendingTeamsCount > 0 && (
                <span className="absolute -top-1 -end-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </TabsTrigger>
            <TabsTrigger value="equipment" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Package className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("equipmentTab")}</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Bell className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("recentAnnouncements")}</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <FileText className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("projectApps")}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Settings className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{tCommon("settings")}</span>
            </TabsTrigger>
          </TabsList>

          {/* تب نمای کلی */}
          <TabsContent value="overview">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold tracking-tight mb-4">
                {t("adminOverview")}
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: t("totalStudents"), value: data?.studentsCount || "0", icon: Users, color: "text-blue-400" },
                  { label: t("mentors"), value: data?.mentorsCount || "0", icon: Activity, color: "text-purple-400" },
                  { label: t("projectsOpen"), value: data?.projectsCount || "0", icon: Boxes, color: "text-green-400" },
                  { label: t("activeNow"), value: "0", icon: Activity, color: "text-cyan-400" }
                ].map((stat, i) => (
                  <Card key={i} className="glass border-slate-800">
                    <CardContent className={`p-6 ${isFa ? 'text-right' : 'text-left'}`}>
                      <stat.icon className={`w-8 h-8 mb-4 ${stat.color} opacity-80`} />
                      <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-2 font-sans" dir="ltr">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="glass mt-8 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" /> {t("activity")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    {[
                      { msg: isFa ? "سارا وارد پروژه 'رابط‌های عصبی' شد" : "Sarah Jenkins joined project 'Neural Interfaces'", time: isFa ? "۱۰ دقیقه پیش" : "10 mins ago" },
                      { msg: isFa ? "ظرفیت پروژه 'شبیه‌ساز آموزش VR' تکمیل شد" : "Project 'VR Training Sim' reached capacity", time: isFa ? "۱ ساعت پیش" : "1 hour ago" },
                      { msg: isFa ? "پشتیبان‌گیری سیستم با موفقیت انجام شد" : "System backup completed successfully", time: isFa ? "۳ ساعت پیش" : "3 hours ago" }
                    ].map((act, i) => (
                      <div key={i} className="flex justify-between items-center py-3 border-b border-slate-800/50 last:border-0">
                        <span className="text-sm text-slate-300 font-medium" dir="auto">{act.msg}</span>
                        <span className="text-xs text-slate-500 shrink-0 font-sans px-2" dir="ltr">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* تب مدیریت دانشجویان و ریست رمز عبور */}
          <TabsContent value="students">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-slate-800">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>{t("studentDirectory")}</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className={`absolute top-2.5 h-4 w-4 text-slate-500 ${isFa ? 'right-3' : 'left-3'}`} />
                    <Input
                      placeholder={t("searchStudents")}
                      className={`${isFa ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3 text-left'} bg-slate-900/50 border-slate-800 focus-visible:ring-purple-500`}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-slate-800 overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-sm font-medium text-slate-400">
                        <div className="col-span-4">{t("name")}</div>
                        <div className="col-span-3">{t("project")}</div>
                        <div className="col-span-2">{t("statusLabel")}</div>
                        <div className="col-span-3 text-end">{t("actions")}</div>
                      </div>
                      {students.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">دانشجویی یافت نشد</div>
                      ) : (
                        students.map((student) => (
                          <div key={student.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                            <div className="col-span-4 flex items-center gap-3">
                              <Avatar className="h-8 w-8 shrink-0">
                                <AvatarFallback className="bg-slate-800 text-xs text-purple-400">
                                  {student.name ? student.name.charAt(0) : "S"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="overflow-hidden">
                                <p className="text-sm font-medium truncate">{student.name}</p>
                                <p className="text-xs text-slate-500 truncate" dir="ltr">{student.email?.split('@')[0]}</p>
                              </div>
                            </div>
                            <div className="col-span-3 text-sm text-slate-300" dir="auto">
                              دانشجو
                            </div>
                            <div className="col-span-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-500/10 text-green-400">
                                {t('active')}
                              </span>
                            </div>
                            <div className="col-span-3 flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-slate-400 hover:text-red-400 hover:bg-red-400/10"
                                onClick={() => handleResetPassword(student.id)}
                              >
                                {isFa ? "ریست رمز" : "Reset Pass"}
                              </Button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* تب پروژه‌ها */}
          <TabsContent value="projects">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
               <Card className="glass border-slate-800">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>{t("activeProjects")}</CardTitle>
                    <CardDescription>{t("manageProjects")}</CardDescription>
                  </div>
                  <Button
                    className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                    onClick={() => setIsCreateProjectOpen(true)}
                  >
                    <Plus className="w-4 h-4 mx-2 shrink-0" /> {t("newProject")}
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {projects.length === 0 ? (
                      <div className="col-span-full text-center text-slate-500 p-8">پروژه‌ای یافت نشد</div>
                    ) : (
                      projects.map((p) => (
                        <div key={p.id} className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
                          <div className="flex justify-between items-start mb-2 gap-2">
                            <h4 className="font-semibold text-purple-400 truncate" dir="auto">
                              {isFa && p.titleFa ? p.titleFa : p.title}
                            </h4>
                            <span className={`shrink-0 text-xs px-2 py-1 rounded ${
                              p.status === 'FULL' || p.status === 'Full' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                            }`}>
                              {p.status === 'FULL' || p.status === 'Full' ? t('full') : t('active')}
                            </span>
                          </div>
                          <div className="flex justify-between items-end mt-4">
                            <div className="text-sm text-slate-400 truncate max-w-[60%]">
                              {t("mentors")}: <span className="text-slate-300">{p.mentor?.name || '---'}</span>
                            </div>
                            <div className="text-sm font-medium shrink-0">
                              {t("capacity")}: <span dir="ltr">{p.enrolledCount || 0}/{p.maxCapacity}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* تب تیم‌ها */}
          <TabsContent value="teams">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <AdminTeamsPanel teams={teams} />
            </motion.div>
          </TabsContent>

          {/* تب تجهیزات */}
          <TabsContent value="equipment">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <AdminEquipmentPanel
                equipment={equipmentInventory}
                pendingRequests={pendingEquipmentRequests}
                assignedRequests={assignedEquipmentRequests}
              />
            </motion.div>
          </TabsContent>

          {/* تب اطلاعیه‌ها */}
          <TabsContent value="announcements">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card className="glass border-slate-800 h-fit">
                <CardHeader>
                  <CardTitle>{t("postAnnouncement")}</CardTitle>
                  <CardDescription>{t("broadcastMessage")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostAnnouncement} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 text-start">
                      <Label htmlFor="title">{t("titleLabel")}</Label>
                      <Input
                        id="title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        className="bg-slate-900/50 border-slate-800 focus-visible:ring-purple-500 text-right"
                        placeholder="..."
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex flex-col gap-2 text-start">
                      <Label htmlFor="content">{t("messageContent")}</Label>
                      <textarea
                        id="content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                        className="flex min-h-[120px] w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50 text-right"
                        placeholder="..."
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="flex flex-col gap-2 text-start">
                      <Label>{t("priority")}</Label>
                      <div className="flex gap-4" dir={isFa ? 'rtl' : 'ltr'}>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            checked={newAnnouncement.priority === 'MEDIUM'}
                            onChange={() => setNewAnnouncement({...newAnnouncement, priority: 'MEDIUM'})}
                            className="text-purple-500 bg-slate-900 border-slate-800 focus:ring-purple-500"
                            disabled={isSubmitting}
                          />
                          {t("normal")}
                        </label>
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="priority"
                            checked={newAnnouncement.priority === 'URGENT'}
                            onChange={() => setNewAnnouncement({...newAnnouncement, priority: 'URGENT'})}
                            className="text-red-500 bg-slate-900 border-slate-800 focus:ring-red-500"
                            disabled={isSubmitting}
                          />
                          <span className="text-red-400">{t("highPriority")}</span>
                        </label>
                      </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white mt-2">
                      <Mail className="w-4 h-4 mx-2" /> {isSubmitting ? tCommon("loading") : t("postAnnouncement")}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <h3 className="font-medium text-slate-300">{t("recentBroadcasts")}</h3>
                <ScrollArea className="h-[500px]" dir={isFa ? 'rtl' : 'ltr'}>
                  <div className="flex flex-col gap-4 pe-4">
                    {announcements.map((a: any) => (
                      <div key={a.id} className={`p-4 rounded-lg border ${
                        a.priority === 'URGENT' || a.priority === 'HIGH' ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900/40 border-slate-800'
                      }`}>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                          <h4 className={`font-medium ${a.priority === 'URGENT' || a.priority === 'HIGH' ? 'text-red-400' : 'text-slate-200'}`}>
                            {isFa && a.titleFa ? a.titleFa : a.title}
                          </h4>
                          <span className="text-xs text-slate-500 shrink-0" dir="ltr">
                            {a.createdAt ? format(new Date(a.createdAt), 'yyyy/MM/dd - HH:mm') : ''}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2" dir="auto">
                          {isFa && a.contentFa ? a.contentFa : a.content}
                        </p>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="text-slate-500 text-sm text-center py-4">{t("noAnnouncements")}</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </TabsContent>

          {/* تب درخواست‌های پروژه‌ها */}
          <TabsContent value="applications">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-slate-800">
                <CardHeader>
                  <CardTitle>{t("projectApps")}</CardTitle>
                  <CardDescription>{t("reviewApps")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-slate-800 overflow-x-auto">
                    <div className="min-w-[600px]">
                      <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-sm font-medium text-slate-400">
                        <div className="col-span-3">{tCommon("profile")}</div>
                        <div className="col-span-3">{t("project")}</div>
                        <div className="col-span-2">{t("dateApplied")}</div>
                        <div className="col-span-2">{t("statusLabel")}</div>
                        <div className="col-span-2 text-end">{t("actions")}</div>
                      </div>
                      {applications.length === 0 ? (
                        <div className="p-8 text-center text-slate-500">{t("noApps")}</div>
                      ) : (
                        applications.map((app) => (
                          <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                            <div className="col-span-3 text-sm font-medium truncate">
                              {app.user.name || 'Unknown'}
                            </div>
                            <div className="col-span-3 text-sm text-slate-300 truncate" dir="auto">
                              {isFa && (app.project as any).titleFa ? (app.project as any).titleFa : app.project.title}
                            </div>
                            <div className="col-span-2 text-xs text-slate-400" dir="ltr">
                              {app.appliedAt ? format(new Date(app.appliedAt), 'yyyy/MM/dd') : ''}
                            </div>
                            <div className="col-span-2">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400' :
                                app.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                                'bg-yellow-500/10 text-yellow-400'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <div className="col-span-2 text-end flex justify-end gap-2">
                              {app.status === 'APPLIED' || app.status === 'PENDING' ? (
                                <>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                    onClick={async () => {
                                      try {
                                        const res = await fetch('/api/projects/application', {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ applicationId: app.id, status: 'ACCEPTED' })
                                        });
                                        if (res.ok) router.refresh();
                                      } catch (e) { console.error(e); }
                                    }}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                    onClick={async () => {
                                      try {
                                        const res = await fetch('/api/projects/application', {
                                          method: 'PATCH',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ applicationId: app.id, status: 'REJECTED' })
                                        });
                                        if (res.ok) router.refresh();
                                      } catch (e) { console.error(e); }
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <span className="text-xs text-slate-500">Processed</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          {/* تب تنظیمات (تغییر رمز عبور و تنظیمات سیستم) */}
          <TabsContent value="settings">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* فرم تغییر رمز عبور */}
              <Card className="glass border-slate-800 h-fit">
                <CardHeader>
                  <CardTitle>{isFa ? "تغییر رمز عبور" : "Change Password"}</CardTitle>
                  <CardDescription>{isFa ? "برای امنیت بیشتر، توصیه می‌شود رمز عبور خود را تغییر دهید." : "It is recommended to change your password for better security."}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChangePasswordForm />
                </CardContent>
              </Card>

              {/* فرم تنظیمات سیستم */}
              <Card className="glass border-slate-800 h-fit">
                <CardHeader>
                  <CardTitle>{t("systemConfig")}</CardTitle>
                  <CardDescription>{isFa ? "مدیریت دسترسی‌ها و تنظیمات سراسری سیستم." : "Manage global cohort settings and access controls."}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <div className="flex items-center justify-between py-2">
                    <div className={`flex flex-col gap-1 ${isFa ? 'text-right' : 'text-left'}`}>
                      <Label className="text-base font-medium">{t("studentReg")}</Label>
                      <p className="text-sm text-slate-400">{t("studentRegDesc")}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="h-px bg-slate-800 w-full" />
                  <div className="flex items-center justify-between py-2">
                    <div className={`flex flex-col gap-1 ${isFa ? 'text-right' : 'text-left'}`}>
                      <Label className="text-base font-medium">{t("projectSel")}</Label>
                      <p className="text-sm text-slate-400">{t("projectSelDesc")}</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="h-px bg-slate-800 w-full" />
                  <div className="flex items-center justify-between py-2">
                    <div className={`flex flex-col gap-1 ${isFa ? 'text-right' : 'text-left'}`}>
                      <Label className="text-base font-medium">{t("maintenance")}</Label>
                      <p className="text-sm text-slate-400">{t("maintenanceDesc")}</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.main>

      <CreateProjectDialog
        isOpen={isCreateProjectOpen}
        onClose={() => setIsCreateProjectOpen(false)}
        mentors={mentors}
      />
    </div>
  );
}
