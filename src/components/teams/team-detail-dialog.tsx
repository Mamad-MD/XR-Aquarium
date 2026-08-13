"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Crown, Users, Check, X, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import type { TeamWithRelations } from "./teams-client";

interface TeamDetailDialogProps {
  team: TeamWithRelations | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string | null;
  currentTeamId: string | null;
  onSuccess: () => void;
}

export function TeamDetailDialog({
  team,
  isOpen,
  onClose,
  currentUserId,
  currentTeamId,
  onSuccess,
}: TeamDetailDialogProps) {
  const t = useTranslations("Teams");
  const locale = useLocale();
  const isFa = locale === "fa";
  const { status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!team) return null;

  const isLeader = team.leaderId === currentUserId;
  const isMember = team.members.some((m) => m.userId === currentUserId);
  const myPendingRequest = team.joinRequests.find(
    (r) => r.userId === currentUserId && r.status === "PENDING"
  );
  const canRequestJoin =
    currentUserId && !currentTeamId && !isMember && !myPendingRequest;

  const handleJoinRequest = async () => {
    if (status === "unauthenticated") {
      toast.error(t("loginRequired"));
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teams/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId: team.id }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("requestError"));
        return;
      }
      toast.success(data.message || t("requestSuccess"));
      router.refresh();
      onSuccess();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLeave = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teams/leave", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("leaveError"));
        return;
      }
      toast.success(data.message || t("leaveSuccess"));
      router.refresh();
      onSuccess();
      onClose();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const respondToRequest = async (
    requestId: string,
    responseStatus: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teams/join/respond", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status: responseStatus }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("respondError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
      onSuccess();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-full sm:max-w-[600px] bg-gray-950/90 border-white/10 backdrop-blur-xl overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
            <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Users className="w-3.5 h-3.5 me-1" /> {team.members.length}{" "}
              {t("members")}
            </Badge>
            {isLeader && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Crown className="w-3.5 h-3.5 me-1" /> {t("youAreLeader")}
              </Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold gradient-text">
            {team.name}
          </DialogTitle>
          {team.nameFa && (
            <p className="text-sm text-gray-400 font-medium" dir="rtl">
              {team.nameFa}
            </p>
          )}
          {team.description && (
            <p className="text-base text-gray-300 mt-4 leading-relaxed">
              {team.description}
            </p>
          )}
        </DialogHeader>

        <ScrollArea className="max-h-[45vh] mt-4 pe-4">
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> {t("membersList")}
              </h4>
              <div className="flex flex-col gap-2">
                {team.members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-slate-800 text-cyan-400">
                          {(m.user.name || "?").charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-sm font-medium text-white" dir="auto">
                        {isFa && m.user.nameFa ? m.user.nameFa : m.user.name}
                      </p>
                    </div>
                    {m.userId === team.leaderId && (
                      <Crown className="w-4 h-4 text-yellow-500 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {isLeader && team.joinRequests.length > 0 && (
              <div>
                <h4 className="text-lg font-semibold text-cyan-400 mb-3">
                  {t("pendingRequests")}
                </h4>
                <div className="flex flex-col gap-2">
                  {team.joinRequests.map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between bg-white/5 border border-white/10 rounded-lg p-3"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className="bg-slate-800 text-purple-400">
                            {(r.user.name || "?").charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-white" dir="auto">
                          {isFa && r.user.nameFa ? r.user.nameFa : r.user.name}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                          disabled={isSubmitting}
                          onClick={() => respondToRequest(r.id, "ACCEPTED")}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                          disabled={isSubmitting}
                          onClick={() => respondToRequest(r.id, "REJECTED")}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="mt-6 flex justify-end gap-2 flex-wrap">
          {isMember && (
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={handleLeave}
              className="border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4 me-2" />
              {isLeader ? t("disbandTeam") : t("leaveTeam")}
            </Button>
          )}
          {myPendingRequest && (
            <Button disabled variant="secondary" className="bg-yellow-500/10 text-yellow-400">
              {t("requestPending")}
            </Button>
          )}
          {canRequestJoin && (
            <Button
              onClick={handleJoinRequest}
              disabled={isSubmitting}
              className="bg-cyan-600 hover:bg-cyan-500 text-white"
            >
              {isSubmitting ? t("requesting") : t("requestToJoin")}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
