// DESTINATION: src/components/dashboard/mentor-dashboard.tsx (new file)
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutDashboard, Boxes, Settings, Send, Plus, Trash2, Clock,
  Users, Package, Calendar, Check, CircleDot, X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";
import { toast } from "sonner";
import { ChangePasswordForm } from "./change-password-form";

export interface MentorStepData {
  id: string;
  title: string;
  titleFa: string | null;
  deadline: string | null;
  status: string;
  order: number;
}

export interface MentorTeamData {
  id: string;
  name: string;
  nameFa: string | null;
  members: { id: string; user: { name: string | null; nameFa: string | null } }[];
  equipment: { id: string; quantity: number; equipment: { name: string; nameFa: string | null } }[];
}

export interface MentorProjectData {
  id: string;
  title: string;
  titleFa: string | null;
  description: string;
  category: string;
  difficulty: string;
  duration: string;
  maxCapacity: number;
  status: string;
  availabilityDays: string | null;
  availabilityHours: string | null;
  steps: MentorStepData[];
  teams: MentorTeamData[];
}

interface MentorDashboardProps {
  user: { name?: string | null; image?: string | null; id?: string | null };
  data: {
    projects: MentorProjectData[];
    telegramUsername: string | null;
  };
}

function StepStatusBadge({ status, isFa }: { status: string; isFa: boolean }) {
  const map: Record<string, { label: string; className: string }> = {
    PENDING: { label: isFa ? "شروع نشده" : "Pending", className: "bg-slate-500/10 text-slate-400" },
    IN_PROGRESS: { label: isFa ? "در حال انجام" : "In Progress", className: "bg-yellow-500/10 text-yellow-400" },
    DONE: { label: isFa ? "انجام شد" : "Done", className: "bg-green-500/10 text-green-400" },
  };
  const s = map[status] || map.PENDING;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${s.className}`}>
      {s.label}
    </span>
  );
}

function MentorProjectCard({ project, isFa }: { project: MentorProjectData; isFa: boolean }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newStep, setNewStep] = useState({ title: "", titleFa: "", deadline: "" });
  const [availability, setAvailability] = useState({
    availabilityDays: project.availabilityDays || "",
    availabilityHours: project.availabilityHours || "",
  });

  const addStep = async () => {
    if (!newStep.title.trim()) {
      toast.error(isFa ? "عنوان استپ الزامی است" : "Step title is required");
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/mentor/projects/${project.id}/steps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newStep),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || (isFa ? "خطایی رخ داد" : "Something went wrong"));
        return;
      }
      toast.success(data.message);
      setNewStep({ title: "", titleFa: "", deadline: "" });
      router.refresh();
    } catch (e) {
      toast.error(isFa ? "خطایی غیرمنتظره رخ داد" : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateStepStatus = async (stepId: string, status: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/mentor/projects/${project.id}/steps`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId, status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || (isFa ? "خطایی رخ داد" : "Something went wrong"));
        return;
      }
      router.refresh();
    } catch (e) {
      toast.error(isFa ? "خطایی غیرمنتظره رخ داد" : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteStep = async (stepId: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/mentor/projects/${project.id}/steps`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stepId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || (isFa ? "خطایی رخ داد" : "Something went wrong"));
        return;
      }
      router.refresh();
    } catch (e) {
      toast.error(isFa ? "خطایی غیرمنتظره رخ داد" : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const saveAvailability = async () => {
    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/mentor/projects/${project.id}/availability`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(availability),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || (isFa ? "خطایی رخ داد" : "Something went wrong"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (e) {
      toast.error(isFa ? "خطایی غیرمنتظره رخ داد" : "Unexpected error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass border-slate-800">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-lg" dir="ltr">{project.title}</CardTitle>
            {project.titleFa && <CardDescription dir="rtl" className="mt-1">{project.titleFa}</CardDescription>}
          </div>
          <Badge variant="outline">{project.category}</Badge>
        </div>
        <p className="text-sm text-slate-400 mt-2 leading-relaxed">{project.description}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">

        {/* تیم‌های این پروژه و تجهیزاتشان */}
        <div>
          <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" /> {isFa ? "تیم‌های این پروژه" : "Teams on this project"}
          </p>
          {project.teams.length === 0 ? (
            <p className="text-sm text-slate-500 bg-slate-900/30 border border-slate-800 rounded-lg p-3">
              {isFa ? "هنوز تیمی این پروژه را برنداشته است." : "No team has taken this project yet."}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {project.teams.map((team) => (
                <div key={team.id} className="p-3 rounded-lg border border-slate-800 bg-slate-900/40">
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
                    <p className="text-sm font-medium text-white" dir="auto">
                      {isFa && team.nameFa ? team.nameFa : team.name}
                    </p>
                    <span className="text-xs text-slate-500">
                      {team.members.length} {isFa ? "عضو" : "members"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {team.members.map((m) => (
                      <span key={m.id} className="text-xs px-2 py-0.5 rounded-md bg-slate-800 text-slate-300" dir="auto">
                        {isFa && m.user.nameFa ? m.user.nameFa : m.user.name}
                      </span>
                    ))}
                  </div>
                  {team.equipment.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-slate-800/60">
                      {team.equipment.map((eq) => (
                        <span key={eq.id} className="text-xs px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 flex items-center gap-1" dir="auto">
                          <Package className="w-3 h-3" />
                          {isFa && eq.equipment.nameFa ? eq.equipment.nameFa : eq.equipment.name} × {eq.quantity}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* استپ‌ها و ددلاین‌ها */}
        <div>
          <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <CircleDot className="w-4 h-4 text-cyan-400" /> {isFa ? "استپ‌ها و ددلاین‌ها" : "Steps & Deadlines"}
          </p>
          <div className="flex flex-col gap-2 mb-3">
            {project.steps.length === 0 ? (
              <p className="text-sm text-slate-500">{isFa ? "هنوز استپی ثبت نشده است." : "No steps yet."}</p>
            ) : (
              project.steps.map((step) => (
                <div key={step.id} className="flex items-center justify-between gap-2 p-2.5 rounded-lg border border-slate-800/60 bg-slate-900/20">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate" dir="auto">
                      {isFa && step.titleFa ? step.titleFa : step.title}
                    </p>
                    {step.deadline && (
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5" dir="ltr">
                        <Clock className="w-3 h-3" /> {format(new Date(step.deadline), "yyyy/MM/dd HH:mm")}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StepStatusBadge status={step.status} isFa={isFa} />
                    <select
                      value={step.status}
                      disabled={isSubmitting}
                      onChange={(e) => updateStepStatus(step.id, e.target.value)}
                      className="text-xs bg-slate-900 border border-slate-800 rounded-md px-1.5 py-1 text-slate-300"
                    >
                      <option value="PENDING">{isFa ? "شروع نشده" : "Pending"}</option>
                      <option value="IN_PROGRESS">{isFa ? "در حال انجام" : "In Progress"}</option>
                      <option value="DONE">{isFa ? "انجام شد" : "Done"}</option>
                    </select>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={isSubmitting}
                      onClick={() => deleteStep(step.id)}
                      className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <Input
              placeholder={isFa ? "عنوان استپ (انگلیسی)" : "Step title"}
              value={newStep.title}
              onChange={(e) => setNewStep((s) => ({ ...s, title: e.target.value }))}
              className="bg-slate-900/50 border-slate-800 text-sm"
            />
            <Input
              placeholder={isFa ? "عنوان استپ (فارسی)" : "Step title (Persian)"}
              dir="rtl"
              value={newStep.titleFa}
              onChange={(e) => setNewStep((s) => ({ ...s, titleFa: e.target.value }))}
              className="bg-slate-900/50 border-slate-800 text-sm"
            />
            <Input
              type="datetime-local"
              value={newStep.deadline}
              onChange={(e) => setNewStep((s) => ({ ...s, deadline: e.target.value }))}
              className="bg-slate-900/50 border-slate-800 text-sm"
            />
          </div>
          <Button
            size="sm"
            onClick={addStep}
            disabled={isSubmitting}
            className="mt-2 bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="w-3.5 h-3.5 me-1" /> {isFa ? "افزودن استپ" : "Add Step"}
          </Button>
        </div>

        {/* بازه در دسترس بودن */}
        <div>
          <p className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-cyan-400" /> {isFa ? "بازه در دسترس بودن" : "Availability window"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-slate-400">{isFa ? "روزها (مثلاً «شنبه تا چهارشنبه»)" : "Days (e.g. Sat–Wed)"}</Label>
              <Input
                value={availability.availabilityDays}
                onChange={(e) => setAvailability((a) => ({ ...a, availabilityDays: e.target.value }))}
                className="bg-slate-900/50 border-slate-800 text-sm"
                dir="auto"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label className="text-xs text-slate-400">{isFa ? "ساعات (مثلاً «۱۴:۰۰ تا ۱۸:۰۰»)" : "Hours (e.g. 14:00–18:00)"}</Label>
              <Input
                value={availability.availabilityHours}
                onChange={(e) => setAvailability((a) => ({ ...a, availabilityHours: e.target.value }))}
                className="bg-slate-900/50 border-slate-800 text-sm"
                dir="auto"
              />
            </div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={saveAvailability}
            disabled={isSubmitting}
            className="mt-2 border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            <Check className="w-3.5 h-3.5 me-1" /> {isFa ? "ذخیره بازه" : "Save availability"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function MentorDashboard({ user, data }: MentorDashboardProps) {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const isFa = locale === "fa";
  const router = useRouter();

  const projects = data?.projects || [];

  const [telegramUsername, setTelegramUsername] = useState(data?.telegramUsername || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const saveTelegram = async () => {
    try {
      setIsSavingProfile(true);
      const res = await fetch("/api/mentor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telegramUsername }),
      });
      const resData = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(resData.message || (isFa ? "خطایی رخ داد" : "Something went wrong"));
        return;
      }
      toast.success(resData.message);
      router.refresh();
    } catch (e) {
      toast.error(isFa ? "خطایی غیرمنتظره رخ داد" : "Unexpected error");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white p-4 md:p-6 gap-6 pt-24 w-full">
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 glass rounded-xl p-6 flex flex-col gap-8 h-fit sticky top-24 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]"
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
            <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              {isFa ? "منتور" : "MENTOR"}
            </div>
          </div>
        </div>
      </motion.aside>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 max-w-6xl w-full"
      >
        <Tabs defaultValue="overview" className="w-full" dir={isFa ? "rtl" : "ltr"}>
          <TabsList className="grid grid-cols-3 w-full md:w-auto md:inline-flex bg-slate-900/50 border border-slate-800 p-1 mb-8 overflow-x-auto">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <LayoutDashboard className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{t("overview")}</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Boxes className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{isFa ? "پروژه‌های من" : "My Projects"}</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Settings className="w-4 h-4 md:mx-2 mx-1 shrink-0" />
              <span className="hidden md:inline">{isFa ? "تنظیمات" : "Settings"}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
              <h1 className="text-3xl font-bold tracking-tight mb-2">
                {isFa ? `خوش آمدید، ${user.name?.split(" ")[0] || "منتور"}` : `Welcome, ${user.name?.split(" ")[0] || "Mentor"}`}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="glass-strong border-cyan-500/20">
                  <CardContent className="p-6">
                    <Boxes className="w-8 h-8 mb-3 text-cyan-400 opacity-80" />
                    <p className="text-sm text-slate-400">{isFa ? "پروژه‌های اساین‌شده" : "Assigned Projects"}</p>
                    <p className="text-3xl font-bold mt-1" dir="ltr">{projects.length}</p>
                  </CardContent>
                </Card>
                <Card className="glass-strong border-cyan-500/20">
                  <CardContent className="p-6">
                    <Users className="w-8 h-8 mb-3 text-purple-400 opacity-80" />
                    <p className="text-sm text-slate-400">{isFa ? "تیم‌های فعال" : "Active Teams"}</p>
                    <p className="text-3xl font-bold mt-1" dir="ltr">
                      {projects.reduce((sum, p) => sum + p.teams.length, 0)}
                    </p>
                  </CardContent>
                </Card>
                <Card className="glass-strong border-cyan-500/20">
                  <CardContent className="p-6">
                    <CircleDot className="w-8 h-8 mb-3 text-green-400 opacity-80" />
                    <p className="text-sm text-slate-400">{isFa ? "استپ‌های باز" : "Open Steps"}</p>
                    <p className="text-3xl font-bold mt-1" dir="ltr">
                      {projects.reduce((sum, p) => sum + p.steps.filter((s) => s.status !== "DONE").length, 0)}
                    </p>
                  </CardContent>
                </Card>
              </div>
              {!telegramUsername && (
                <p className="text-sm text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
                  {isFa
                    ? "برای اینکه دانشجویان بتوانند با شما در ارتباط باشند، آیدی تلگرام خود را در تب «تنظیمات» ثبت کنید."
                    : "Add your Telegram username in the Settings tab so students can reach you."}
                </p>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="projects">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-6">
              {projects.length === 0 ? (
                <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-slate-800">
                  <Boxes className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    {isFa ? "هنوز پروژه‌ای به شما اساین نشده" : "No projects assigned yet"}
                  </h3>
                </div>
              ) : (
                projects.map((project) => (
                  <MentorProjectCard key={project.id} project={project} isFa={isFa} />
                ))
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-slate-800 h-fit">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-cyan-400" />
                    {isFa ? "راه ارتباطی (تلگرام)" : "Contact (Telegram)"}
                  </CardTitle>
                  <CardDescription>
                    {isFa
                      ? "این آیدی به دانشجویانی که پروژه شما را برداشته‌اند نمایش داده می‌شود."
                      : "This username is shown to students who take your project."}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <Label>{isFa ? "آیدی تلگرام (بدون @)" : "Telegram username (without @)"}</Label>
                    <Input
                      dir="ltr"
                      value={telegramUsername}
                      onChange={(e) => setTelegramUsername(e.target.value)}
                      placeholder="username"
                      className="bg-slate-900/50 border-slate-800"
                    />
                  </div>
                  <Button
                    onClick={saveTelegram}
                    disabled={isSavingProfile}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white w-fit"
                  >
                    {isFa ? "ذخیره" : "Save"}
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass border-slate-800 h-fit">
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
