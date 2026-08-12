"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User as UserIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();

  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // تبدیل شماره دانشجویی به فرمت ایمیل برای تطابق با دیتابیس
    const emailPayload = studentId.includes("@") ? studentId : `${studentId}@xrlab.ir`;

    const res = await signIn("credentials", { email: emailPayload, password, redirect: false });

    if (res?.error) {
      setError("اطلاعات وارد شده اشتباه است. لطفاً دوباره تلاش کنید.");
    } else {
      toast.success("با موفقیت وارد شدید!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background" dir="rtl">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 end-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-4"
      >
        <Card className="glass-strong border-gradient relative overflow-hidden">
          <CardHeader className="flex flex-col gap-4 text-center pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight gradient-text">خوش‌آمدید</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              ورود به فضای آزمایشگاه XR
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
              <div className="flex flex-col gap-3">
                <Label htmlFor="studentId">شماره دانشجویی</Label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="studentId"
                    type="text"
                    dir="rtl"
                    placeholder="مثال: 40498763"
                    className="pr-10 pl-3 bg-input/50 border-white/10 focus-visible:ring-cyan-500"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="password">رمز عبور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    placeholder="••••••••"
                    className="pr-10 pl-10 bg-input/50 border-white/10 focus-visible:ring-cyan-500 text-left"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-destructive text-sm font-medium text-center mt-2"
                >
                  {error}
                </motion.p>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-white border-0 neon-cyan mt-4 text-lg"
              >
                ورود
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 pt-2">
            <div className="text-sm text-center text-muted-foreground mt-4">
              حساب کاربری ندارید؟{" "}
              <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium">
                ثبت‌نام کنید
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
