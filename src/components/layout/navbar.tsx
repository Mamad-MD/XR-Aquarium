"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();
  const isLoading = status === "loading";

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 bg-black/50 backdrop-blur-md text-white">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="text-xl font-bold tracking-tighter">
            XR Aquarium <span className="text-xs text-gray-400 font-normal mr-2 hidden sm:inline">آکواریوم XR</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <Link href="/projects" className="hover:text-blue-400 transition-colors">Projects</Link>
            <Link href="/learn" className="hover:text-blue-400 transition-colors">Learn</Link>
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors">Dashboard</Link>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm font-medium">
          {!isLoading && (
            session ? (
              <div className="flex items-center space-x-4">
                <Link
                  href="/dashboard"
                  className="hidden sm:block text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 transition-colors border border-white/10"
                >
                  Logout / خروج
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors text-white"
                >
                  Register
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
