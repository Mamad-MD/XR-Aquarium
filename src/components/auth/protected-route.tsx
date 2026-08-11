"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";

import { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // We add a small delay to prevent layout thrashing on hydration
    // and to show the cool loading animation briefly
    const timer = setTimeout(() => {
      if (status === "loading") return;

      if (status === "unauthenticated") {
        // Redirect to login and save the attempted URL for redirecting back later (optional enhancement)
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      } else if (requiredRole && session?.user?.role !== requiredRole) {
        // If they have the wrong role, send them to dashboard or unauthorized page
        router.push("/dashboard");
      } else {
        setIsChecking(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [status, session, router, pathname, requiredRole]);

  if (status === "loading" || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse-glow" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="z-10 flex flex-col items-center gap-4"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-500 blur-md opacity-50 rounded-full animate-pulse" />
            <Loader2 className="h-12 w-12 text-cyan-400 animate-spin relative z-10" />
          </div>
          <p className="text-cyan-400 font-mono text-sm tracking-widest animate-pulse">
            AUTHENTICATING...
          </p>
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}
