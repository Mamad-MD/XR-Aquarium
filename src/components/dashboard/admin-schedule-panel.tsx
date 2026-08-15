"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, Pencil, Calendar } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import { format } from "date-fns";

export interface AdminScheduleEvent {
  id: string;
  title: string;
  titleFa: string | null;
  type: string;
  date: string;
  location: string | null;
  locationFa: string | null;
  description: string | null;
  descriptionFa: string | null;
}

interface AdminSchedulePanelProps {
  events: AdminScheduleEvent[];
}

const emptyForm = {
  id: "",
  title: "",
  titleFa: "",
  type: "WORKSHOP",
  date: "",
  location: "",
  locationFa: "",
  description: "",
  descriptionFa: "",
};

export function AdminSchedulePanel({ events }: AdminSchedulePanelProps) {
  const t = useTranslations("Dashboard");
  const tSchedule = useTranslations("Schedule");
  const locale = useLocale();
  const isFa = locale === "fa";
  const router = useRouter();

  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetForm = () => {
    setForm(emptyForm);
    setIsEditing(false);
  };

  const startEdit = (event: AdminScheduleEvent) => {
    setForm({
      id: event.id,
      title: event.title,
      titleFa: event.titleFa || "",
      type: event.type,
      date: new Date(event.date).toISOString().slice(0, 16),
      location: event.location || "",
      locationFa: event.locationFa || "",
      description: event.description || "",
      descriptionFa: event.descriptionFa || "",
    });
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.date) {
      toast.error(t("scheduleFieldsRequired"));
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/schedule", {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message || t("scheduleSaved"));
      resetForm();
      router.refresh();
    } catch (e) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isFa ? "این رویداد حذف شود؟" : "Delete this event?")) return;
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
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

  const typeLabel: Record<string, string> = {
    WORKSHOP: tSchedule("workshop"),
    DEADLINE: tSchedule("deadline"),
    PRESENTATION: tSchedule("presentation"),
    MEETING: tSchedule("meeting"),
    EVENT: tSchedule("event"),
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="glass border-slate-800 h-fit">
        <CardHeader>
          <CardTitle>{isEditing ? t("editScheduleEvent") : t("newScheduleEvent")}</CardTitle>
          <CardDescription>{t("scheduleFormDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{t("projectTitle")}</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-slate-900/50 border-slate-800" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{t("projectTitleFa")}</Label>
              <Input dir="rtl" value={form.titleFa} onChange={(e) => setForm({ ...form, titleFa: e.target.value })} className="bg-slate-900/50 border-slate-800" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{isFa ? "نوع" : "Type"}</Label>
              <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
                <SelectTrigger className="bg-slate-900/50 border-slate-800"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="WORKSHOP">{tSchedule("workshop")}</SelectItem>
                  <SelectItem value="DEADLINE">{tSchedule("deadline")}</SelectItem>
                  <SelectItem value="PRESENTATION">{tSchedule("presentation")}</SelectItem>
                  <SelectItem value="MEETING">{tSchedule("meeting")}</SelectItem>
                  <SelectItem value="EVENT">{tSchedule("event")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{isFa ? "تاریخ و ساعت" : "Date & Time"}</Label>
              <Input
                type="datetime-local"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="bg-slate-900/50 border-slate-800"
                dir="ltr"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>{isFa ? "مکان (انگلیسی)" : "Location (English)"}</Label>
              <Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-slate-900/50 border-slate-800" />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{isFa ? "مکان (فارسی)" : "Location (Persian)"}</Label>
              <Input dir="rtl" value={form.locationFa} onChange={(e) => setForm({ ...form, locationFa: e.target.value })} className="bg-slate-900/50 border-slate-800" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>{t("projectDescription")}</Label>
            <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-slate-900/50 border-slate-800" />
          </div>
          <div className="flex gap-2 mt-2">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="bg-purple-600 hover:bg-purple-700 text-white flex-1">
              {isEditing ? <Pencil className="w-4 h-4 me-2" /> : <Plus className="w-4 h-4 me-2" />}
              {isEditing ? t("saveChanges") : t("addEvent")}
            </Button>
            {isEditing && (
              <Button variant="outline" onClick={resetForm} className="border-slate-800">
                {t("cancelEdit")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="glass border-slate-800 h-fit">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-purple-400" /> {t("scheduleTab")}</CardTitle>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">{t("noScheduleEvents")}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {events.map((ev) => (
                <div key={ev.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-800/60 bg-slate-900/20">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white truncate" dir="auto">
                        {isFa && ev.titleFa ? ev.titleFa : ev.title}
                      </p>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-cyan-400 shrink-0">{typeLabel[ev.type] || ev.type}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 font-sans" dir="ltr">{format(new Date(ev.date), "yyyy/MM/dd HH:mm")}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-cyan-400" onClick={() => startEdit(ev)}>
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-slate-400 hover:text-red-400" disabled={isSubmitting} onClick={() => handleDelete(ev.id)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
