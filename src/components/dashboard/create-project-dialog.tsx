"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

interface Mentor {
  id: string;
  name: string | null;
  nameFa: string | null;
}

interface CreateProjectDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mentors: Mentor[];
}

const emptyForm = {
  title: "",
  titleFa: "",
  description: "",
  category: "VR",
  difficulty: "Beginner",
  maxCapacity: "4",
  duration: "",
  techStack: "",
  mentorId: "",
  thumbnailUrl: "",
  objectives: "",
  prerequisites: "",
};

export function CreateProjectDialog({
  isOpen,
  onClose,
  mentors,
}: CreateProjectDialogProps) {
  const t = useTranslations("Dashboard");
  const tCommon = useTranslations("Common");
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const update = (field: keyof typeof emptyForm, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleSubmit = async () => {
    if (
      !form.title.trim() ||
      !form.description.trim() ||
      !form.duration.trim() ||
      !form.techStack.trim() ||
      !form.mentorId
    ) {
      toast.error(t("createProjectRequired"));
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("createProjectError"));
        return;
      }
      toast.success(data.message || t("createProjectSuccess"));
      setForm(emptyForm);
      router.refresh();
      onClose();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full sm:max-w-[600px] bg-gray-950/90 border-white/10 backdrop-blur-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">
            {t("newProject")}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {t("createProjectDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("projectTitle")}</Label>
              <Input
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                className="bg-slate-900/50 border-slate-800"
                placeholder="AR Navigation System"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("projectTitleFa")}</Label>
              <Input
                dir="rtl"
                value={form.titleFa}
                onChange={(e) => update("titleFa", e.target.value)}
                className="bg-slate-900/50 border-slate-800"
                placeholder="سیستم ناوبری واقعیت افزوده"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("projectDescription")}</Label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              className="w-full rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("category")}</Label>
              <Select value={form.category} onValueChange={(v) => update("category", v)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VR">VR</SelectItem>
                  <SelectItem value="AR">AR</SelectItem>
                  <SelectItem value="MR">MR</SelectItem>
                  <SelectItem value="XR">XR</SelectItem>
                  <SelectItem value="Metaverse">Metaverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("difficulty")}</Label>
              <Select value={form.difficulty} onValueChange={(v) => update("difficulty", v)}>
                <SelectTrigger className="bg-slate-900/50 border-slate-800">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("capacity")}</Label>
              <Input
                type="number"
                min={1}
                value={form.maxCapacity}
                onChange={(e) => update("maxCapacity", e.target.value)}
                className="bg-slate-900/50 border-slate-800"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("duration")}</Label>
              <Input
                value={form.duration}
                onChange={(e) => update("duration", e.target.value)}
                className="bg-slate-900/50 border-slate-800"
                placeholder="8 Weeks"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("mentor")}</Label>
            <Select value={form.mentorId} onValueChange={(v) => update("mentorId", v)}>
              <SelectTrigger className="bg-slate-900/50 border-slate-800">
                <SelectValue placeholder={t("selectMentor")} />
              </SelectTrigger>
              <SelectContent>
                {mentors.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.name || m.nameFa || m.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("techStack")}</Label>
            <Input
              value={form.techStack}
              onChange={(e) => update("techStack", e.target.value)}
              className="bg-slate-900/50 border-slate-800"
              placeholder="Unity, ARKit, C#"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("thumbnailUrl")}</Label>
            <Input
              value={form.thumbnailUrl}
              onChange={(e) => update("thumbnailUrl", e.target.value)}
              className="bg-slate-900/50 border-slate-800"
              placeholder="https://..."
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("objectives")}</Label>
            <textarea
              value={form.objectives}
              onChange={(e) => update("objectives", e.target.value)}
              rows={3}
              className="w-full rounded-md bg-slate-900/50 border border-slate-800 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
              placeholder={t("objectivesPlaceholder")}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label>{t("prerequisites")}</Label>
            <Input
              value={form.prerequisites}
              onChange={(e) => update("prerequisites", e.target.value)}
              className="bg-slate-900/50 border-slate-800"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-slate-800">
            {tCommon("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? t("creating") : t("newProject")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
