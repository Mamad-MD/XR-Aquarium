import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="border-t border-white/10 bg-black/80 py-8 text-sm text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <p>© {new Date().getFullYear()} XR Lab Aquarium. {t('rights')}</p>
          <p className="text-xs text-gray-500 mt-1">آزمایشگاه واقعیت توسعه‌یافته - فضای آموزشی آکواریوم</p>
        </div>

        <div className="flex gap-4">
          <a href="#" className="hover:text-white transition-colors">{t('about')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('contact')}</a>
          <a href="#" className="hover:text-white transition-colors">{t('privacy')}</a>
        </div>
      </div>
    </footer>
  );
}
