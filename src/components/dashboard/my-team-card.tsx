"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Crown, Check, X, LogOut, UsersRound, Package, Boxes } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

interface TeamMemberData {
  id: string;
  userId: string;
  user: { name?: string | null; nameFa?: string | null };
}

interface TeamJoinRequestData {
  id: string;
  userId: string;
  user: { name?: string | null; nameFa?: string | null };
}

interface AssignedEquipmentData {
  id: string;
  quantity: number;
  equipment: { name: string; nameFa?: string | null };
}

export interface MyTeamData {
  id: string;
  name: string;
  nameFa?: string | null;
  description?: string | null;
  leaderId: string;
  status: string;
  members: TeamMemberData[];
  joinRequests: TeamJoinRequestData[];
  assignedEquipment: AssignedEquipmentData[];
}

interface MyTeamCardProps {
  team: MyTeamData | null;
  currentUserId: string;
  assignedProject?: { id: string; title: string; titleFa?: string | null } | null;
}

export function MyTeamCard({ team, currentUserId, assignedProject }: MyTeamCardProps) {
  const t = useTranslations("Dashboard");
  const tTeams = useTranslations("Teams");
  const tEquip = useTranslations("Equipment");
  const locale = useLocale();
  const isFa = locale === "fa";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!team) {
    return (
      <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-slate-800">
        <UsersRound className="w-16 h-16 text-slate-600 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t("noTeamYet")}</h3>
        <p className="text-slate-400 mb-6 max-w-md mx-auto leading-relaxed">
          {t("noTeamDesc")}
        </p>
        <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]">
          <Link href="/teams">{t("browseTeams")}</Link>
        </Button>
      </div>
    );
  }

  const isLeader = team.leaderId === currentUserId;

  const statusBadge: Record<string, { label: string; className: string }> = {
    PENDING: { label: tTeams("statusPending"), className: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" },
    APPROVED: { label: tTeams("statusApproved"), className: "bg-green-500/10 text-green-400 border border-green-500/30" },
    REJECTED: { label: tTeams("statusRejected"), className: "bg-red-500/10 text-red-400 border border-red-500/30" },
  };

  const handleLeave = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teams/leave", { method: "POST" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || tTeams("leaveError"));
        return;
      }
      toast.success(data.message || tTeams("leaveSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(tTeams("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const respondToRequest = async (
    requestId: string,
    status: "ACCEPTED" | "REJECTED"
  ) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/teams/join/respond", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || tTeams("respondError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      toast.error(tTeams("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const releaseEquipment = async (requestId: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/equipment/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || tEquip("releaseError"));
        return;
      }
      toast.success(data.message || tEquip("releaseSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(tEquip("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="glass-strong border-cyan-500/20">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              {team.name}
            </CardTitle>
            {team.nameFa && (
              <CardDescription dir="rtl" className="mt-1">{team.nameFa}</CardDescription>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge className={statusBadge[team.status]?.className}>
              {statusBadge[team.status]?.label}
            </Badge>
            {isLeader && (
              <Badge className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                <Crown className="w-3.5 h-3.5 me-1" /> {tTeams("youAreLeader")}
              </Badge>
            )}
          </div>
        </div>
        {team.description && (
          <p className="text-slate-400 text-sm mt-3 leading-relaxed">{team.description}</p>
        )}
        {assignedProject && (
          <div className="flex items-center gap-2 mt-3 text-sm bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
            <Boxes className="w-4 h-4 text-blue-400 shrink-0" />
            <span className="text-blue-400" dir="auto">
              {tTeams("assignedProject")}: {isFa && assignedProject.titleFa ? assignedProject.titleFa : assignedProject.title}
            </span>
          </div>
        )}
        {isLeader && team.status === "PENDING" && (
          <p className="text-sm text-yellow-400 mt-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-3">
            {tTeams("pendingApprovalNotice")}
          </p>
        )}
        {isLeader && team.status === "REJECTED" && (
          <p className="text-sm text-red-400 mt-3 bg-red-500/5 border border-red-500/20 rounded-lg p-3">
            {tTeams("rejectedNotice")}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div>
          <p className="text-sm text-slate-400 mb-3">{tTeams("membersList")}</p>
          <div className="flex flex-col gap-2">
            {team.members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-lg p-3"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-slate-800 text-cyan-400 text-xs">
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
            <p className="text-sm text-slate-400 mb-3">{tTeams("pendingRequests")}</p>
            <div className="flex flex-col gap-2">
              {team.joinRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-lg p-3"
                >
                  <p className="text-sm font-medium text-white" dir="auto">
                    {isFa && r.user.nameFa ? r.user.nameFa : r.user.name}
                  </p>
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

        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-400 flex items-center gap-2">
              <Package className="w-4 h-4" /> {tEquip("assignedEquipment")}
            </p>
            <Button asChild variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300 h-auto p-0">
              <Link href="/equipment">{tEquip("browseEquipment")}</Link>
            </Button>
          </div>
          {team.assignedEquipment.length === 0 ? (
            <p className="text-sm text-slate-500 bg-slate-900/30 border border-slate-800 rounded-lg p-3">
              {tEquip("noAssigned")}
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {team.assignedEquipment.map((eq) => (
                <div
                  key={eq.id}
                  className="flex items-center justify-between bg-slate-900/50 border border-slate-800 rounded-lg p-3"
                >
                  <p className="text-sm font-medium text-white" dir="auto">
                    {isFa && eq.equipment.nameFa ? eq.equipment.nameFa : eq.equipment.name}{" "}
                    <span className="text-slate-500 font-sans">× {eq.quantity}</span>
                  </p>
                  {isLeader && (
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => releaseEquipment(eq.id)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      {tEquip("release")}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end border-t border-slate-800/50 pt-4">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={handleLeave}
            className="border-red-500/30 text-red-400 hover:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 me-2" />
            {isLeader ? tTeams("disbandTeam") : tTeams("leaveTeam")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
