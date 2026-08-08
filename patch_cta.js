const fs = require('fs');
const file = 'src/components/home/cta-section.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import Link from "next/link";', `import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";`);

content = content.replace('export function CTASection() {', `export function CTASection() {
  const t = useTranslations('CTA');`);

content = content.replace('Ready to Enter the Aquarium?', "{t('title')}");
content = content.replace('آماده ورود به آکواریوم هستید؟', "{t('subtitle')}");
content = content.replace('Join the next cohort of spatial computing innovators. Spaces are limited\n              and highly competitive. Apply now to secure your spot in the lab.', "{t('description')}");
content = content.replace('Apply Now', "{t('applyNow')}");
content = content.replace('View Projects', "{t('viewProjects')}");

fs.writeFileSync(file, content);
