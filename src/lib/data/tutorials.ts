import { Tutorial } from '@/types';

export const tutorials: Tutorial[] = [
  {
    id: 'tut-001',
    title: 'Introduction to Unity XR',
    titleFa: 'مقدمه‌ای بر Unity XR',
    description: 'Learn the fundamentals of Unity XR Toolkit, setting up your first project, and basic interactions.',
    category: 'XR Development',
    videoUrl: 'https://example.com/videos/unity-xr-intro',
    duration: "45 mins",
    level: 'Beginner',
    tags: ['unity', 'xr', 'vr', 'csharp'],
    content: 'Unity XR Interaction Toolkit provides a framework that makes 3D and UI interactions available from Unity input events. In this tutorial, we will set up a basic scene with teleportation and object grabbing.'
  },
  {
    id: 'tut-002',
    title: 'Advanced Shader Graph for Water Effects',
    titleFa: 'گراف سایه‌زن پیشرفته برای افکت‌های آب',
    description: 'Master Unity Shader Graph to create realistic and stylized water materials for aquarium environments.',
    category: 'Graphics & Rendering',
    duration: "60 mins",
    level: 'Advanced',
    tags: ['unity', 'shaders', 'graphics', 'visuals'],
    content: 'Creating convincing water is essential for an aquarium project. We will dive deep into Shader Graph, manipulating UVs, depth textures, and refraction to create a stunning aquatic feel.'
  },
  {
    id: 'tut-003',
    title: 'Building Multiplayer XR with Photon',
    titleFa: 'ساخت XR چندنفره با فوتون',
    description: 'A comprehensive guide to networking your XR experience so multiple users can interact in the same virtual space.',
    category: 'Networking',
    videoUrl: 'https://example.com/videos/photon-xr',
    duration: "90 mins",
    level: 'Intermediate',
    tags: ['unity', 'multiplayer', 'photon', 'networking'],
    content: 'Shared presence is what makes modern XR magical. In this tutorial, we will integrate Photon Unity Networking (PUN 2) to synchronize avatar movements and object interactions.'
  },
  {
    id: 'tut-004',
    title: 'Optimizing 3D Models for Standalone VR',
    titleFa: 'بهینه‌سازی مدل‌های سه‌بعدی برای VR مستقل',
    description: 'Learn pipelines and techniques for reducing polygon counts and optimizing textures for Meta Quest.',
    category: '3D Modeling',
    videoUrl: 'https://example.com/videos/3d-optimization',
    duration: "30 mins",
    level: 'Intermediate',
    tags: ['blender', 'optimization', 'performance', '3d'],
    content: 'Mobile VR headsets have strict performance constraints. We will cover retopology, baking high-poly details to normal maps, and atlasing textures in Blender before importing to Unity.'
  },
  {
    id: 'tut-005',
    title: 'Hand Tracking UI Design in Meta Quest',
    titleFa: 'طراحی رابط کاربری با ردیابی دست در متا کوئست',
    description: 'Design and implement intuitive interfaces that users can control directly with their hands, no controllers needed.',
    category: 'UI/UX',
    duration: "50 mins",
    level: 'Advanced',
    tags: ['design', 'ui', 'hand-tracking', 'meta-quest'],
    content: 'Hand tracking introduces new UX paradigms. We will explore affordances, feedback mechanisms, and implement pinch-and-drag interactions using Meta\'s Building Blocks.'
  }
];