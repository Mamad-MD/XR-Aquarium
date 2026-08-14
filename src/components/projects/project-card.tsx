"use client";

import { motion } from "framer-motion";
import { Users, Clock, ArrowRight, Layers, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslations, useLocale } from "next-intl";
import type { ProjectWithTeam } from "./projects-client";

interface ProjectCardProps {
  project: ProjectWithTeam;
  onViewDetails: () => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const t = useTranslations('Projects');
  const locale = useLocale();
  const isFa = locale === 'fa';

  const categoryVariant = project.category.toLowerCase() ;
  const isAssigned = !!project.assignedTeam;

  const neonClass = {
    VR: "hover:neon-green",
    AR: "hover:neon-blue",
    MR: "hover:neon-purple",
    XR: "hover:neon-cyan",
    Metaverse: "hover:neon-pink"
  }[project.category] || "hover:neon-cyan";

  const difficultyColor = {
    Beginner: "text-green-400 border-green-400/30",
    Intermediate: "text-yellow-400 border-yellow-400/30",
    Advanced: "text-red-400 border-red-400/30"
  }[project.difficulty];

  const statusColor = isAssigned
    ? "bg-blue-500"
    : {
        'OPEN': "bg-green-500",
        'FULL': "bg-red-500",
        'IN_PROGRESS': "bg-yellow-500",
        'COMPLETED': "bg-blue-500"
      }[project.status] || "bg-green-500";

  // Parse techStack if it's a JSON string, or split if it's comma-separated
  let parsedTechStack: string[] = [];
  try {
    parsedTechStack = JSON.parse(project.techStack);
    if (!Array.isArray(parsedTechStack)) parsedTechStack = [project.techStack];
  } catch {
    parsedTechStack = project.techStack.split(',').map(s => s.trim());
  }

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`glass rounded-xl overflow-hidden border border-white/10 flex flex-col h-full transition-all duration-300 ${neonClass}`}
    >
      <div className="relative h-48 w-full bg-zinc-900 border-b border-white/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
        <img 
          src={project.thumbnailUrl || ""} 
          alt={project.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute top-4 end-4 z-20 flex gap-2">
          <div className={`w-3 h-3 rounded-full ${statusColor} shadow-lg shadow-black`} title={project.status} />
        </div>
        <div className="absolute top-4 start-4 z-20">
          <Badge variant={categoryVariant as any}>{project.category}</Badge>
        </div>
        <div className="absolute bottom-4 start-4 end-4 z-20">
          <h3 className="text-lg font-bold text-white leading-tight">{project.title}</h3>
          <p className="text-sm text-zinc-400 font-medium" dir="rtl">{project.titleFa}</p>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className={`bg-black/30 ${difficultyColor}`}>
            {project.difficulty}
          </Badge>
          <div className="flex items-center text-zinc-400 text-sm">
            <Clock className="w-4 h-4 me-1" />
            {project.duration}
          </div>
        </div>

        <p className="text-sm text-zinc-300 line-clamp-2 mb-4 flex-1">
          {project.description}
        </p>

        <div className="mb-4">
          <div className="flex items-center mb-2">
            <Layers className="w-4 h-4 me-2 text-zinc-400" />
            <span className="text-xs text-zinc-400 font-medium">{t('techStack')}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {parsedTechStack.slice(0, 3).map((tech, index) => (
              <span key={index} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                <span dir="ltr" className="inline-block">{tech}</span>
              </span>
            ))}
            {parsedTechStack.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-400">
                <span dir="ltr" className="inline-block">+{parsedTechStack.length - 3}</span>
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          {isAssigned ? (
            <div className="flex items-center gap-2 text-sm bg-blue-500/10 border border-blue-500/20 rounded-lg px-3 py-2">
              <UsersRound className="w-4 h-4 text-blue-400 shrink-0" />
              <span className="text-blue-400 truncate" dir="auto">
                {t('assignedTo')}: {isFa && project.assignedTeam?.nameFa ? project.assignedTeam.nameFa : project.assignedTeam?.name}
              </span>
            </div>
          ) : (
            <div className="flex items-center text-xs text-zinc-400">
              <Users className="w-3.5 h-3.5 me-1.5" />
              {t('requiredMembers', { count: project.maxCapacity })}
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-auto">
          <Button
            variant="secondary"
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none"
            onClick={onViewDetails}
          >
            {t('viewDetails')}
            <ArrowRight className="w-4 h-4 ms-2" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
