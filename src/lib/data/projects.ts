import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "p1",
    title: "Virtual Anatomy Lab",
    titleFa: "آزمایشگاه مجازی آناتومی",
    description: "A fully immersive VR lab for medical students to explore human anatomy in 3D. Features interactive organs, layered visualization, and real-time medical data integration.",
    category: "VR",
    difficulty: "Advanced",
    techStack: ["Unity", "C#", "Meta Quest", "WebGL"],
    prerequisites: ["Unity Basics", "C# Programming", "3D Math"],
    objectives: [
      "Build a scalable VR interaction system",
      "Implement realistic hand tracking",
      "Optimize 3D models for standalone VR headsets"
    ],
    maxCapacity: 5,
    enrolledCount: 5,
    thumbnailUrl: "https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=600&h=400&fit=crop",
    mentorId: "t1",
    duration: "12 Weeks",
    status: "full"
  },
  {
    id: "p2",
    title: "AR Navigation System",
    titleFa: "سیستم ناوبری واقعیت افزوده",
    description: "Indoor AR navigation app for the university campus. Overlays directions and information on the physical world using computer vision and SLAM technology.",
    category: "AR",
    difficulty: "Intermediate",
    techStack: ["ARKit", "Swift", "CoreLocation", "RealityKit"],
    prerequisites: ["iOS Development", "Swift", "Basic AR concepts"],
    objectives: [
      "Master ARKit anchors and tracking",
      "Implement spatial UI elements",
      "Integrate mapping APIs"
    ],
    maxCapacity: 4,
    enrolledCount: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600&h=400&fit=crop",
    mentorId: "t4",
    duration: "8 Weeks",
    status: "open"
  },
  {
    id: "p3",
    title: "HoloLens Machinery Maintenance",
    titleFa: "تعمیرات ماشین‌آلات با هولولنز",
    description: "Mixed Reality training application for industrial maintenance. Provides step-by-step holographic instructions directly on physical machinery.",
    category: "MR",
    difficulty: "Advanced",
    techStack: ["Unity", "MRTK", "HoloLens 2", "Azure Spatial Anchors"],
    prerequisites: ["MRTK Experience", "C#", "Computer Vision basics"],
    objectives: [
      "Build natural UI for HoloLens",
      "Implement object recognition",
      "Create cloud-shared spatial anchors"
    ],
    maxCapacity: 3,
    enrolledCount: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    mentorId: "t1",
    duration: "10 Weeks",
    status: "in-progress"
  },
  {
    id: "p4",
    title: "WebXR Virtual Gallery",
    titleFa: "گالری مجازی وب",
    description: "An accessible virtual art gallery that works directly in the browser. Supports VR headsets, mobile devices, and standard desktops with a single codebase.",
    category: "XR",
    difficulty: "Beginner",
    techStack: ["Three.js", "React Three Fiber", "WebXR API"],
    prerequisites: ["JavaScript/TypeScript", "React basics"],
    objectives: [
      "Learn 3D rendering on the web",
      "Implement cross-platform XR controls",
      "Optimize textures and models for web delivery"
    ],
    maxCapacity: 10,
    enrolledCount: 4,
    thumbnailUrl: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=600&h=400&fit=crop",
    mentorId: "t2",
    duration: "6 Weeks",
    status: "open"
  },
  {
    id: "p5",
    title: "Metaverse Campus Ecosystem",
    titleFa: "اکوسیستم متاورس دانشگاه",
    description: "A persistent virtual campus where students can attend lectures, collaborate on projects, and socialize in a persistent digital twin of the university.",
    category: "Metaverse",
    difficulty: "Advanced",
    techStack: ["Unreal Engine 5", "C++", "Photon Networking", "AWS"],
    prerequisites: ["Unreal Engine", "Network Programming", "Backend basics"],
    objectives: [
      "Implement scalable multiplayer architecture",
      "Create an avatar customization system",
      "Build spatial voice chat"
    ],
    maxCapacity: 8,
    enrolledCount: 8,
    thumbnailUrl: "https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?w=600&h=400&fit=crop",
    mentorId: "t3",
    duration: "16 Weeks",
    status: "full"
  },
  {
    id: "p6",
    title: "Surgical Sim Pro",
    titleFa: "شبیه‌ساز حرفه‌ای جراحی",
    description: "High-fidelity VR surgical simulator with haptic feedback for realistic tissue interaction and procedure practice.",
    category: "VR",
    difficulty: "Advanced",
    techStack: ["Unreal Engine", "C++", "OpenHaptics", "SensAble Phantom"],
    prerequisites: ["C++", "Physics Simulation", "3D Math"],
    objectives: [
      "Implement soft-body physics",
      "Integrate haptic force feedback devices",
      "Create realistic fluid simulations"
    ],
    maxCapacity: 4,
    enrolledCount: 4,
    thumbnailUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?w=600&h=400&fit=crop",
    mentorId: "t5",
    duration: "14 Weeks",
    status: "completed"
  },
  {
    id: "p7",
    title: "AR Retail Try-On",
    titleFa: "پرو مجازی لباس در واقعیت افزوده",
    description: "Mobile app for virtual clothing and accessory try-on using advanced body tracking and cloth simulation.",
    category: "AR",
    difficulty: "Intermediate",
    techStack: ["ARCore", "Kotlin", "TensorFlow Lite", "OpenGL ES"],
    prerequisites: ["Android Dev", "Basic Machine Learning", "Computer Graphics"],
    objectives: [
      "Implement real-time pose estimation",
      "Create realistic cloth shading",
      "Optimize ML models for mobile"
    ],
    maxCapacity: 6,
    enrolledCount: 3,
    thumbnailUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&h=400&fit=crop",
    mentorId: "t4",
    duration: "10 Weeks",
    status: "open"
  },
  {
    id: "p8",
    title: "Historical Ruins Reconstruction",
    titleFa: "بازسازی مکان‌های تاریخی",
    description: "Educational VR experience allowing users to explore ancient Persian ruins reconstructed to their original glory.",
    category: "VR",
    difficulty: "Beginner",
    techStack: ["Unity", "Photogrammetry", "Maya", "Substance Painter"],
    prerequisites: ["3D Modeling", "Texture Baking", "Basic Unity"],
    objectives: [
      "Process photogrammetry data",
      "Optimize heavy meshes for VR",
      "Implement teleportation locomotion"
    ],
    maxCapacity: 8,
    enrolledCount: 6,
    thumbnailUrl: "https://images.unsplash.com/photo-1582845686000-844c8c7d812b?w=600&h=400&fit=crop",
    mentorId: "t2",
    duration: "8 Weeks",
    status: "in-progress"
  },
  {
    id: "p9",
    title: "Collaborative MR Architecture",
    titleFa: "معماری مشارکتی در واقعیت ترکیبی",
    description: "Multi-user MR application for architects to review and modify 3D building models together in a shared physical space.",
    category: "MR",
    difficulty: "Advanced",
    techStack: ["Unity", "Meta Quest 3", "Normcore", "BIM Integration"],
    prerequisites: ["Multiplayer Networking", "Unity C#", "Understanding of CAD/BIM"],
    objectives: [
      "Synchronize complex state across clients",
      "Implement mixed reality passthrough",
      "Parse and render large BIM datasets"
    ],
    maxCapacity: 5,
    enrolledCount: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop",
    mentorId: "t1",
    duration: "12 Weeks",
    status: "open"
  },
  {
    id: "p10",
    title: "WebXR Product Configurator",
    titleFa: "پیکربندی محصول در وب",
    description: "Interactive 3D product customizer running in the browser with AR preview capabilities for e-commerce.",
    category: "XR",
    difficulty: "Beginner",
    techStack: ["Babylon.js", "TypeScript", "HTML/CSS"],
    prerequisites: ["JavaScript", "Web Development basics"],
    objectives: [
      "Handle dynamic material swapping",
      "Implement PBR rendering on web",
      "Add WebXR AR session support"
    ],
    maxCapacity: 12,
    enrolledCount: 12,
    thumbnailUrl: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=600&h=400&fit=crop",
    mentorId: "t2",
    duration: "4 Weeks",
    status: "full"
  },
  {
    id: "p11",
    title: "Therapeutic VR Sandbox",
    titleFa: "محیط آرامش‌بخش مجازی",
    description: "Calming virtual environment designed for anxiety relief and meditation, featuring biofeedback integration.",
    category: "VR",
    difficulty: "Intermediate",
    techStack: ["Unity", "C#", "Heart Rate Sensors", "FMOD"],
    prerequisites: ["Audio Implementation", "Unity Events", "Hardware Integration"],
    objectives: [
      "Process sensor data streams",
      "Implement reactive particle systems",
      "Design spatial audio experiences"
    ],
    maxCapacity: 4,
    enrolledCount: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=600&h=400&fit=crop",
    mentorId: "t5",
    duration: "10 Weeks",
    status: "open"
  },
  {
    id: "p12",
    title: "Metaverse Event Platform",
    titleFa: "پلتفرم برگزاری رویداد در متاورس",
    description: "Scalable platform for hosting virtual conferences and concerts with spatial audio and massive concurrent user support.",
    category: "Metaverse",
    difficulty: "Advanced",
    techStack: ["Node.js", "WebRTC", "Three.js", "Redis"],
    prerequisites: ["Backend Architecture", "WebSockets", "WebRTC"],
    objectives: [
      "Handle audio mixing for 100+ users",
      "Implement spatial partitioning",
      "Create robust load balancing"
    ],
    maxCapacity: 6,
    enrolledCount: 5,
    thumbnailUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&h=400&fit=crop",
    mentorId: "t3",
    duration: "16 Weeks",
    status: "in-progress"
  },
  {
    id: "p13",
    title: "AR Language Translator",
    titleFa: "مترجم زبان با واقعیت افزوده",
    description: "Mobile app that translates text on signs and menus in real-time and overlays the translation with matching typography.",
    category: "AR",
    difficulty: "Intermediate",
    techStack: ["iOS/SwiftUI", "Vision Framework", "CoreML"],
    prerequisites: ["Swift", "Computer Vision basics", "Typography concepts"],
    objectives: [
      "Implement real-time OCR",
      "Generate custom fonts on the fly",
      "Match perspective and lighting"
    ],
    maxCapacity: 5,
    enrolledCount: 3,
    thumbnailUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=400&fit=crop",
    mentorId: "t4",
    duration: "8 Weeks",
    status: "open"
  },
  {
    id: "p14",
    title: "Drone Piloting Simulator",
    titleFa: "شبیه‌ساز پرواز پهپاد",
    description: "Realistic physics-based drone simulator in VR for training professional pilots in various weather conditions.",
    category: "VR",
    difficulty: "Intermediate",
    techStack: ["Unreal Engine 5", "Blueprints", "Chaos Physics"],
    prerequisites: ["Unreal Blueprints", "Basic Aerodynamics", "Game Controller Integration"],
    objectives: [
      "Implement accurate flight physics",
      "Create dynamic weather systems",
      "Integrate real RC transmitter input"
    ],
    maxCapacity: 6,
    enrolledCount: 6,
    thumbnailUrl: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=600&h=400&fit=crop",
    mentorId: "t1",
    duration: "10 Weeks",
    status: "full"
  },
  {
    id: "p15",
    title: "Mixed Reality Board Game",
    titleFa: "بازی رومیزی در واقعیت ترکیبی",
    description: "Tabletop RPG that uses physical miniatures tracked by computer vision to spawn animated holographic characters and environments.",
    category: "MR",
    difficulty: "Intermediate",
    techStack: ["Unity", "Vuforia", "C#"],
    prerequisites: ["Unity Basics", "Image Tracking", "Animation Controllers"],
    objectives: [
      "Track multiple physical objects simultaneously",
      "Implement grid-based logic",
      "Create dynamic occlusion"
    ],
    maxCapacity: 4,
    enrolledCount: 4,
    thumbnailUrl: "https://images.unsplash.com/photo-1611891487122-207579d67d98?w=600&h=400&fit=crop",
    mentorId: "t2",
    duration: "8 Weeks",
    status: "completed"
  },
  {
    id: "p16",
    title: "XR Accessibility Framework",
    titleFa: "چارچوب دسترسی‌پذیری برای XR",
    description: "Open-source toolkit for adding accessibility features like spatial subtitles, color-blind modes, and alternative inputs to Unity projects.",
    category: "XR",
    difficulty: "Advanced",
    techStack: ["Unity", "C#", "Editor Scripting"],
    prerequisites: ["Advanced C#", "Unity UI", "Accessibility Guidelines"],
    objectives: [
      "Create custom Unity Editor tools",
      "Implement spatial audio cues",
      "Design universal input abstraction"
    ],
    maxCapacity: 5,
    enrolledCount: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=600&h=400&fit=crop",
    mentorId: "t4",
    duration: "12 Weeks",
    status: "in-progress"
  },
  {
    id: "p17",
    title: "Haptic Glove Integration",
    titleFa: "ادغام دستکش‌های هپتیک",
    description: "R&D project focused on writing drivers and Unity wrappers for experimental force-feedback gloves to simulate weight and texture.",
    category: "VR",
    difficulty: "Advanced",
    techStack: ["C++", "C#", "Unity Native Plugins", "Serial Communication"],
    prerequisites: ["C/C++", "Hardware Interfacing", "Multithreading"],
    objectives: [
      "Write high-performance native plugins",
      "Implement inverse kinematics for hands",
      "Map physics collisions to motor forces"
    ],
    maxCapacity: 3,
    enrolledCount: 1,
    thumbnailUrl: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=600&h=400&fit=crop",
    mentorId: "t5",
    duration: "14 Weeks",
    status: "open"
  },
  {
    id: "p18",
    title: "Decentralized Metaverse Economy",
    titleFa: "اقتصاد غیرمتمرکز در متاورس",
    description: "Integrating blockchain-based ownership and trading of virtual assets within a networked 3D environment.",
    category: "Metaverse",
    difficulty: "Advanced",
    techStack: ["Solidity", "Web3.js", "React", "Three.js"],
    prerequisites: ["Smart Contract Dev", "Full-stack Web", "Cryptography basics"],
    objectives: [
      "Deploy secure ERC-721/1155 contracts",
      "Create a 3D marketplace interface",
      "Implement secure wallet integration in 3D space"
    ],
    maxCapacity: 4,
    enrolledCount: 4,
    thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f4ec67d?w=600&h=400&fit=crop",
    mentorId: "t3",
    duration: "10 Weeks",
    status: "full"
  },
  {
    id: "p19",
    title: "AR Maintenance Manuals",
    titleFa: "دفترچه راهنمای تعمیرات با AR",
    description: "Enterprise AR application for automotive repair, highlighting parts and animating assembly/disassembly steps.",
    category: "AR",
    difficulty: "Beginner",
    techStack: ["Unity", "AR Foundation", "CAD Importers"],
    prerequisites: ["Unity Basics", "Animation Timeline"],
    objectives: [
      "Import and optimize complex CAD data",
      "Create clear step-by-step animations",
      "Implement intuitive UI in AR"
    ],
    maxCapacity: 6,
    enrolledCount: 3,
    thumbnailUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=600&h=400&fit=crop",
    mentorId: "t1",
    duration: "6 Weeks",
    status: "open"
  },
  {
    id: "p20",
    title: "VR Escape Room Physics",
    titleFa: "فیزیک اتاق فرار در VR",
    description: "Development of a highly interactive VR puzzle game focusing on complex physical interactions like levers, gears, and fluid dynamics.",
    category: "VR",
    difficulty: "Intermediate",
    techStack: ["Unity", "C#", "Nvidia PhysX"],
    prerequisites: ["Unity Physics", "C# Logic", "Game Design fundamentals"],
    objectives: [
      "Implement robust grabbing mechanics",
      "Design physics-based puzzles",
      "Optimize physics calculations"
    ],
    maxCapacity: 5,
    enrolledCount: 2,
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop",
    mentorId: "t2",
    duration: "12 Weeks",
    status: "in-progress"
  }
];
