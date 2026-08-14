"use client"

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Users, ArrowRight, UsersRound } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useTranslations } from "next-intl";
import type { ProjectWithTeam } from "./projects-client";

interface ProjectDetailDialogProps {
  project: ProjectWithTeam | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailDialog({ project, isOpen, onClose }: ProjectDetailDialogProps) {
  const t = useTranslations('Projects');
  const { data: session, status } = useSession();
  const [isApplying, setIsApplying] = useState(false);
  const [myLeaderTeam, setMyLeaderTeam] = useState<{ id: string; name: string; status: string; memberCount: number } | null | undefined>(undefined);
  const router = useRouter();

  useEffect(() => {
    if (!isOpen || status !== "authenticated") return;
    fetch("/api/teams/my-leader-team")
      .then((res) => res.json())
      .then((data) => setMyLeaderTeam(data.team || null))
      .catch(() => setMyLeaderTeam(null));
  }, [isOpen, status]);

  if (!project) return null;

  const isAssigned = !!project.assignedTeam;

  const handleSelect = async () => {
    if (status === "unauthenticated" || !session) {
      toast.error("برای درخواست پروژه ابتدا وارد حساب کاربری خود شوید");
      return;
    }

    if (!myLeaderTeam) {
      toast.error("فقط سرپرست یک تیم می‌تواند برای پروژه درخواست دهد. ابتدا یک تیم بسازید");
      return;
    }

    if (myLeaderTeam.status !== "APPROVED") {
      toast.error("تیم شما هنوز توسط مدیر سیستم تایید نشده است");
      return;
    }

    if (myLeaderTeam.memberCount !== project.maxCapacity) {
      toast.error(`تعداد اعضای تیم شما (${myLeaderTeam.memberCount} نفر) باید دقیقاً برابر با تعداد افراد موردنیاز این پروژه (${project.maxCapacity} نفر) باشد`);
      return;
    }

    try {
      setIsApplying(true);
      const response = await fetch('/api/projects/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: project.id }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        toast.error(data.message || "درخواست شما با خطا مواجه شد. لطفاً دوباره تلاش کنید");
        return;
      }

      toast.success(data.message || `درخواست تیم شما برای پروژه «${project.titleFa || project.title}» با موفقیت ثبت شد`);
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("خطایی غیرمنتظره رخ داد. اتصال اینترنت خود را بررسی کنید");
      console.error(error);
    } finally {
      setIsApplying(false);
    }
  };

  const categoryColorMap: Record<string, string> = {
    VR: "vr",
    AR: "ar",
    MR: "mr",
    XR: "xr",
    Metaverse: "metaverse"
  };

  // Parse objectives
  let parsedObjectives: string[] = [];
  try {
    if (project.objectives) {
      parsedObjectives = JSON.parse(project.objectives);
      if (!Array.isArray(parsedObjectives)) parsedObjectives = [project.objectives];
    }
  } catch {
    parsedObjectives = project.objectives ? project.objectives.split('\n').filter(Boolean) : [];
  }

  // Parse techStack
  let parsedTechStack: string[] = [];
  try {
    parsedTechStack = JSON.parse(project.techStack);
    if (!Array.isArray(parsedTechStack)) parsedTechStack = [project.techStack];
  } catch {
    parsedTechStack = project.techStack.split(',').map(s => s.trim());
  }

  // پیام راهنما بر اساس وضعیت تیم کاربر برای درخواست پروژه
  let eligibilityNotice: string | null = null;
  if (isAssigned) {
    eligibilityNotice = null; // پیام جداگانه پایین‌تر نمایش داده می‌شود
  } else if (status === "authenticated" && myLeaderTeam === null) {
    eligibilityNotice = "فقط سرپرست یک تیم می‌تواند برای پروژه درخواست دهد. ابتدا یک تیم بسازید یا سرپرست تیم شوید.";
  } else if (status === "authenticated" && myLeaderTeam && myLeaderTeam.status === "PENDING") {
    eligibilityNotice = "تیم شما در انتظار تایید مدیر سیستم است. پس از تایید می‌توانید برای پروژه‌ها درخواست دهید.";
  } else if (status === "authenticated" && myLeaderTeam && myLeaderTeam.status === "REJECTED") {
    eligibilityNotice = "درخواست ساخت تیم شما رد شده است، بنابراین امکان درخواست برای پروژه وجود ندارد.";
  } else if (status === "authenticated" && myLeaderTeam && myLeaderTeam.status === "APPROVED" && myLeaderTeam.memberCount !== project.maxCapacity) {
    eligibilityNotice = `تعداد اعضای تیم شما (${myLeaderTeam.memberCount} نفر) با تعداد افراد موردنیاز این پروژه (${project.maxCapacity} نفر) برابر نیست.`;
  }

  const canApply =
    !isAssigned &&
    status === "authenticated" &&
    myLeaderTeam &&
    myLeaderTeam.status === "APPROVED" &&
    myLeaderTeam.memberCount === project.maxCapacity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full sm:max-w-[700px] bg-gray-950/90 border-white/10 backdrop-blur-xl overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant={(categoryColorMap[project.category]  || "default") as any}>
              {project.category}
            </Badge>
            <Badge variant={
              project.difficulty === 'Beginner' ? 'default' :
              project.difficulty === 'Intermediate' ? 'secondary' : 'destructive'
            }>
              {project.difficulty}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold gradient-text"><span dir="ltr" className="inline-block">{project.title}</span></DialogTitle>
          <p className="text-sm text-gray-400 font-medium">{project.titleFa}</p>
          <div className="text-base text-gray-300 mt-4 leading-relaxed">
            {project.description}
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] mt-4 pe-4">
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> {t('objectives')}
              </h4>
              <ul className="flex flex-col gap-2">
                {parsedObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> {t('capacityAndMentor')}
              </h4>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col gap-4">
                {isAssigned ? (
                  <div className="flex items-center gap-2 text-sm">
                    <UsersRound className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-blue-400" dir="auto">
                      {t('assignedTo')}: {project.assignedTeam?.nameFa || project.assignedTeam?.name}
                    </span>
                  </div>
                ) : (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">{t('requiredMembersLabel')}</span>
                    <span className="text-green-400 font-medium" dir="ltr">{project.maxCapacity}</span>
                  </div>
                )}

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{t('duration')}:</span>
                  <span className="flex items-center gap-1 text-gray-200">
                    <Clock className="w-4 h-4" /> {project.duration}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">{t('techStack')}</h4>
              <div className="flex flex-wrap gap-2">
                {parsedTechStack.map((tech, i) => (
                  <Badge key={i} variant="outline" className="bg-black/50"><span dir="ltr" className="inline-block">{tech}</span></Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {eligibilityNotice && (
          <p className="mt-4 text-sm text-yellow-400 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            {eligibilityNotice}{" "}
            {myLeaderTeam === null && (
              <Link href="/teams" className="underline hover:text-yellow-300">
                {t('viewDetails')}
              </Link>
            )}
          </p>
        )}

        <div className="mt-6 flex justify-end">
          {isAssigned ? (
            <Button disabled variant="destructive">
              {t('projectIsFull')}
            </Button>
          ) : (
            <Button
              onClick={handleSelect}
              disabled={isApplying || !canApply}
              className="bg-cyan-600 hover:bg-cyan-500 text-white neon-cyan disabled:opacity-40"
            >
              {isApplying ? t("applying") : t("applyForProject")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
