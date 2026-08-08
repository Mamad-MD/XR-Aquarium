import { Tutorial } from '@/types';

export const tutorials: Tutorial[] = [
  {
    id: 'tut-001',
    title: 'Introduction to React Hooks',
    titleFa: 'مقدمه‌ای بر هوک‌های ریکت',
    description: 'Learn the fundamentals of React Hooks, including useState and useEffect, with practical examples.',
    category: 'Frontend Development',
    videoUrl: 'https://example.com/videos/react-hooks-intro',
    duration: " mins",
    level: 'Beginner',
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    content: 'React Hooks revolutionized how we write components by allowing state and lifecycle features in functional components...'
  },
  {
    id: 'tut-002',
    title: 'Advanced State Management with Redux Toolkit',
    titleFa: 'مدیریت وضعیت پیشرفته با ریداکس تولکیت',
    description: 'Master global state management in complex applications using modern Redux Toolkit practices.',
    category: 'Frontend Development',
    duration: " mins",
    level: 'Advanced',
    tags: ['react', 'redux', 'state-management', 'architecture'],
    content: 'Redux Toolkit simplifies Redux by providing sensible defaults, reducing boilerplate, and including essential tools out of the box...'
  },
  {
    id: 'tut-003',
    title: 'Building RESTful APIs with Node.js',
    titleFa: 'ساخت API های RESTful با نود جی‌اس',
    description: 'A comprehensive guide to designing and implementing robust REST APIs using Express and Node.js.',
    category: 'Backend Development',
    videoUrl: 'https://example.com/videos/node-rest-api',
    duration: " mins",
    level: 'Intermediate',
    tags: ['nodejs', 'express', 'api', 'backend'],
    content: 'RESTful architecture provides a standard way for web applications to communicate. In this tutorial, we will build a complete API...'
  },
  {
    id: 'tut-004',
    title: 'CSS Grid Layout Crash Course',
    titleFa: 'دوره فشرده چیدمان با CSS Grid',
    description: 'Learn how to create complex, responsive layouts easily using CSS Grid.',
    category: 'Web Design',
    videoUrl: 'https://example.com/videos/css-grid',
    duration: " mins",
    level: 'Beginner',
    tags: ['css', 'layout', 'design', 'responsive'],
    content: 'CSS Grid is a two-dimensional layout system that can handle both columns and rows, unlike flexbox which is largely one-dimensional...'
  },
  {
    id: 'tut-005',
    title: 'Dockerizing Full Stack Applications',
    titleFa: 'داکرایز کردن برنامه‌های فول‌استک',
    description: 'Learn how to use Docker and Docker Compose to containerize your React and Node.js applications.',
    category: 'DevOps',
    duration: " mins",
    level: 'Intermediate',
    tags: ['docker', 'devops', 'deployment', 'containers'],
    content: 'Containerization ensures your application runs exactly the same way in production as it does on your local machine...'
  },
  {
    id: 'tut-006',
    title: 'Mastering TypeScript Generics',
    titleFa: 'تسلط بر Generic های تایپ‌اسکریپت',
    description: 'Deep dive into one of TypeScript\'s most powerful features for writing reusable, type-safe code.',
    category: 'Programming Languages',
    videoUrl: 'https://example.com/videos/ts-generics',
    duration: " mins",
    level: 'Advanced',
    tags: ['typescript', 'javascript', 'types'],
    content: 'Generics allow you to write reusable components that can work over a variety of types rather than a single one...'
  },
  {
    id: 'tut-007',
    title: 'Getting Started with Next.js App Router',
    titleFa: 'شروع به کار با App Router در نکست جی‌اس',
    description: 'Explore the new mental model and features introduced in Next.js 13+ with the App Router.',
    category: 'Frontend Development',
    videoUrl: 'https://example.com/videos/nextjs-app-router',
    duration: " mins",
    level: 'Intermediate',
    tags: ['nextjs', 'react', 'ssr', 'routing'],
    content: 'The Next.js App Router introduces React Server Components, streaming, and a new way to handle layouts and data fetching...'
  },
  {
    id: 'tut-008',
    title: 'Introduction to PostgreSQL',
    titleFa: 'آشنایی با پایگاه داده PostgreSQL',
    description: 'Learn the basics of relational databases, writing queries, and managing data with PostgreSQL.',
    category: 'Databases',
    duration: " mins",
    level: 'Beginner',
    tags: ['sql', 'postgresql', 'database', 'backend'],
    content: 'PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development...'
  },
  {
    id: 'tut-009',
    title: 'Authentication with NextAuth.js',
    titleFa: 'احراز هویت با NextAuth.js',
    description: 'Implement secure authentication using OAuth providers and credentials in your Next.js application.',
    category: 'Security',
    videoUrl: 'https://example.com/videos/nextauth-tutorial',
    duration: " mins",
    level: 'Intermediate',
    tags: ['security', 'authentication', 'nextjs', 'oauth'],
    content: 'Authentication is notoriously difficult to get right. NextAuth.js provides a secure, flexible solution for Next.js applications...'
  },
  {
    id: 'tut-010',
    title: 'Microservices Architecture Patterns',
    titleFa: 'الگوهای معماری مایکروسرویس‌ها',
    description: 'Explore common patterns, benefits, and challenges when designing microservice-based systems.',
    category: 'System Design',
    duration: " mins",
    level: 'Advanced',
    tags: ['architecture', 'microservices', 'system-design', 'backend'],
    content: 'Transitioning from a monolith to microservices involves understanding domain-driven design, communication protocols, and data consistency...'
  }
];