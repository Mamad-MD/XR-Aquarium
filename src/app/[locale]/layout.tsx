import type { Metadata } from "next";
import { Geist, Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "../globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const vazirmatn = Vazirmatn({
  subsets: ["arabic", "latin"],
  variable: "--font-vazirmatn",
});

export const metadata: Metadata = {
  title: "XR Lab Aquarium | آزمایشگاه XR - فضای آموزشی آکواریوم",
  description: "Educational platform for XR Lab",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === 'fa' ? 'rtl' : 'ltr'} className="dark" suppressHydrationWarning>
      <body className={`${geist.variable} ${vazirmatn.variable} font-sans leading-relaxed antialiased bg-black text-white min-h-screen flex flex-col`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <SessionProvider>
            <Navbar />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
            <Toaster theme="dark" />
          </SessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
