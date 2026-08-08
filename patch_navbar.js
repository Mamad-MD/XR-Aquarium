const fs = require('fs');
const file = 'src/components/layout/navbar.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('import Link from "next/link";', `import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";`);

content = content.replace('export function Navbar() {', `export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'fa' ? 'en' : 'fa';
    router.replace(pathname, { locale: nextLocale });
  };`);

content = content.replace(/mr-2/g, 'me-2');
content = content.replace(/space-x-/g, 'space-x-reverse space-x-');

content = content.replace('XR Aquarium <span className="text-xs text-gray-400 font-normal me-2 hidden sm:inline">آکواریوم XR</span>', 'XR Aquarium');
content = content.replace('Logout / خروج', '{t(\'logout\')}');
content = content.replace('Home</Link>', '{t(\'home\')}</Link>');
content = content.replace('Projects</Link>', '{t(\'projects\')}</Link>');
content = content.replace('Learn</Link>', '{t(\'learn\')}</Link>');
content = content.replace('Dashboard</Link>', '{t(\'dashboard\')}</Link>');
content = content.replace('>Dashboard<', '>{t(\'dashboard\')}<');
content = content.replace('>Login<', '>{t(\'login\')}<');
content = content.replace('>Register<', '>{t(\'register\')}<');

// Add language switcher
content = content.replace(
  '{!isLoading && (',
  `<button 
            onClick={toggleLocale}
            className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-xs font-bold"
          >
            {locale === 'fa' ? 'EN' : 'FA'}
          </button>
          
          {!isLoading && (`
);

fs.writeFileSync(file, content);
