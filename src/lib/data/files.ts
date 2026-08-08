import { DownloadableFile } from '@/types';

export const downloadableFiles: DownloadableFile[] = [
  {
    id: 'file-001',
    name: 'XR Aquarium Environment Assets',
    nameFa: 'مجموعه مدل‌های محیطی آکواریوم XR',
    description: 'A comprehensive pack of low-poly aquatic plants, rocks, and terrain suitable for mobile VR.',
    fileSize: "125 MB",
    fileType: 'application/zip',
    downloadUrl: 'https://example.com/downloads/xr-aqua-assets.zip',
    category: '3D Assets',
    uploadedAt: '2026-08-01T08:30:00Z'
  },
  {
    id: 'file-002',
    name: 'Fish AI Behavior Scripts',
    nameFa: 'اسکریپت‌های هوش مصنوعی رفتار ماهی‌ها',
    description: 'Unity C# scripts implementing boids algorithm for realistic schooling and obstacle avoidance.',
    fileSize: "45 KB",
    fileType: 'application/zip',
    downloadUrl: 'https://example.com/downloads/fish-ai-scripts.zip',
    category: 'Code Templates',
    uploadedAt: '2026-08-05T14:15:00Z'
  },
  {
    id: 'file-003',
    name: 'Underwater Audio Ambience Pack',
    nameFa: 'مجموعه صداهای محیطی زیر آب',
    description: 'High-quality spatial audio loops including bubbles, deep ocean rumbles, and marine life clicks.',
    fileSize: "350 MB",
    fileType: 'application/zip',
    downloadUrl: 'https://example.com/downloads/underwater-audio.zip',
    category: 'Audio Resources',
    uploadedAt: '2026-08-07T11:45:00Z'
  },
  {
    id: 'file-004',
    name: 'Water Shader Graph Reference',
    nameFa: 'مرجع گراف سایه‌زن آب',
    description: 'A PDF guide and accompanying Unity package for the advanced water shader used in the main exhibit.',
    fileSize: "15 MB",
    fileType: 'application/pdf',
    downloadUrl: 'https://example.com/downloads/water-shader-guide.pdf',
    category: 'Guides & Documentation',
    uploadedAt: '2026-08-08T09:00:00Z'
  }
];