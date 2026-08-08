const fs = require('fs');
const file = 'src/components/home/about-section.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import { Calendar, Code, TestTube, Trophy, Users } from "lucide-react";', `import { Calendar, Code, TestTube, Trophy, Users } from "lucide-react";
import { useTranslations } from "next-intl";`);

// Remove timelineItems from outside
content = content.replace(
  /const timelineItems = \[\s*\{[\s\S]*?\}\s*\];\s*/,
  ''
);

// Add to component
content = content.replace('export function AboutSection() {', `export function AboutSection() {
  const t = useTranslations('About');

  const timelineItems = [
    {
      week: t('timeline.w1.week'),
      title: t('timeline.w1.title'),
      description: t('timeline.w1.desc'),
      icon: Users,
    },
    {
      week: t('timeline.w2.week'),
      title: t('timeline.w2.title'),
      description: t('timeline.w2.desc'),
      icon: Code,
    },
    {
      week: t('timeline.w3.week'),
      title: t('timeline.w3.title'),
      description: t('timeline.w3.desc'),
      icon: Calendar,
    },
    {
      week: t('timeline.w4.week'),
      title: t('timeline.w4.title'),
      description: t('timeline.w4.desc'),
      icon: TestTube,
    },
    {
      week: t('timeline.w5.week'),
      title: t('timeline.w5.title'),
      description: t('timeline.w5.desc'),
      icon: Trophy,
    },
  ];`);

content = content.replace('About the Aquarium', "{t('title')}");
content = content.replace('The XR Lab Aquarium is an intensive, hands-on incubator for spatial computing talent.\n            Over the course of two months, participants are immersed in a high-pressure, high-support\n            environment to build functional XR prototypes that solve real-world problems.', "{t('description')}");

fs.writeFileSync(file, content);
