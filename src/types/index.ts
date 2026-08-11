export type UserRole = 'student' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
  selectedProjectId?: string;
  joinedAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  nameFa: string;
  role: string;
  roleFa: string;
  bio: string;
  avatar: string;
  socials?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

export type ProjectCategory = 'VR' | 'AR' | 'MR' | 'XR' | 'Metaverse';
export type ProjectDifficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Project {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  techStack: string[];
  prerequisites: string[];
  objectives: string[];
  maxCapacity: number;
  enrolledCount: number;
  thumbnailUrl: string;
  mentorId: string;
  duration: string;
  status: 'open' | 'full' | 'in-progress' | 'completed';
}

export interface Tutorial {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  category: string;
  videoUrl?: string;
  duration: string;
  level: ProjectDifficulty;
  tags: string[];
  content: string;
}

export interface DownloadableFile {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  fileSize: string;
  fileType: string;
  downloadUrl: string;
  category: string;
  uploadedAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  titleFa: string;
  content: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  authorId: string;
  isRead?: boolean;
}

export interface ScheduleItem {
  id: string;
  title: string;
  titleFa: string;
  date: string;
  time: string;
  type: 'workshop' | 'deadline' | 'presentation' | 'meeting' | 'event';
  description: string;
  descriptionFa?: string;
  location?: string;
  locationFa?: string;
}
