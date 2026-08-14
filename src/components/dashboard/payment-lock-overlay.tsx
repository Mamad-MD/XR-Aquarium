// DESTINATION: src/components/dashboard/payment-lock-overlay.tsx (new file)
"use client";

import { Lock } from "lucide-react";
import { useLocale } from "next-intl";

interface PaymentLockOverlayProps {
  children: React.ReactNode;
}

export function PaymentLockOverlay({ children }: PaymentLockOverlayProps) {
  const locale = useLocale();
  const isFa = locale === "fa";

  return (
    <div className="relative">
      <div
        className="pointer-events-none select-none blur-sm opacity-40"
        aria-hidden="true"
      >
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="glass-strong border border-yellow-500/30 rounded-xl px-6 py-8 max-w-sm text-center shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          <Lock className="w-10 h-10 text-yellow-400 mx-auto mb-4" />
          <p className="text-lg font-bold text-yellow-400 mb-2">
            {isFa ? "در انتظار پرداخت" : "Payment Pending"}
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            {isFa
              ? "لطفاً به پشتیبانی دوره مراجعه کنید."
              : "Please contact course support."}
          </p>
        </div>
      </div>
    </div>
  );
}
