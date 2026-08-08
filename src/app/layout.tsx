import type { Metadata } from "next";
import { Geist, Vazirmatn } from "next/font/google";
import { Toaster } from "sonner";
import { SessionProvider } from "@/components/providers/session-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" className="dark">
      <body className={`${geist.variable} ${vazirmatn.variable} font-sans antialiased bg-black text-white min-h-screen flex flex-col`}>
        <SessionProvider>
          <Navbar />
          <main className="flex-1 flex flex-col">
            {children}
          </main>
          <Footer />
          <Toaster theme="dark" />
        </SessionProvider>
      </body>
    </html>
  );
}
