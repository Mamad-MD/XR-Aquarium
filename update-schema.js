const fs = require('fs');

const schemaPath = 'D:/XR-Aqurium/prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

// 1. Add tasks and updates to Project model
if (!schema.includes('tasks        ProjectTask[]')) {
  schema = schema.replace(
    '  steps        ProjectStep[]',
    '  steps        ProjectStep[]\n  tasks        ProjectTask[]\n  updates      ProjectUpdate[]'
  );
}

// 2. Add author relation to User model for ProjectUpdate
if (!schema.includes('projectUpdates ProjectUpdate[]')) {
  schema = schema.replace(
    '  announcements Announcement[] @relation("AnnouncementAuthor")',
    '  announcements Announcement[] @relation("AnnouncementAuthor")\n  projectUpdates ProjectUpdate[]'
  );
}


// 3. Add new models to the bottom
const newModels = `
// =========================================
// Models from V4 updates
// =========================================

// --- Global System Settings ---
model SystemSettings {
  id                         String   @id @default("singleton")
  studentRegistrationEnabled Boolean  @default(true)
  projectSelectionEnabled    Boolean  @default(true)
  maintenanceMode            Boolean  @default(false)
  updatedAt                  DateTime @updatedAt
}

// --- Project Tasks ---
model ProjectTask {
  id          String    @id @default(cuid())
  projectId   String
  title       String
  description String?
  status      String    @default("PENDING") // PENDING, IN_PROGRESS, IN_REVIEW, COMPLETED
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  completedAt DateTime?
  approvedAt  DateTime?

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
}

// --- Project Updates (Status Reports) ---
model ProjectUpdate {
  id          String    @id @default(cuid())
  projectId   String
  authorId    String
  content     String
  createdAt   DateTime  @default(now())

  project     Project   @relation(fields: [projectId], references: [id], onDelete: Cascade)
  author      User      @relation(fields: [authorId], references: [id])
}
`;

if (!schema.includes('model SystemSettings')) {
  schema += '\n' + newModels;
}

fs.writeFileSync(schemaPath, schema);
console.log('Schema updated successfully');
