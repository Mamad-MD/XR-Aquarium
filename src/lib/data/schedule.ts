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
    descriptionFa: 'معرفی آزمایشگاه آکواریوم واقعیت توسعه‌یافته، دیدار با منتورها و مروری بر برنامه ۲ ماهه رویداد.',
    location: 'Main Hall',
    locationFa: 'سالن اصلی'
  },
  {
    id: 'sch-2',
    date: '2026-08-12',
    time: '14:00',
    title: 'XR Foundations Workshop',
    titleFa: 'کارگاه مبانی واقعیت توسعه‌یافته',
    type: 'workshop',
    description: 'Deep dive into spatial computing paradigms, terminology, and current industry landscape.',
    descriptionFa: 'بررسی عمیق مفاهیم رایانش فضایی، اصطلاحات تخصصی و چشم‌انداز فعلی صنعت.',
    location: 'Lab Room A',
    locationFa: 'سایت A'
  },
  {
    id: 'sch-3',
    date: '2026-08-14',
    time: '23:59',
    title: 'Team Formation Deadline',
    titleFa: 'مهلت نهایی تشکیل تیم',
    type: 'deadline',
    description: 'Submit your team members and preliminary project area of interest.',
    descriptionFa: 'ارسال اسامی اعضای تیم و زمینه اولیه مورد علاقه برای پروژه.',
    location: 'Online Submission',
    locationFa: 'ارسال آنلاین'
  },
  {
    id: 'sch-4',
    date: '2026-08-17',
    time: '15:00',
    title: 'Ideation & Pitch Review',
    titleFa: 'ایده‌پردازی و بررسی طرح اولیه',
    type: 'presentation',
    description: 'Present your project concept to mentors for feedback and feasibility assessment.',
    descriptionFa: 'ارائه ایده پروژه به منتورها جهت دریافت بازخورد و ارزیابی امکان‌سنجی.',
    location: 'Conference Room 2',
    locationFa: 'سالن کنفرانس ۲'
  },
  {
    id: 'sch-5',
    date: '2026-08-20',
    time: '10:00',
    title: 'Mid-Point Check-in',
    titleFa: 'بررسی وضعیت میان‌دوره',
    type: 'meeting',
    description: '1-on-1 meeting with lead mentors to discuss progress and blockers.',
    descriptionFa: 'جلسه اختصاصی با منتورهای ارشد برای بررسی پیشرفت کار و موانع احتمالی.',
    location: 'Virtual (Zoom)',
    locationFa: 'مجازی (زوم)'
  },
  {
    id: 'sch-6',
    date: '2026-08-25',
    time: '14:00',
    title: 'Advanced Unity Optimization',
    titleFa: 'بهینه‌سازی پیشرفته در یونیتی',
    type: 'workshop',
    description: 'Hands-on workshop focusing on performance profiling and memory management in Unity for standalone XR devices.',
    descriptionFa: 'کارگاه عملی با تمرکز بر پروفایل عملکرد و مدیریت حافظه در یونیتی ویژه دستگاه‌های مستقل واقعیت توسعه‌یافته.',
    location: 'Lab Room B',
    locationFa: 'سایت B'
  },
  {
    id: 'sch-7',
    date: '2026-08-30',
    time: '23:59',
    title: 'Feature Freeze',
    titleFa: 'توقف توسعه قابلیت‌های جدید',
    type: 'deadline',
    description: 'Stop adding new features and focus exclusively on polishing, bug fixing, and optimization.',
    descriptionFa: 'توقف افزودن قابلیت‌های جدید و تمرکز انحصاری بر رفع ایرادات، بهبود تجربه کاربری و بهینه‌سازی.',
    location: 'Online GitHub Repository',
    locationFa: 'مخزن آنلاین GitHub'
  },
  {
    id: 'sch-8',
    date: '2026-09-05',
    time: '16:00',
    title: 'Demo Day & Final Presentations',
    titleFa: 'روز دمو و ارائه‌های نهایی',
    type: 'presentation',
    description: 'Present your final XR applications to industry partners, sponsors, and peers.',
    descriptionFa: 'ارائه برنامه‌های نهایی واقعیت توسعه‌یافته به شرکای صنعتی، حامیان مالی و سایر شرکت‌کنندگان.',
    location: 'Exhibition Center',
    locationFa: 'مرکز نمایشگاه'
  }
];