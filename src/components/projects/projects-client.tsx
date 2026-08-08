"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDetailDialog } from "@/components/projects/project-detail-dialog";
import { Project as PrismaProject, User } from "@prisma/client";

// Update the props interface to match what Prisma returns
interface ProjectsClientProps {
  initialProjects: (PrismaProject & { mentor: User })[];
}

export function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [activeDifficulty, setActiveDifficulty] = useState<string>("All");
  const [selectedProject, setSelectedProject] = useState<(PrismaProject & { mentor: User }) | null>(null);

  const filteredProjects = initialProjects.filter((project) => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (project.titleFa && project.titleFa.includes(searchQuery));
    const matchesCategory = activeCategory === "All" || project.category === activeCategory;
    const matchesDifficulty = activeDifficulty === "All" || project.difficulty === activeDifficulty;

    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex flex-col items-center mb-12 text-center">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Project Hub
        </motion.h1>
        <motion.p 
          className="text-xl text-zinc-400 mb-2 font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          مرکز پروژه‌ها
        </motion.p>
        <motion.p 
          className="text-zinc-500 max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Explore 20+ cutting-edge XR projects
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
            placeholder="Search projects..." 
            className="ps-9 bg-white/5 border-white/10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Tabs
          defaultValue="All"
          className="w-full md:w-auto overflow-x-auto"
          onValueChange={(v) => setActiveCategory(v)}
        >
          <TabsList className="bg-white/5 border border-white/10">
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="VR">VR</TabsTrigger>
            <TabsTrigger value="AR">AR</TabsTrigger>
            <TabsTrigger value="MR">MR</TabsTrigger>
            <TabsTrigger value="XR">XR</TabsTrigger>
            <TabsTrigger value="Metaverse">Metaverse</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="w-full md:w-48">
          <Select value={activeDifficulty} onValueChange={(v) => setActiveDifficulty(v)}>
            <SelectTrigger className="bg-white/5 border-white/10">
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Levels</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
          }
        }}
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <ProjectCard 
                project={project} 
                onViewDetails={() => setSelectedProject(project)} 
              />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredProjects.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-500">
            No projects found matching your criteria.
          </div>
        )}
      </motion.div>

      <ProjectDetailDialog 
        project={selectedProject} 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
      />
    </div>
  );
}
