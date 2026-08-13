"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X, Crown, Users } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

export interface AdminTeamData {
  id: string;
  name: string;
  nameFa: string | null;
  status: string;
  leader: { name: string | null; nameFa: string | null };
  members: { id: string; user: { name: string | null; nameFa: string | null } }[];
}

interface AdminTeamsPanelProps {
  teams: AdminTeamData[];
}

export function AdminTeamsPanel({ teams }: AdminTeamsPanelProps) {
  const t = useTranslations("Dashboard");
  const tTeams = useTranslations("Teams");
  const locale = useLocale();
  const isFa = locale === "fa";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pendingTeams = teams.filter((tm) => tm.status === "PENDING");
  const reviewedTeams = teams.filter((tm) => tm.status !== "PENDING");

  const respond = async (teamId: string, status: "APPROVED" | "REJECTED") => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/teams", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ teamId, status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      PENDING: "bg-yellow-500/10 text-yellow-400",
      APPROVED: "bg-green-500/10 text-green-400",
      REJECTED: "bg-red-500/10 text-red-400",
    };
    const labelMap: Record<string, string> = {
      PENDING: tTeams("statusPending"),
      APPROVED: tTeams("statusApproved"),
      REJECTED: tTeams("statusRejected"),
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status]}`}>
        {labelMap[status]}
      </span>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="glass border-slate-800">
        <CardHeader>
          <CardTitle>{t("pendingTeamApprovals")}</CardTitle>
          <CardDescription>{t("pendingTeamApprovalsDesc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingTeams.length === 0 ? (
            <div className="p-8 text-center text-slate-500">{t("noPendingTeams")}</div>
          ) : (
            <div className="flex flex-col gap-3">
              {pendingTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg border border-slate-800 bg-slate-900/40"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-white" dir="auto">{team.name}</h4>
                      {team.nameFa && <span className="text-sm text-slate-400" dir="rtl">({team.nameFa})</span>}
                    </div>
                    <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                      <Crown className="w-3.5 h-3.5 text-yellow-500" />
                      <span dir="auto">
                        {isFa && team.leader.nameFa ? team.leader.nameFa : team.leader.name}
                      </span>
                      <span className="mx-1">•</span>
                      <Users className="w-3.5 h-3.5" />
                      {team.members.length} {tTeams("members")}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => respond(team.id, "APPROVED")}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Check className="w-4 h-4 me-1" /> {t("approve")}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => respond(team.id, "REJECTED")}
                      className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    >
                      <X className="w-4 h-4 me-1" /> {t("reject")}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="glass border-slate-800">
        <CardHeader>
          <CardTitle>{t("allTeams")}</CardTitle>
        </CardHeader>
        <CardContent>
          {reviewedTeams.length === 0 ? (
            <div className="p-8 text-center text-slate-500">{t("noApps")}</div>
          ) : (
            <div className="flex flex-col gap-2">
              {reviewedTeams.map((team) => (
                <div
                  key={team.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-slate-900/20"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-slate-800 text-cyan-400 text-xs">
                        {team.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-white" dir="auto">{team.name}</p>
                      <p className="text-xs text-slate-500">{team.members.length} {tTeams("members")}</p>
                    </div>
                  </div>
                  {statusBadge(team.status)}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
