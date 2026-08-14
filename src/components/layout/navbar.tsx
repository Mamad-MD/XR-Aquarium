"use client";

import { useState } from "react";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { useSession, signOut } from "next-auth/react";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleLocale = () => {
    const nextLocale = locale === 'fa' ? 'en' : 'fa';
    router.replace(pathname, { locale: nextLocale });
  };
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  const navLinks = [
    { href: "/", label: t('home') },
    { href: "/projects", label: t('projects') },
    { href: "/teams", label: t('teams') },
    { href: "/equipment", label: t('equipment') },
    { href: "/learn", label: t('learn') },
  ];

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-4 sm:px-6 py-4 bg-black/50 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-8 min-w-0">
          <Link href="/" className="text-lg sm:text-xl font-bold tracking-tighter shrink-0" onClick={closeMenu}>
            XR Aquarium
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-blue-400 transition-colors whitespace-nowrap">
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Desktop right side (auth + locale) */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium shrink-0">
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
                  className="text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors border border-white/10 whitespace-nowrap"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors whitespace-nowrap"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors text-white whitespace-nowrap"
                >
                  {t('register')}
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile: locale + hamburger */}
        <div className="flex md:hidden items-center gap-2 shrink-0">
          <button
            onClick={toggleLocale}
            className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-xs font-bold"
          >
            {locale === 'fa' ? 'EN' : 'FA'}
          </button>
          <button
            onClick={() => setIsOpen((v) => !v)}
            aria-label="Toggle menu"
            className="p-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown panel */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-2 border-t border-white/10 pt-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={closeMenu}
              className="px-3 py-3 rounded-md hover:bg-white/5 transition-colors text-base font-medium"
            >
              {link.label}
            </Link>
          ))}

          <div className="h-px bg-white/10 my-2" />

          {!isLoading && (
            session ? (
              <div className="flex flex-col gap-1">
                <Link
                  href="/dashboard"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-md hover:bg-white/5 transition-colors text-base font-medium"
                >
                  {t('dashboard')}
                </Link>
                <button
                  onClick={() => {
                    closeMenu();
                    signOut({ callbackUrl: '/' });
                  }}
                  className="px-3 py-3 rounded-md bg-white/10 hover:bg-white/20 transition-colors border border-white/10 text-start"
                >
                  {t('logout')}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Link
                  href="/auth/login"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-md hover:bg-white/5 transition-colors text-base font-medium"
                >
                  {t('login')}
                </Link>
                <Link
                  href="/auth/register"
                  onClick={closeMenu}
                  className="px-3 py-3 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors text-white text-center font-medium"
                >
                  {t('register')}
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </nav>
  );
}
