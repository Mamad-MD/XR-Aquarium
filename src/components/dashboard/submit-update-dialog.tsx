"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface SubmitUpdateDialogProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}

export function SubmitUpdateDialog({ isOpen, onClose, projectId }: SubmitUpdateDialogProps) {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error(t("updateContentRequired"));
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/projects/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, content }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message || t("updateSubmitted"));
      setContent("");
      router.refresh();
      onClose();
    } catch (error) {
      toast.error(t("unexpectedError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full sm:max-w-[500px] bg-gray-950/90 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">{t("submitUpdate")}</DialogTitle>
          <DialogDescription className="text-zinc-400">{t("submitUpdateDesc")}</DialogDescription>
        </DialogHeader>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-purple-500 mt-2"
          placeholder={t("updateContentPlaceholder")}
        />
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-white/10">
            {t("cancelEdit")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            {isSubmitting ? t("creating") : t("submitUpdate")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
