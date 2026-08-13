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
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface CreateTeamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateTeamDialog({
  isOpen,
  onClose,
  onSuccess,
}: CreateTeamDialogProps) {
  const t = useTranslations("Teams");
  const [name, setName] = useState("");
  const [nameFa, setNameFa] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error(t("teamNameRequired"));
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, nameFa, description }),
      });

      let data: { message?: string } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        toast.error(data.message || t("createError"));
        return;
      }

      toast.success(data.message || t("createSuccess"));
      setName("");
      setNameFa("");
      setDescription("");
      onSuccess();
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
      <DialogContent className="max-w-full sm:max-w-[480px] bg-gray-950/90 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold gradient-text">
            {t("createTeam")}
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            {t("createTeamDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 mt-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="team-name">{t("teamName")}</Label>
            <Input
              id="team-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-white/5 border-white/10"
              placeholder="Nova Squad"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="team-name-fa">{t("teamNameFa")}</Label>
            <Input
              id="team-name-fa"
              dir="rtl"
              value={nameFa}
              onChange={(e) => setNameFa(e.target.value)}
              className="bg-white/5 border-white/10"
              placeholder="تیم نووا"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="team-desc">{t("teamDescription")}</Label>
            <textarea
              id="team-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-md bg-white/5 border border-white/10 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              placeholder={t("teamDescriptionPlaceholder")}
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} className="border-white/10">
            {t("cancel")}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-cyan-600 hover:bg-cyan-500 text-white"
          >
            {isSubmitting ? t("creating") : t("createTeam")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
