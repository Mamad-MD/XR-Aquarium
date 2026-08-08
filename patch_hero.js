const fs = require('fs');
const file = 'src/components/home/hero-section.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import Link from "next/link";', `import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";`);

content = content.replace('export function HeroSection() {', `export function HeroSection() {
  const t = useTranslations('Hero');`);

content = content.replace('Next Cohort Starts Soon', "{t('badge')}");
content = content.replace('XR Lab Aquarium', "{t('title')}");
content = content.replace('فضای آموزشی آکواریوم', "{t('subtitle')}");
content = content.replace('An immersive 2-month educational space where ~50 selected students dive deep into Virtual, Augmented, and Mixed Reality. Build real-world projects, get mentored by industry experts, and shape the future of spatial computing.', "{t('description')}");
content = content.replace('Explore Projects', "{t('exploreProjects')}");
content = content.replace('Join Cohort', "{t('joinCohort')}");

// Also update the stats to use translations
// The stats array is outside the component, so we'll move it inside or map it inline
content = content.replace(
  'const stats = [\n  { icon: Boxes, label: "20+ Projects", value: "پروژه‌ها" },\n  { icon: Users, label: "50 Students", value: "دانشجویان" },\n  { icon: Users, label: "5 Mentors", value: "مربیان" }, // Using Users as a fallback for mentor\n  { icon: Clock, label: "2 Months", value: "مدت دوره" },\n];',
  ''
);

content = content.replace('const t = useTranslations(\'Hero\');', `const t = useTranslations('Hero');

  const stats = [
    { icon: Boxes, value: "20+", label: t('stats.projects') },
    { icon: Users, value: "50", label: t('stats.students') },
    { icon: Users, value: "5", label: t('stats.mentors') },
    { icon: Clock, value: "2", label: t('stats.duration') },
  ];`);

content = content.replace(
  '<span className="text-2xl font-bold text-white mb-1">{stat.label.split(" ")[0]}</span>\n                <span className="text-sm text-gray-400 uppercase tracking-wider">{stat.label.split(" ")[1]}</span>\n                <span className="text-xs text-gray-500 mt-2 block" dir="rtl">{stat.value}</span>',
  '<span className="text-2xl font-bold text-white mb-1">{stat.value}</span>\n                <span className="text-sm text-gray-400 uppercase tracking-wider block text-center">{stat.label}</span>'
);

fs.writeFileSync(file, content);
