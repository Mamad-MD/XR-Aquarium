"use client";

import { motion } from "framer-motion";
import { Users, Clock, ArrowRight, Layers } from "lucide-react";
import { Project as PrismaProject, User } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/lib/store";

interface ProjectCardProps {
  project: PrismaProject & { mentor: User };
  onViewDetails: () => void;
}

export function ProjectCard({ project, onViewDetails }: ProjectCardProps) {
  const { user, isAuthenticated, selectProject } = useAppStore();

  const categoryVariant = project.category.toLowerCase() as any;
  // TODO: Fetch enrolled count dynamically if needed. For now, mocking it to 0 as it's not in schema
  const enrolledCount = 0;
  const progress = (enrolledCount / project.maxCapacity) * 100;

  const isStudent = user?.role === 'student';
  const hasSelectedProject = !!user?.selectedProjectId;
  const isOpen = project.status === 'open';
  
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

  const statusColor = {
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
          <Badge variant={categoryVariant}>{project.category}</Badge>
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
            <span className="text-xs text-zinc-400 font-medium">Tech Stack</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {parsedTechStack.slice(0, 3).map(tech => (
              <span key={tech} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                {tech}
              </span>
            ))}
            {parsedTechStack.length > 3 && (
              <span className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10 text-zinc-400">
                +{parsedTechStack.length - 3}
              </span>
            )}
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-xs text-zinc-400 mb-2">
            <span className="flex items-center"><Users className="w-3 h-3 me-1" /> Capacity</span>
            <span>{enrolledCount} / {project.maxCapacity}</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        <div className="flex gap-2 mt-auto">
          <Button 
            variant="secondary" 
            className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none"
            onClick={onViewDetails}
          >
            View Details
          </Button>
          
          {isAuthenticated && isStudent && isOpen && !hasSelectedProject && (
            <Button 
              className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white"
              onClick={() => {
                selectProject(project.id);
                // Would normally show toast here
              }}
            >
              Select
              <ArrowRight className="w-4 h-4 ms-2" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
