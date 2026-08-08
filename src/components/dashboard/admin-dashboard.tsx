"use client"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard, Users, Boxes, Bell, Settings,
  Search, Plus, Activity, Mail, FileText, Check, X
} from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export function AdminDashboard({ user, data }: {
  user: { name?: string | null, image?: string | null, id?: string | null },
  data: {
    studentsCount?: number,
    mentorsCount?: number,
    projectsCount?: number,
    announcements?: Array<{ id: string, title: string, content: string, priority: string, createdAt: string }>,
    applications?: Array<{
      id: string,
      status: string,
      appliedAt: Date | string,
      user: { name: string | null },
      project: { title: string }
    }>
  }
}) {
  const router = useRouter();
  const announcements = data?.announcements || [];
  const applications = data?.applications || [];
  const [newAnnouncement, setNewAnnouncement] = useState({ title: "", content: "", priority: "MEDIUM" as "LOW" | "MEDIUM" | "HIGH" | "URGENT" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.title || !newAnnouncement.content) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnnouncement),
      });

      if (res.ok) {
        setNewAnnouncement({ title: "", content: "", priority: "MEDIUM" });
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-black text-white p-4 md:p-6 gap-6 pt-24">
      {/* Admin Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-full md:w-64 glass rounded-xl p-6 flex flex-col gap-8 h-fit sticky top-24 border-purple-500/30 shadow-[0_0_20px_rgba(147,51,234,0.1)]"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-md opacity-20"></div>
            <Avatar className="w-24 h-24 border-2 border-purple-500/50">
              <AvatarImage src={user.image || undefined} alt={user.name || "Admin"} />
              <AvatarFallback className="bg-slate-800 text-purple-400 text-2xl">
                {user.name ? user.name.charAt(0) : "A"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
            <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30">
              SYSTEM ADMIN
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 max-w-6xl"
      >
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-5 w-full md:w-auto md:inline-flex bg-slate-900/50 border border-slate-800 p-1 mb-8">
            <TabsTrigger value="overview" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <LayoutDashboard className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="students" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Users className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Students</span>
            </TabsTrigger>
            <TabsTrigger value="projects" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Boxes className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger value="announcements" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Bell className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Comms</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <Settings className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Settings</span>
            </TabsTrigger>
            <TabsTrigger value="applications" className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400">
              <FileText className="w-4 h-4 md:me-2" />
              <span className="hidden md:inline">Applications</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
              <h1 className="text-3xl font-bold tracking-tight mb-6">
                System <span className="text-purple-400">Overview</span>
              </h1>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Students", value: data?.studentsCount || "0", icon: Users, color: "text-blue-400" },
                  { label: "Mentors", value: data?.mentorsCount || "0", icon: Activity, color: "text-purple-400" },
                  { label: "Projects Open", value: data?.projectsCount || "0", icon: Boxes, color: "text-green-400" },
                  { label: "Active Now", value: "0", icon: Activity, color: "text-cyan-400" }
                ].map((stat, i) => (
                  <Card key={i} className="glass border-slate-800">
                    <CardContent className="p-6">
                      <stat.icon className={`w-8 h-8 mb-4 ${stat.color} opacity-80`} />
                      <p className="text-sm font-medium text-slate-400">{stat.label}</p>
                      <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="glass mt-8 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-purple-400" /> Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { msg: "Sarah Jenkins joined project 'Neural Interfaces'", time: "10 mins ago" },
                      { msg: "Project 'VR Training Sim' reached capacity", time: "1 hour ago" },
                      { msg: "System backup completed successfully", time: "3 hours ago" }
                    ].map((act, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-slate-800 last:border-0">
                        <span className="text-sm text-slate-300">{act.msg}</span>
                        <span className="text-xs text-slate-500">{act.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="students">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-slate-800">
                <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <CardTitle>Student Directory</CardTitle>
                  <div className="relative w-full md:w-64">
                    <Search className="absolute start-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                      placeholder="Search students..."
                      className="ps-9 bg-slate-900/50 border-slate-800 focus-visible:ring-purple-500"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-slate-800">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-sm font-medium text-slate-400">
                      <div className="col-span-4">Name</div>
                      <div className="col-span-3">Project</div>
                      <div className="col-span-3">Status</div>
                      <div className="col-span-2 text-end">Actions</div>
                    </div>
                    {/* Mock Table Rows */}
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                        <div className="col-span-4 flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-slate-800 text-xs">S{i}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">Student Name {i}</p>
                            <p className="text-xs text-slate-500">student{i}@university.edu</p>
                          </div>
                        </div>
                        <div className="col-span-3 text-sm text-slate-300">
                          {i % 2 === 0 ? "XR Visualization" : "Unassigned"}
                        </div>
                        <div className="col-span-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            i % 2 === 0 ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                          }`}>
                            {i % 2 === 0 ? "Active" : "Pending Project"}
                          </span>
                        </div>
                        <div className="col-span-2 text-end">
                          <Button variant="ghost" size="sm" className="h-8 text-slate-400 hover:text-purple-400">
                            Manage
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="announcements">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass border-slate-800 h-fit">
                <CardHeader>
                  <CardTitle>Post Announcement</CardTitle>
                  <CardDescription>Broadcast a message to all cohort members.</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePostAnnouncement} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={newAnnouncement.title}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                        className="bg-slate-900/50 border-slate-800 focus-visible:ring-purple-500"
                        placeholder="e.g., Week 4 Schedule Update"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="content">Message Content</Label>
                      <textarea
                        id="content"
                        value={newAnnouncement.content}
                        onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                        className="flex min-h-[120px] w-full rounded-md border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Type your announcement here..."
                        disabled={isSubmitting}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Priority</Label>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="priority"
                            checked={newAnnouncement.priority === 'MEDIUM'}
                            onChange={() => setNewAnnouncement({...newAnnouncement, priority: 'MEDIUM'})}
                            className="text-purple-500 bg-slate-900 border-slate-800 focus:ring-purple-500"
                            disabled={isSubmitting}
                          />
                          Normal
                        </label>
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="radio"
                            name="priority"
                            checked={newAnnouncement.priority === 'URGENT'}
                            onChange={() => setNewAnnouncement({...newAnnouncement, priority: 'URGENT'})}
                            className="text-red-500 bg-slate-900 border-slate-800 focus:ring-red-500"
                            disabled={isSubmitting}
                          />
                          <span className="text-red-400">High Priority</span>
                        </label>
                      </div>
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Mail className="w-4 h-4 me-2" /> {isSubmitting ? "Posting..." : "Post Announcement"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="font-medium text-slate-300">Recent Broadcasts</h3>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3 pe-4">
                    {announcements.map((a: { id: string, title: string, content: string, priority: string, createdAt: string }) => (
                      <div key={a.id} className={`p-4 rounded-lg border ${
                        a.priority === 'URGENT' || a.priority === 'HIGH' ? 'bg-red-500/5 border-red-500/20' : 'bg-slate-900/40 border-slate-800'
                      }`}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-medium ${a.priority === 'URGENT' || a.priority === 'HIGH' ? 'text-red-400' : 'text-slate-200'}`}>
                            {a.title}
                          </h4>
                          <span className="text-xs text-slate-500">
                            {format(new Date(a.createdAt), 'MMM d, h:mm a')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-400 line-clamp-2">{a.content}</p>
                      </div>
                    ))}
                    {announcements.length === 0 && (
                      <div className="text-slate-500 text-sm">No announcements yet</div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="settings">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl">
              <Card className="glass border-slate-800">
                <CardHeader>
                  <CardTitle>System Configuration</CardTitle>
                  <CardDescription>Manage global cohort settings and access controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Student Registration</Label>
                      <p className="text-sm text-slate-400">Allow new students to create accounts</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="h-px bg-slate-800 w-full" />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Project Selection</Label>
                      <p className="text-sm text-slate-400">Allow students to join or leave projects</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="h-px bg-slate-800 w-full" />
                  <div className="flex items-center justify-between py-2">
                    <div className="space-y-0.5">
                      <Label className="text-base font-medium">Maintenance Mode</Label>
                      <p className="text-sm text-slate-400">Lock down the system for updates</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="projects">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
               <Card className="glass border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Active Projects</CardTitle>
                    <CardDescription>Manage cohort projects and teams</CardDescription>
                  </div>
                  <Button className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="w-4 h-4 me-2" /> New Project
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Mock Projects */}
                    {[
                      { name: "XR Data Visualization", mentor: "Dr. Sarah Chen", cap: "2/4", status: "Open" },
                      { name: "Neural Interfaces", mentor: "Alex Vance", cap: "4/4", status: "Full" },
                      { name: "Medical Training VR", mentor: "Dr. James Wilson", cap: "1/3", status: "Open" }
                    ].map((p, i) => (
                      <div key={i} className="p-4 rounded-lg border border-slate-800 bg-slate-900/40">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-purple-400">{p.name}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            p.status === 'Full' ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'
                          }`}>
                            {p.status}
                          </span>
                        </div>
                        <div className="flex justify-between items-end mt-4">
                          <div className="text-sm text-slate-400">
                            Mentor: <span className="text-slate-300">{p.mentor}</span>
                          </div>
                          <div className="text-sm font-medium">
                            Capacity: {p.cap}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="applications">
            <motion.div variants={containerVariants} initial="hidden" animate="visible">
              <Card className="glass border-slate-800">
                <CardHeader>
                  <CardTitle>Project Applications</CardTitle>
                  <CardDescription>Review and manage student applications for projects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border border-slate-800">
                    <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-800 bg-slate-900/50 text-sm font-medium text-slate-400">
                      <div className="col-span-3">User</div>
                      <div className="col-span-3">Project</div>
                      <div className="col-span-2">Date Applied</div>
                      <div className="col-span-2">Status</div>
                      <div className="col-span-2 text-end">Actions</div>
                    </div>
                    {applications.length === 0 ? (
                      <div className="p-8 text-center text-slate-500">No applications found.</div>
                    ) : (
                      applications.map((app) => (
                        <div key={app.id} className="grid grid-cols-12 gap-4 p-4 items-center border-b border-slate-800/50 last:border-0 hover:bg-slate-900/30 transition-colors">
                          <div className="col-span-3 text-sm font-medium">
                            {app.user.name || 'Unknown'}
                          </div>
                          <div className="col-span-3 text-sm text-slate-300">
                            {app.project.title}
                          </div>
                          <div className="col-span-2 text-xs text-slate-400">
                            {format(new Date(app.appliedAt), 'MMM d, yyyy')}
                          </div>
                          <div className="col-span-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              app.status === 'ACCEPTED' ? 'bg-green-500/10 text-green-400' :
                              app.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                              'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>
                          <div className="col-span-2 text-end flex justify-end gap-2">
                            {app.status === 'PENDING' && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-green-400 hover:text-green-300 hover:bg-green-400/10"
                                  onClick={async () => {
                                    try {
                                      const res = await fetch('/api/projects/application', {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ applicationId: app.id, status: 'ACCEPTED' })
                                      });
                                      if (res.ok) router.refresh();
                                    } catch (e) { console.error(e); }
                                  }}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                                  onClick={async () => {
                                    try {
                                      const res = await fetch('/api/projects/application', {
                                        method: 'PATCH',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ applicationId: app.id, status: 'REJECTED' })
                                      });
                                      if (res.ok) router.refresh();
                                    } catch (e) { console.error(e); }
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.main>
    </div>
  );
}
