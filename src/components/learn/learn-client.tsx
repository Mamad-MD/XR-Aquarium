"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialCard } from "@/components/learn/tutorial-card"
import { DownloadCard } from "@/components/learn/download-card"
import { Course, Lesson, Resource, User } from "@prisma/client"

interface LearnClientProps {
  courses: (Course & { lessons: Lesson[] })[];
  resources: (Resource & { uploadedBy: User })[];
}

export function LearnClient({ courses, resources }: LearnClientProps) {
  return (
    <div className="container py-8 max-w-6xl mx-auto flex flex-col gap-">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          Learning Center
        </h1>
        <p className="text-muted-foreground text-lg">
          Master XR development with our interactive tutorials and resources.
        </p>
      </div>

      <Tabs defaultValue="tutorials" className="w-full flex flex-col gap-">
        <TabsList className="bg-secondary/20 border-secondary/50">
          <TabsTrigger value="tutorials" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Tutorials
          </TabsTrigger>
          <TabsTrigger value="downloads" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            Downloads
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="flex flex-col gap-">
          {courses.map(course => (
            <div key={course.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">{course.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.lessons.map(lesson => (
                  <TutorialCard
                    key={lesson.id}
                    title={lesson.title}
                    description={lesson.content}
                    duration="30 min" // Mocked, ideally from DB
                    difficulty={lesson.level}
                  />
                ))}
              </div>
            </div>
          ))}
          
          {courses.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TutorialCard
                title="Getting Started with WebXR"
                description="Learn the basics of setting up a WebXR scene in the browser."
                duration="15 min"
                difficulty="Beginner"
              />
              <TutorialCard
                title="Hand Tracking Implementation"
                description="Implement realistic hand tracking and gestures in your XR app."
                duration="30 min"
                difficulty="Intermediate"
              />
              <TutorialCard
                title="Optimizing 3D Assets"
                description="Techniques for reducing polygon count while maintaining visual fidelity."
                duration="45 min"
                difficulty="Advanced"
              />
              <TutorialCard
                title="Spatial Audio Design"
                description="Create immersive soundscapes that react to head movement."
                duration="25 min"
                difficulty="Intermediate"
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="downloads" className="flex flex-col gap-">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <DownloadCard
                key={resource.id}
                title={resource.title}
                description={resource.description || ""}
                fileSize={`${resource.fileSize} MB`} // Simplified for now
                fileType={resource.fileType}
                version="1.0.0" // Mocked version
              />
            ))}

            {resources.length === 0 && (
              <>
                <DownloadCard
                  title="Base Aquarium Scene"
                  description="A complete starter template with water shaders and basic lighting."
                  fileSize="24 MB"
                  fileType="project"
                  version="1.0.0"
                />
                <DownloadCard
                  title="Cyberpunk UI Toolkit"
                  description="The complete set of UI components used in this application."
                  fileSize="5 MB"
                  fileType="library"
                  version="2.1.0"
                />
                <DownloadCard
                  title="Neon Fish Models Pack"
                  description="Low-poly fish models optimized for XR with emissive textures."
                  fileSize="12 MB"
                  fileType="model"
                  version="1.2.0"
                />
                <DownloadCard
                  title="Holographic Material Shaders"
                  description="Custom shaders for creating holographic and glitch effects."
                  fileSize="2 MB"
                  fileType="shader"
                  version="1.0.5"
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
