import { ScheduleItem } from '@/types';

export const scheduleItems: ScheduleItem[] = [
  {
    id: 'sch-1',
    date: '2026-08-10',
    time: '10:00',
    title: 'Welcome & Orientation',
    titleFa: 'خوش‌آمدگویی و معارفه',
    type: 'event',
    description: 'Introduction to the XR Aquarium Lab, meet the mentors, and overview of the 2-month cohort program.',
    location: 'Main Hall'
  },
  {
    id: 'sch-2',
    date: '2026-08-12',
    time: '14:00',
    title: 'XR Foundations Workshop',
    titleFa: 'کارگاه مبانی واقعیت افزوده/مجازی',
    type: 'workshop',
    description: 'Deep dive into spatial computing paradigms, terminology, and current industry landscape.',
    location: 'Lab Room A'
  },
  {
    id: 'sch-3',
    date: '2026-08-14',
    time: '23:59',
    title: 'Team Formation Deadline',
    titleFa: 'مهلت تشکیل تیم',
    type: 'deadline',
    description: 'Submit your team members and preliminary project area of interest.',
    location: 'Online Submission'
  },
  {
    id: 'sch-4',
    date: '2026-08-17',
    time: '15:00',
    title: 'Ideation & Pitch Review',
    titleFa: 'ایده‌پردازی و بررسی طرح اولیه',
    type: 'presentation',
    description: 'Present your project concept to mentors for feedback and feasibility assessment.',
    location: 'Conference Room 2'
  },
  {
    id: 'sch-5',
    date: '2026-08-20',
    time: '10:00',
    title: 'Mid-Point Check-in',
    titleFa: 'جلسه بررسی میان‌دوره',
    type: 'meeting',
    description: '1-on-1 meeting with lead mentors to discuss progress and blockers.',
    location: 'Virtual (Zoom)'
  },
  {
    id: 'sch-6',
    date: '2026-08-25',
    time: '14:00',
    title: 'Advanced Unity Optimization',
    titleFa: 'بهینه‌سازی پیشرفته یونیتی',
    type: 'workshop',
    description: 'Hands-on workshop focusing on performance profiling and memory management in Unity for standalone XR devices.',
    location: 'Lab Room B'
  },
  {
    id: 'sch-7',
    date: '2026-08-30',
    time: '23:59',
    title: 'Feature Freeze',
    titleFa: 'توقف توسعه ویژگی‌های جدید',
    type: 'deadline',
    description: 'Stop adding new features and focus exclusively on polishing, bug fixing, and optimization.',
    location: 'Online GitHub Repository'
  },
  {
    id: 'sch-8',
    date: '2026-09-05',
    time: '16:00',
    title: 'Demo Day & Final Presentations',
    titleFa: 'روز ارائه و نمایش نهایی',
    type: 'presentation',
    description: 'Present your final XR applications to industry partners, sponsors, and peers.',
    location: 'Exhibition Center'
  }
];