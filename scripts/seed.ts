import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { projects } from "../src/lib/data/projects";
import { team } from "../src/lib/data/team";
import { announcements } from "../src/lib/data/announcements";
import { tutorials } from "../src/lib/data/tutorials";
import { downloadableFiles } from "../src/lib/data/files";
import { scheduleItems } from "../src/lib/data/schedule";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting database seed...");

  // Clean up existing data
  await prisma.projectApplication.deleteMany({});
  await prisma.resource.deleteMany({});
  await prisma.lesson.deleteMany({});
  await prisma.course.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.announcement.deleteMany({});
  await prisma.scheduleEvent.deleteMany({});
  await prisma.user.deleteMany({});

  const hashedPassword = await bcrypt.hash("password123", 10);

  // 1. Create Users

  // Admin user
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });
  console.log("Created admin user");

  // Mentors (from team data)
  console.log("Creating mentors...");
  const mentorUsers = [];
  for (const member of team) {
    const mentor = await prisma.user.create({
      data: {
        id: member.id, // Keep the same ID so projects map correctly
        name: member.name,
        email: `${member.id}@example.com`,
        password: hashedPassword,
        image: member.avatar,
        role: "MENTOR",
      },
    });
    mentorUsers.push(mentor);
  }
  console.log(`Created ${mentorUsers.length} mentors`);

  // Dummy students
  console.log("Creating students...");
  const studentUsers = [];
  for (let i = 1; i <= 10; i++) {
    const student = await prisma.user.create({
      data: {
        name: `Student ${i}`,
        email: `student${i}@example.com`,
        password: hashedPassword,
        role: "PARTICIPANT",
      },
    });
    studentUsers.push(student);
  }
  console.log(`Created ${studentUsers.length} students`);

  // 2. Create Projects
  console.log("Creating projects...");
  for (const p of projects) {
    await prisma.project.create({
      data: {
        id: p.id,
        title: p.title,
        titleFa: p.titleFa,
        description: p.description,
        category: p.category,
        difficulty: p.difficulty,
        maxCapacity: p.maxCapacity,
        thumbnailUrl: p.thumbnailUrl,
        duration: p.duration,
        status: p.status.toUpperCase(),
        techStack: JSON.stringify(p.techStack),
        prerequisites: JSON.stringify(p.prerequisites),
        objectives: JSON.stringify(p.objectives),
        mentorId: p.mentorId, // Already mapped correctly because mentor IDs were preserved
      },
    });
  }
  console.log(`Created ${projects.length} projects`);

  // 3. Create Announcements
  console.log("Creating announcements...");
  for (const a of announcements) {
    await prisma.announcement.create({
      data: {
        id: a.id,
        title: a.title,
        content: a.content,
        priority: a.priority.toUpperCase(),
        authorId: admin.id, // Admin created all announcements
        audience: "EVERYONE",
      },
    });
  }
  console.log(`Created ${announcements.length} announcements`);

  // 4. Create Tutorials as Course/Lessons
  console.log("Creating tutorials (Course/Lessons)...");

  // Group tutorials by category to create courses
  const categories = [...new Set(tutorials.map(t => t.category))];

  for (const category of categories) {
    const categoryTutorials = tutorials.filter(t => t.category === category);

    await prisma.course.create({
      data: {
        title: category,
        description: `${category} tutorials`,
        category: category,
        lessons: {
          create: categoryTutorials.map((t, index) => ({
            id: t.id,
            title: t.title,
            content: t.content,
            videoUrl: t.videoUrl,
            order: index + 1,
            tags: JSON.stringify(t.tags),
            level: t.level.toUpperCase(),
          }))
        }
      }
    });
  }
  console.log(`Created tutorials across ${categories.length} courses`);

  // 5. Create Downloadable Files as Resources
  console.log("Creating downloadable files (Resources)...");
  for (const f of downloadableFiles) {
    await prisma.resource.create({
      data: {
        id: f.id,
        title: f.name,
        description: f.description,
        fileType: f.fileType,
        fileSize: 1000, // Dummy value since original is string like "2.45 MB"
        url: f.downloadUrl,
        uploadedById: admin.id,
      }
    });
  }
  console.log(`Created ${downloadableFiles.length} resources`);

  // 6. Create Schedule Events
  console.log("Creating schedule events...");
  for (const s of scheduleItems) {
    // Combine date and time into a DateTime
    const dateStr = `${s.date}T${s.time}:00Z`;
    let dateObj;
    try {
      dateObj = new Date(dateStr);
      // Fallback if invalid format
      if (isNaN(dateObj.getTime())) dateObj = new Date();
    } catch {
      dateObj = new Date();
    }

    await prisma.scheduleEvent.create({
      data: {
        id: s.id,
        title: s.title,
        type: s.type.toUpperCase(),
        date: dateObj,
        location: s.location || "",
        description: s.description,
      }
    });
  }
  console.log(`Created ${scheduleItems.length} schedule events`);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });