"use client"

import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, Boxes, Calendar, FileText, Download,
  Bell, Clock, AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { format } from "date-fns";

export function StudentDashboard({ user, data }: { user: { name?: string | null, email?: string | null, image?: string | null, id?: string | null }, data: { announcements?: Array<{ id: string, title: string, content: string, priority: string, createdAt: string }>, projectApplications?: Array<{ status: string, project: Record<string, unknown> }> } }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (!user || !data) return null;

  const announcements = data.announcements || [];

  // Find accepted project or default to first one
  const acceptedApp = data.projectApplications?.find((a: { status: string, project: Record<string, unknown> }) => a.status === 'ACCEPTED');
  const projectApp = acceptedApp || data.projectApplications?.[0];
  const selectedProject = projectApp?.project;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white p-4 md:p-6 gap-6 pt-24">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 glass rounded-xl p-6 flex flex-col gap-8 h-fit sticky top-24"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 rounded-full blur-md opacity-20"></div>
            <Avatar className="w-24 h-24 border-2 border-cyan-500/50">
              <AvatarImage src={user.image || undefined} alt={user.name || "Student"} />
              <AvatarFallback className="bg-slate-800 text-cyan-400 text-2xl">
                {user.name ? user.name.charAt(0) : "S"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{user.name || "XR Student"}</h2>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              ID: {user.id?.slice(0, 8) || "N/A"}
            </div>
          </div>
        </div>

        {/* Desktop Nav is handled by Tabs, this just provides visual structure for the profile */}
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 max-w-6xl"
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-4 w-full md:w-auto md:inline-flex bg-slate-900/50 border border-slate-800 p-1 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <LayoutDashboard className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="project" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Boxes className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">My Project</span>
            </TabsTrigger>
            <TabsTrigger value="schedule" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <Calendar className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="downloads" className="data-[state=active]:bg-cyan-500/20 data-[state=active]:text-cyan-400">
              <FileText className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Downloads</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">
                  Welcome back, <span className="gradient-text">{user.name?.split(' ')[0] || 'Student'}</span>
                </h1>
                <p className="text-slate-400">Here&apos;s what&apos;s happening in the XR Cohort today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center justify-between">
                      Status
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">Active</div>
                    <p className="text-xs text-slate-500 mt-1">XR Development Cohort 4</p>
                  </CardContent>
                </Card>

                <Card className="glass-strong border-purple-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400">Cohort Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white mb-2">Week 4 of 12</div>
                    <Progress value={33} className="h-2 bg-slate-800"  />
                  </CardContent>
                </Card>

                <Card className="glass-strong border-cyan-500/20">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                      <Clock className="w-4 h-4" /> Next Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-xl font-bold text-white truncate">Project Proposal</div>
                    <p className="text-xs text-slate-500 mt-1 text-cyan-400">In 3 days</p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-cyan-400" /> Recent Announcements
                </h3>
                <ScrollArea className="h-[400px] rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className="flex flex-col gap-">
                    {announcements.map((announcement: { id: string, title: string, content: string, priority: string, createdAt: string }) => (
                      <motion.div
                        key={announcement.id}
                        variants={itemVariants}
                        className={`p-4 rounded-lg border ${
                          announcement.priority === 'HIGH' || announcement.priority === 'URGENT'
                            ? 'bg-red-500/10 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                            : 'glass border-slate-800'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-semibold flex items-center gap-2 ${
                            announcement.priority === 'HIGH' || announcement.priority === 'URGENT' ? 'text-red-400' : 'text-cyan-400'
                          }`}>
                            {(announcement.priority === 'HIGH' || announcement.priority === 'URGENT') && <AlertCircle className="w-4 h-4" />}
                            {announcement.title}
                          </h4>
                          <span className="text-xs text-slate-500" dir="ltr">
                            {announcement.createdAt ? format(new Date(announcement.createdAt), 'MMM d, h:mm a') : ''}
                          </span>
                        </div>
                        <p className="text-slate-300 text-sm whitespace-pre-wrap">{announcement.content}</p>
                      </motion.div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="text-center text-slate-500 py-10">
                        No announcements at this time.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="project">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              {selectedProject ? (
                <Card className="glass-strong border-purple-500/30 overflow-hidden relative">
                  <div className="absolute top-0 end-0 p-32 bg-purple-500/10 blur-3xl -z-10 rounded-full"></div>
                  <CardHeader>
                    <CardTitle className="text-2xl neon-purple">{String(selectedProject.title)}</CardTitle>
                    <CardDescription className="text-slate-400">
                      {String(selectedProject.description)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-slate-400">Project Progress</span>
                        <span className="text-purple-400">0%</span>
                      </div>
                      <Progress value={0} className="h-2 bg-slate-800"  />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-sm text-slate-400">Category</p>
                        <p className="text-lg font-medium">{String(selectedProject.category)}</p>
                      </div>
                      <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
                        <p className="text-sm text-slate-400">Status</p>
                        <p className="text-lg font-medium text-green-400">
                          {projectApp.status === "ACCEPTED" ? "Active Team Member" : "Application Pending"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between border-t border-slate-800/50 pt-6">
                    <Button variant="outline" asChild className="border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300">
                      <Link href={`/projects/${selectedProject.id}`}>View Project Details</Link>
                    </Button>
                    {projectApp.status === "ACCEPTED" && (
                      <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                        Submit Update
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ) : (
                <div className="text-center py-20 glass rounded-xl border-dashed border-2 border-slate-800">
                  <Boxes className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Project Selected</h3>
                  <p className="text-slate-400 mb-6 max-w-md mx-auto">
                    You haven&apos;t joined a project yet. Browse the available projects and find a team to join for this cohort.
                  </p>
                  <Button asChild className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-[0_0_15px_rgba(8,145,178,0.4)]">
                    <Link href="/projects">Browse Projects</Link>
                  </Button>
                </div>
              )}
            </motion.div>
          </TabsContent>

          <TabsContent value="schedule">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-cyan-500/20">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" /> Upcoming Sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative border-s-2 border-slate-800 ms-3 flex flex-col gap- pb-4">
                    {/* Mock Schedule Items */}
                    {[
                      { title: "Intro to WebXR API", date: "Today, 2:00 PM", type: "Lecture", speaker: "Alex Vance" },
                      { title: "Three.js Fundamentals Lab", date: "Tomorrow, 10:00 AM", type: "Lab", speaker: "Sarah Chen" },
                      { title: "Project Proposal Review", date: "Friday, 1:00 PM", type: "Review", speaker: "Cohort Mentors" }
                    ].map((item, i) => (
                      <div key={i} className="relative ps-6">
                        <div className="absolute w-3 h-3 bg-cyan-500 rounded-full -start-[7px] top-1.5 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        <div className="glass p-4 rounded-lg border border-slate-800 hover:border-cyan-500/30 transition-colors">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-white">{item.title}</h4>
                            <span className="text-xs px-2 py-1 rounded-md bg-slate-800 text-cyan-400">{item.type}</span>
                          </div>
                          <div className="text-sm text-slate-400 flex items-center gap-4">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.date}</span>
                            <span>•</span>
                            <span>{item.speaker}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="downloads">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mock Downloads */}
                {[
                  { name: "Cohort Syllabus v1.2", size: "2.4 MB", type: "PDF" },
                  { name: "Starter Project Template", size: "15 MB", type: "ZIP" },
                  { name: "XR Design Guidelines", size: "8.1 MB", type: "PDF" },
                  { name: "Unity Integration Package", size: "45 MB", type: "UNITYPACKAGE" }
                ].map((file, i) => (
                  <Card key={i} className="glass border-slate-800 hover:border-cyan-500/30 transition-colors group">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center text-cyan-400 group-hover:text-cyan-300 group-hover:bg-cyan-500/10 transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-slate-200">{file.name}</p>
                          <p className="text-xs text-slate-500">{file.type} • {file.size}</p>
                        </div>
                      </div>
                      <Button size="icon" variant="ghost" className="text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10">
                        <Download className="w-4 h-4" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
}
