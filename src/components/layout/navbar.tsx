"use client";

import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const toggleLocale = () => {
    const nextLocale = locale === 'fa' ? 'en' : 'fa';
    router.replace(pathname, { locale: nextLocale });
  };
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 bg-black/50 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center  gap-8">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            XR Aquarium
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors">{t('home')}</Link>
            <Link href="/projects" className="hover:text-blue-400 transition-colors">{t('projects')}</Link>
            <Link href="/teams" className="hover:text-blue-400 transition-colors">{t('teams')}</Link>
            <Link href="/equipment" className="hover:text-blue-400 transition-colors">{t('equipment')}</Link>
            <Link href="/learn" className="hover:text-blue-400 transition-colors">{t('learn')}</Link>
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors">{t('dashboard')}</Link>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium">
          <button 
            onClick={toggleLocale}
            className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-xs font-bold"
          >
            {locale === 'fa' ? 'EN' : 'FA'}
          </button>
          
          {!isLoading && (
            session ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-gray-300 hover:text-white transition-colors"
                >
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors text-white"
                >
                  {t('register')}
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
