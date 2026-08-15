"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Plus, Check, RotateCcw, Trash2, Upload, FileText, Download,
  UsersRound, ListChecks, MessageSquareText,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";

export interface MentorTask {
  id: string;
  title: string;
  description: string | null;
  status: string;
  createdAt: string;
  completedAt: string | null;
  approvedAt: string | null;
}

export interface MentorResource {
  id: string;
  title: string;
  url: string;
  fileSize: number;
  createdAt: string;
  uploadedById: string;
}

export interface MentorUpdate {
  id: string;
  content: string;
  createdAt: string;
  author: { name: string | null; nameFa: string | null };
}

export interface MentorProjectData {
  id: string;
  title: string;
  titleFa: string | null;
  maxCapacity: number;
  status: string;
  assignedTeam: {
    id: string;
    name: string;
    nameFa: string | null;
    members: { user: { name: string | null; nameFa: string | null } }[];
  } | null;
  tasks: MentorTask[];
  resources: MentorResource[];
  updates: MentorUpdate[];
}

interface MentorProjectCardProps {
  project: MentorProjectData;
  currentUserId: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MentorProjectCard({ project, currentUserId }: MentorProjectCardProps) {
  const t = useTranslations("Mentor");
  const locale = useLocale();
  const isFa = locale === "fa";
  const router = useRouter();

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [uploadTitle, setUploadTitle] = useState("");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleAddTask = async () => {
    if (!taskTitle.trim()) {
      toast.error(t("taskTitleRequired"));
      return;
    }
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/mentor/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: project.id, title: taskTitle, description: taskDesc }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message || t("taskAdded"));
      setTaskTitle("");
      setTaskDesc("");
      router.refresh();
    } catch (e) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/mentor/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (e) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = async (taskId: string, approved: boolean) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/mentor/tasks/approve", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, approved }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (e) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      toast.error(t("fileRequired"));
      return;
    }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", uploadFile);
      formData.append("title", uploadTitle || uploadFile.name);
      formData.append("projectId", project.id);

      const res = await fetch("/api/resources/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message || t("uploadSuccess"));
      setUploadTitle("");
      setUploadFile(null);
      router.refresh();
    } catch (e) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (e) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const taskStatusBadge: Record<string, { label: string; className: string }> = {
    PENDING: { label: t("taskPending"), className: "bg-slate-500/10 text-slate-400" },
    DONE: { label: t("taskDone"), className: "bg-yellow-500/10 text-yellow-400" },
    APPROVED: { label: t("taskApproved"), className: "bg-green-500/10 text-green-400" },
  };

  return (
    <Card className="glass-strong border-purple-500/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-xl gradient-text">
              {isFa && project.titleFa ? project.titleFa : project.title}
            </CardTitle>
            {project.assignedTeam ? (
              <CardDescription className="flex items-center gap-1 mt-1">
                <UsersRound className="w-3.5 h-3.5" />
                {isFa && project.assignedTeam.nameFa ? project.assignedTeam.nameFa : project.assignedTeam.name}
              </CardDescription>
            ) : (
              <CardDescription className="mt-1">{t("noTeamAssigned")}</CardDescription>
            )}
          </div>
          <Badge variant="outline" className="text-purple-300 border-purple-500/30">
            {t("requiredMembers", { count: project.maxCapacity })}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col gap-6">
        {project.assignedTeam && (
          <div>
            <p className="text-sm text-slate-400 mb-2 flex items-center gap-2">
              <UsersRound className="w-4 h-4" /> {t("teamMembers")}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.assignedTeam.members.map((m, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-slate-900/50 border border-slate-800 rounded-full ps-1 pe-3 py-1">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-slate-800 text-cyan-400 text-[10px]">
                      {(m.user.name || "?").charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-slate-300" dir="auto">
                    {isFa && m.user.nameFa ? m.user.nameFa : m.user.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks / Timeline */}
        <div>
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <ListChecks className="w-4 h-4" /> {t("timeline")}
          </p>
          <div className="flex flex-col gap-2 mb-3">
            {project.tasks.length === 0 && (
              <p className="text-sm text-slate-500 bg-slate-900/30 border border-slate-800 rounded-lg p-3">{t("noTasks")}</p>
            )}
            {project.tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between gap-3 bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-white" dir="auto">{task.title}</p>
                    <Badge className={taskStatusBadge[task.status]?.className}>
                      {taskStatusBadge[task.status]?.label}
                    </Badge>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-500 mt-1" dir="auto">{task.description}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  {task.status === "DONE" && (
                    <>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-green-500/20 hover:bg-green-500/30 text-green-400"
                        disabled={isSubmitting}
                        onClick={() => handleApprove(task.id, true)}
                        title={t("approve")}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-7 w-7 bg-slate-500/20 hover:bg-slate-500/30 text-slate-400"
                        disabled={isSubmitting}
                        onClick={() => handleApprove(task.id, false)}
                        title={t("sendBack")}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </Button>
                    </>
                  )}
                  {task.status !== "APPROVED" && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                      disabled={isSubmitting}
                      onClick={() => handleDeleteTask(task.id)}
                      title={t("deleteTask")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder={t("newTaskPlaceholder")}
              className="bg-slate-900/50 border-slate-800"
            />
            <Input
              value={taskDesc}
              onChange={(e) => setTaskDesc(e.target.value)}
              placeholder={t("taskDescPlaceholder")}
              className="bg-slate-900/50 border-slate-800"
            />
            <Button
              onClick={handleAddTask}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
            >
              <Plus className="w-4 h-4 me-1" /> {t("addTask")}
            </Button>
          </div>
        </div>

        {/* Files */}
        <div>
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> {t("projectFiles")}
          </p>
          <div className="flex flex-col gap-2 mb-3">
            {project.resources.length === 0 && (
              <p className="text-sm text-slate-500 bg-slate-900/30 border border-slate-800 rounded-lg p-3">{t("noFiles")}</p>
            )}
            {project.resources.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                  <a href={r.url} download target="_blank" rel="noopener noreferrer" className="text-sm text-slate-200 hover:text-cyan-400 truncate" dir="auto">
                    {r.title}
                  </a>
                  <span className="text-xs text-slate-500 font-sans shrink-0" dir="ltr">({formatFileSize(r.fileSize)})</span>
                </div>
                {r.uploadedById === currentUserId && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-400/10 shrink-0"
                    disabled={isSubmitting}
                    onClick={() => handleDeleteResource(r.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              value={uploadTitle}
              onChange={(e) => setUploadTitle(e.target.value)}
              placeholder={t("fileTitlePlaceholder")}
              className="bg-slate-900/50 border-slate-800"
            />
            <input
              type="file"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-400 file:me-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 file:cursor-pointer w-full sm:w-auto"
            />
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-cyan-600 hover:bg-cyan-500 text-white shrink-0"
            >
              <Upload className="w-4 h-4 me-1" /> {isUploading ? t("uploading") : t("upload")}
            </Button>
          </div>
        </div>

        {/* Updates feed */}
        <div>
          <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
            <MessageSquareText className="w-4 h-4" /> {t("teamUpdates")}
          </p>
          <div className="flex flex-col gap-2">
            {project.updates.length === 0 && (
              <p className="text-sm text-slate-500 bg-slate-900/30 border border-slate-800 rounded-lg p-3">{t("noUpdates")}</p>
            )}
            {project.updates.map((u) => (
              <div key={u.id} className="bg-slate-900/50 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-cyan-400" dir="auto">
                    {isFa && u.author.nameFa ? u.author.nameFa : u.author.name}
                  </span>
                  <span className="text-xs text-slate-500 font-sans" dir="ltr">
                    {format(new Date(u.createdAt), "yyyy/MM/dd HH:mm")}
                  </span>
                </div>
                <p className="text-sm text-slate-300 whitespace-pre-wrap" dir="auto">{u.content}</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
