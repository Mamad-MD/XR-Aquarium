"use client";

import { motion } from "framer-motion";
import { Users, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useTranslations, useLocale } from "next-intl";
import type { TeamWithRelations } from "./teams-client";

interface TeamCardProps {
  team: TeamWithRelations;
  currentUserId: string | null;
  currentTeamId: string | null;
  onViewDetails: () => void;
}

export function TeamCard({
  team,
  currentUserId,
  currentTeamId,
  onViewDetails,
}: TeamCardProps) {
  const t = useTranslations("Teams");
  const locale = useLocale();
  const isFa = locale === "fa";

  const isMyTeam = team.id === currentTeamId;
  const isLeader = team.leaderId === currentUserId;

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col h-full transition-all duration-300 hover:neon-cyan p-5"
    >
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-white leading-tight truncate">
            {team.name}
          </h3>
          {team.nameFa && (
            <p className="text-sm text-zinc-400 font-medium truncate" dir="rtl">
              {team.nameFa}
            </p>
          )}
        </div>
        {isMyTeam && (
          <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shrink-0">
            {isLeader ? t("youAreLeader") : t("yourTeam")}
          </Badge>
        )}
      </div>

      {team.description && (
        <p className="text-sm text-zinc-300 line-clamp-2 mb-4 flex-1">
          {team.description}
        </p>
      )}

      <div className="flex items-center justify-between mb-4 text-sm">
        <div className="flex items-center text-zinc-400">
          <Users className="w-4 h-4 me-1" />
          {team.members.length} {t("members")}
        </div>
        <div className="flex items-center text-zinc-400 text-xs gap-1 min-w-0">
          <Crown className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
          <span dir="auto" className="truncate">
            {isFa && team.leader.nameFa ? team.leader.nameFa : team.leader.name}
          </span>
        </div>
      </div>

      <div className="flex -space-x-2 rtl:space-x-reverse mb-4">
        {team.members.slice(0, 5).map((m) => (
          <Avatar key={m.id} className="w-8 h-8 border-2 border-black">
            <AvatarFallback className="bg-slate-800 text-cyan-400 text-xs">
              {(m.user.name || "?").charAt(0)}
            </AvatarFallback>
          </Avatar>
        ))}
        {team.members.length > 5 && (
          <div className="w-8 h-8 rounded-full bg-white/10 border-2 border-black flex items-center justify-center text-xs text-zinc-300">
            +{team.members.length - 5}
          </div>
        )}
      </div>

      <Button
        variant="secondary"
        className="w-full bg-white/10 hover:bg-white/20 text-white border-none mt-auto"
        onClick={onViewDetails}
      >
        {t("viewDetails")}
      </Button>
    </motion.div>
  );
}
