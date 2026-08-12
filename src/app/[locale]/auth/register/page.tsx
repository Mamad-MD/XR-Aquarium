"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, User as UserIcon, BadgeCheck } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !studentId || !password || !confirmPassword) {
      setError("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }

    if (password !== confirmPassword) {
      setError("رمز عبور و تکرار آن یکسان نیستند.");
      return;
    }

    if (password.length < 6) {
      setError("رمز عبور باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    // تبدیل شماره دانشجویی به فرمت ایمیل
    const emailPayload = studentId.includes("@") ? studentId : `${studentId}@xrlab.ir`;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: emailPayload, password, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "خطایی در هنگام ثبت‌نام رخ داد.");
        return;
      }

      const res = await signIn("credentials", { email: emailPayload, password, redirect: false });

      if (res?.error) {
        setError("ثبت‌نام انجام شد اما ورود خودکار با خطا مواجه شد.");
      } else {
        toast.success("حساب کاربری با موفقیت ساخته شد!");
        router.push("/dashboard");
      }
    } catch (err) {
      setError("یک خطای غیرمنتظره رخ داد.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background py-10" dir="rtl">
      {/* Decorative Orbs */}
      <div className="absolute top-1/4 end-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 start-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] animate-pulse-glow" style={{ animationDelay: "1s" }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md z-10 p-4"
      >
        <Card className="glass-strong border-gradient relative overflow-hidden">
          <CardHeader className="flex flex-col gap-4 text-center pb-6">
            <CardTitle className="text-3xl font-bold tracking-tight gradient-text">عضویت در آکواریوم</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              ثبت‌نام در فضای آموزشی آزمایشگاه XR
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">
              <div className="flex flex-col gap-3">
                <Label htmlFor="name">نام و نام خانوادگی</Label>
                <div className="relative">
                  <BadgeCheck className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="مثال: علی احمدی"
                    className="pr-10 pl-3 bg-input/50 border-white/10 focus-visible:ring-purple-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Label htmlFor="studentId">شماره دانشجویی</Label>
                <div className="relative">
                  <UserIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="studentId"
                    type="text"
                    dir="rtl"
                    placeholder="مثال: 40498763"
                    className="pr-10 pl-3 bg-input/50 border-white/10 focus-visible:ring-purple-500 text-left"
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
                    className="pr-10 pl-10 bg-input/50 border-white/10 focus-visible:ring-purple-500 text-left"
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

              <div className="flex flex-col gap-3">
                <Label htmlFor="confirmPassword">تکرار رمز عبور</Label>
                <div className="relative">
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    dir="ltr"
                    placeholder="••••••••"
                    className="pr-10 pl-3 bg-input/50 border-white/10 focus-visible:ring-purple-500 text-left"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
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
                className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-white border-0 neon-purple mt-4 text-lg"
              >
                ایجاد حساب کاربری
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center pt-2">
            <div className="text-sm text-muted-foreground mt-2">
              قبلاً ثبت‌نام کرده‌اید؟{" "}
              <Link href="/auth/login" className="text-purple-400 hover:text-purple-300 transition-colors font-medium">
                وارد شوید
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
