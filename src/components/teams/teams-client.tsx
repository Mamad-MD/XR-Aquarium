"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TeamCard } from "@/components/teams/team-card";
import { TeamDetailDialog } from "@/components/teams/team-detail-dialog";
import { CreateTeamDialog } from "@/components/teams/create-team-dialog";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import type { User } from "@prisma/client";

export interface TeamMemberWithUser {
  id: string;
  userId: string;
  teamId: string;
  joinedAt: string;
  user: User;
}

export interface TeamJoinRequestWithUser {
  id: string;
  userId: string;
  teamId: string;
  status: string;
  message: string | null;
  createdAt: string;
  reviewedAt: string | null;
  user: User;
}

export interface TeamWithRelations {
  id: string;
  name: string;
  nameFa: string | null;
  description: string | null;
  leaderId: string;
  createdAt: string;
  updatedAt: string;
  leader: User;
  members: TeamMemberWithUser[];
  joinRequests: TeamJoinRequestWithUser[];
}

interface TeamsClientProps {
  initialTeams: TeamWithRelations[];
  currentUserId: string | null;
  currentTeamId: string | null;
}

export function TeamsClient({
  initialTeams,
  currentUserId,
  currentTeamId,
}: TeamsClientProps) {
  const t = useTranslations("Teams");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<TeamWithRelations | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredTeams = initialTeams.filter((team) => {
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    return (
      team.name.toLowerCase().includes(q) ||
      (team.nameFa && team.nameFa.includes(searchQuery)) ||
      team.members.some(
        (m) =>
          (m.user.name || "").toLowerCase().includes(q) ||
          (m.user.nameFa || "").includes(searchQuery)
      )
    );
  });

  const handleSuccess = () => {
    router.refresh();
  };

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex flex-col items-center mb-12 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("title")}
        </motion.h1>
        <motion.p
          className="text-zinc-500 max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("subtitle")}
        </motion.p>
      </div>

      <motion.div
        className="glass-strong rounded-xl p-4 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="relative w-full md:w-96">
          <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder={t("searchTeams")}
            className="ps-9 bg-white/5 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {currentUserId && !currentTeamId && (
          <Button
            className="bg-cyan-600 hover:bg-cyan-500 text-white w-full md:w-auto"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="w-4 h-4 me-2" />
            {t("createTeam")}
          </Button>
        )}
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredTeams.map((team) => (
            <motion.div
              key={team.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <TeamCard
                team={team}
                currentUserId={currentUserId}
                currentTeamId={currentTeamId}
                onViewDetails={() => setSelectedTeam(team)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredTeams.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-500">
            {t("noTeams")}
          </div>
        )}
      </motion.div>

      <TeamDetailDialog
        team={selectedTeam}
        isOpen={!!selectedTeam}
        onClose={() => setSelectedTeam(null)}
        currentUserId={currentUserId}
        currentTeamId={currentTeamId}
        onSuccess={handleSuccess}
      />

      <CreateTeamDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
