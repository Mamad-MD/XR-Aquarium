"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

export interface AdminResourceItem {
  id: string;
  title: string;
  url: string;
  fileSize: number;
  uploadedById: string;
}

interface AdminFilesPanelProps {
  resources: AdminResourceItem[];
  currentUserId: string;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function AdminFilesPanel({ resources, currentUserId }: AdminFilesPanelProps) {
  const t = useTranslations("Dashboard");
  const tFiles = useTranslations("Files");
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      toast.error(tFiles("fileRequired"));
      return;
    }
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title || file.name);
      const response = await fetch("/api/resources/upload", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message || tFiles("uploadSuccess"));
      setTitle("");
      setFile(null);
      router.refresh();
    } catch (e) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resourceId: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/resources", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId }),
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

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card className="glass border-slate-800 h-fit">
        <CardHeader>
          <CardTitle>{tFiles("addGeneral")}</CardTitle>
          <CardDescription>{tFiles("addGeneralDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>{tFiles("fileTitle")}</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="bg-slate-900/50 border-slate-800" />
          </div>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-slate-400 file:me-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-slate-800 file:text-slate-300 hover:file:bg-slate-700 file:cursor-pointer"
          />
          <Button onClick={handleUpload} disabled={isUploading} className="bg-purple-600 hover:bg-purple-700 text-white">
            <Upload className="w-4 h-4 me-2" /> {isUploading ? tFiles("uploading") : tFiles("upload")}
          </Button>
        </CardContent>
      </Card>

      <Card className="glass border-slate-800 h-fit">
        <CardHeader>
          <CardTitle>{tFiles("generalFiles")}</CardTitle>
        </CardHeader>
        <CardContent>
          {resources.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-sm">{tFiles("noFiles")}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {resources.map((r) => (
                <div key={r.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-slate-800/60 bg-slate-900/20">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className="w-4 h-4 text-cyan-400 shrink-0" />
                    <a href={r.url} download target="_blank" rel="noopener noreferrer" className="text-sm text-slate-200 hover:text-cyan-400 truncate" dir="auto">
                      {r.title}
                    </a>
                    <span className="text-xs text-slate-500 font-sans shrink-0" dir="ltr">({formatFileSize(r.fileSize)})</span>
                  </div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-7 w-7 text-slate-500 hover:text-red-400 hover:bg-red-400/10 shrink-0"
                    disabled={isSubmitting}
                    onClick={() => handleDelete(r.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
