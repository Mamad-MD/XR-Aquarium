import { Announcement } from '@/types';

export const announcements: Announcement[] = [
  {
    id: 'ann-001',
    title: 'System Maintenance Scheduled for Weekend',
    titleFa: 'تعمیر و نگهداری سیستم برای آخر هفته برنامه‌ریزی شده است',
    content: 'Please be advised that the main server will undergo scheduled maintenance this Saturday from 02:00 AM to 06:00 AM. Expect intermittent downtime during this window. All services should resume normally afterwards.',
    priority: 'high',
    createdAt: "2026-08-08T00:00:00Z",
    authorId: 'auth-sys-01',
    isRead: false
  },
  {
    id: 'ann-002',
    title: 'New Health Insurance Policy Updates',
    titleFa: 'به‌روزرسانی‌های جدید بیمه درمانی',
    content: 'The HR department has updated the employee health insurance policy. Please review the new document on the company portal by the end of the month. Several new benefits have been added for family members.',
    priority: 'medium',
    createdAt: "2026-08-08T00:00:00Z",
    authorId: 'auth-hr-02',
    isRead: true
  },
  {
    id: 'ann-003',
    title: 'Welcome to our New Team Members!',
    titleFa: 'به اعضای جدید تیم خوش‌آمد می‌گوییم!',
    content: 'We are thrilled to welcome Sarah and Mohammad to the engineering team. They will be working on the new mobile application project. Please give them a warm welcome when you see them on Slack or in the office.',
    priority: 'low',
    createdAt: "2026-08-08T00:00:00Z",
    authorId: 'auth-mgmt-03',
    isRead: false
  },
  {
    id: 'ann-004',
    title: 'CRITICAL: Mandatory Security Patch Update',
    titleFa: 'بحرانی: به‌روزرسانی اجباری وصله امنیتی',
    content: 'A critical security vulnerability has been identified in the current VPN client. You MUST run the auto-updater tool before the end of the day today. Failure to do so will result in access being revoked until the patch is applied.',
    priority: 'urgent',
    createdAt: "2026-08-08T00:00:00Z",
    authorId: 'auth-sec-04',
    isRead: false
  },
  {
    id: 'ann-005',
    title: 'Q3 Townhall Meeting Reminder',
    titleFa: 'یادآوری جلسه عمومی سه‌ماهه سوم',
    content: 'Just a quick reminder that our Q3 Townhall meeting will take place next Wednesday at 2 PM. We will be discussing the recent milestones and the roadmap for the upcoming quarter. Coffee and snacks will be provided for those attending in person.',
    priority: 'medium',
    createdAt: "2026-08-08T00:00:00Z",
    authorId: 'auth-ceo-05',
    isRead: true
  }
];