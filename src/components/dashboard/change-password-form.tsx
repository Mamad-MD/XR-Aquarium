"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("رمز عبور جدید و تکرار آن یکسان نیستند.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("رمز عبور جدید باید حداقل ۶ کاراکتر باشد.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error("خطا در ارتباط با سرور");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right max-w-sm mt-4">
      <div className="flex flex-col gap-2">
        <Label>رمز عبور فعلی</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="pl-10 pr-3 bg-slate-900/50 border-slate-800 text-left"
            dir="ltr"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>رمز عبور جدید</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="pl-10 pr-3 bg-slate-900/50 border-slate-800 text-left"
            dir="ltr"
            required
          />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>تکرار رمز عبور جدید</Label>
        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="pl-10 pr-3 bg-slate-900/50 border-slate-800 text-left"
            dir="ltr"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <Button type="submit" disabled={isLoading} className="bg-cyan-600 hover:bg-cyan-700 text-white mt-2">
        {isLoading ? "در حال ثبت..." : "تغییر رمز عبور"}
      </Button>
    </form>
  );
}
