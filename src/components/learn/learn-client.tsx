"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TutorialCard } from "@/components/learn/tutorial-card"
import { DownloadCard } from "@/components/learn/download-card"
import { Course, Lesson, Resource, User } from "@prisma/client"
import { useLocale } from "next-intl";

interface LearnClientProps {
  courses: (Course & { lessons: Lesson[] })[];
  resources: (Resource & { uploadedBy: User })[];
}

export function LearnClient({ courses, resources }: LearnClientProps) {
  const locale = useLocale();
  const isFa = locale === 'fa';

  return (
    <div className="container py-8 max-w-6xl mx-auto flex flex-col gap-4">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-2 text-primary drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
          {isFa ? "مرکز آموزش" : "Learning Center"}
        </h1>
        <p className="text-muted-foreground text-lg">
          {isFa
            ? "توسعه XR را با آموزش‌ها و منابع تعاملی ما مسلط شوید."
            : "Master XR development with our interactive tutorials and resources."}
        </p>
      </div>

      <Tabs defaultValue="tutorials" className="w-full flex flex-col gap-4">
        <TabsList className="bg-secondary/20 border-secondary/50">
          <TabsTrigger value="tutorials" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            {isFa ? "آموزش‌ها" : "Tutorials"}
          </TabsTrigger>
          <TabsTrigger value="downloads" className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary">
            {isFa ? "دانلودها" : "Downloads"}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tutorials" className="flex flex-col gap-4">
          {courses.map(course => (
            <div key={course.id} className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">
                {isFa && (course as any).titleFa ? (course as any).titleFa : course.title}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {course.lessons.map(lesson => (
                  <TutorialCard
                    key={lesson.id}
                    title={isFa && (lesson as any).titleFa ? (lesson as any).titleFa : lesson.title}
                    description={isFa && (lesson as any).contentFa ? (lesson as any).contentFa : lesson.content}
                    duration="30 min"
                    difficulty={lesson.level}
                  />
                ))}
              </div>
            </div>
          ))}

          {courses.length === 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <TutorialCard
                title={isFa ? "شروع کار با WebXR" : "Getting Started with WebXR"}
                description={isFa ? "یادگیری اصول اولیه راه‌اندازی یک صحنه WebXR در مرورگر." : "Learn the basics of setting up a WebXR scene in the browser."}
                duration="15 min"
                difficulty={isFa ? "مبتدی" : "Beginner"}
              />
              <TutorialCard
                title={isFa ? "پیاده‌سازی ردیابی دست" : "Hand Tracking Implementation"}
                description={isFa ? "پیاده‌سازی حرکات دست و ژست‌های واقع‌گرایانه در برنامه XR." : "Implement realistic hand tracking and gestures in your XR app."}
                duration="30 min"
                difficulty={isFa ? "متوسط" : "Intermediate"}
              />
              <TutorialCard
                title={isFa ? "بهینه‌سازی مدل‌های ۳ بعدی" : "Optimizing 3D Assets"}
                description={isFa ? "تکنیک‌هایی برای کاهش تعداد چندضلعی‌ها با حفظ کیفیت بصری." : "Techniques for reducing polygon count while maintaining visual fidelity."}
                duration="45 min"
                difficulty={isFa ? "پیشرفته" : "Advanced"}
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="downloads" className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map(resource => (
              <DownloadCard
                key={resource.id}
                title={isFa && (resource as any).titleFa ? (resource as any).titleFa : resource.title}
                description={isFa && (resource as any).descriptionFa ? (resource as any).descriptionFa : (resource.description || "")}
                fileSize={`${resource.fileSize} MB`}
                fileType={resource.fileType}
                version="1.0.0"
              />
            ))}

            {resources.length === 0 && (
              <>
                <DownloadCard
                  title={isFa ? "صحنه پایه آکواریوم" : "Base Aquarium Scene"}
                  description={isFa ? "یک قالب کامل با شیدرهای آب و نورپردازی پایه." : "A complete starter template with water shaders and basic lighting."}
                  fileSize="24 MB"
                  fileType="project"
                  version="1.0.0"
                />
                <DownloadCard
                  title={isFa ? "بسته ماهی‌های نئونی" : "Neon Fish Models Pack"}
                  description={isFa ? "مدل‌های ماهی بهینه‌شده برای XR با تکسچرهای درخشان." : "Low-poly fish models optimized for XR with emissive textures."}
                  fileSize="12 MB"
                  fileType="model"
                  version="1.2.0"
                />
              </>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
