"use client"

import { useState } from "react";
import { Project as PrismaProject, User } from "@prisma/client";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, Users, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";

interface ProjectDetailDialogProps {
  project: (PrismaProject & { mentor: User }) | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailDialog({ project, isOpen, onClose }: ProjectDetailDialogProps) {
  const { data: session, status } = useSession();
  const [isApplying, setIsApplying] = useState(false);
  const router = useRouter();

  if (!project) return null;

  // Mock enrolledCount for now as it's not in Prisma schema
  const enrolledCount = 0;
  const isFull = enrolledCount >= project.maxCapacity;

  // We rely on the API to catch if already applied, but we can do a basic check if we had that data.
  // For simplicity based on instructions, we'll just let the API handle the error.

  const handleSelect = async () => {
    if (status === "unauthenticated" || !session) {
      toast.error("Please login to select a project");
      return;
    }
    if (session.user?.role !== 'PARTICIPANT') {
      toast.error("Only participants can apply for projects");
      return;
    }

    try {
      setIsApplying(true);
      const response = await fetch('/api/projects/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ projectId: project.id }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        toast.error(errorText || "Failed to apply for project");
        return;
      }

      toast.success(`Successfully applied to ${project.title}`);
      router.refresh();
      onClose();
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsApplying(false);
    }
  };

  const categoryColorMap: Record<string, string> = {
    VR: "vr",
    AR: "ar",
    MR: "mr",
    XR: "xr",
    Metaverse: "metaverse"
  };

  // Parse objectives
  let parsedObjectives: string[] = [];
  try {
    if (project.objectives) {
      parsedObjectives = JSON.parse(project.objectives);
      if (!Array.isArray(parsedObjectives)) parsedObjectives = [project.objectives];
    }
  } catch {
    parsedObjectives = project.objectives ? project.objectives.split('\n').filter(Boolean) : [];
  }

  // Parse techStack
  let parsedTechStack: string[] = [];
  try {
    parsedTechStack = JSON.parse(project.techStack);
    if (!Array.isArray(parsedTechStack)) parsedTechStack = [project.techStack];
  } catch {
    parsedTechStack = project.techStack.split(',').map(s => s.trim());
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-gray-950/90 border-white/10 backdrop-blur-xl">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <Badge variant={categoryColorMap[project.category] as any || "default"}>
              {project.category}
            </Badge>
            <Badge variant={
              project.difficulty === 'Beginner' ? 'default' :
              project.difficulty === 'Intermediate' ? 'secondary' : 'destructive'
            }>
              {project.difficulty}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold gradient-text">{project.title}</DialogTitle>
          <p className="text-sm text-gray-400 font-medium">{project.titleFa}</p>
          <DialogDescription className="text-base text-gray-300 mt-4 leading-relaxed">
            {project.description}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] mt-4 pe-4">
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" /> Objectives
              </h4>
              <ul className="space-y-2">
                {parsedObjectives.map((obj, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                    <ArrowRight className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> Capacity & Mentor
              </h4>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Enrolled ({enrolledCount}/{project.maxCapacity})</span>
                    <span className={isFull ? "text-red-400 font-medium" : "text-green-400 font-medium"}>
                      {isFull ? 'Full' : `${project.maxCapacity - enrolledCount} spots left`}
                    </span>
                  </div>
                  <Progress value={(enrolledCount / project.maxCapacity) * 100} className="h-2" />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Duration:</span>
                  <span className="flex items-center gap-1 text-gray-200">
                    <Clock className="w-4 h-4" /> {project.duration}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {parsedTechStack.map(tech => (
                  <Badge key={tech} variant="outline" className="bg-black/50">{tech}</Badge>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="mt-6 flex justify-end">
          {isFull ? (
            <Button disabled variant="destructive">
              Project is Full
            </Button>
          ) : (
            <Button
              onClick={handleSelect}
              disabled={isApplying}
              className="bg-cyan-600 hover:bg-cyan-500 text-white neon-cyan"
            >
              {isApplying ? "Applying..." : "Apply for Project"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
