"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Package, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";
import type { Equipment } from "@prisma/client";

interface MyRequest {
  id: string;
  equipmentId: string;
  quantity: number;
  status: string;
}

interface EquipmentCardProps {
  item: Equipment;
  canRequest: boolean;
  existingRequest: MyRequest | null;
}

export function EquipmentCard({ item, canRequest, existingRequest }: EquipmentCardProps) {
  const t = useTranslations("Equipment");
  const locale = useLocale();
  const isFa = locale === "fa";
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isAvailable = item.availableQuantity > 0;

  const handleRequest = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/equipment/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ equipmentId: item.id, quantity: 1 }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("requestError"));
        return;
      }
      toast.success(data.message || t("requestSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRelease = async () => {
    if (!existingRequest) return;
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/equipment/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: existingRequest.id }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("releaseError"));
        return;
      }
      toast.success(data.message || t("releaseSuccess"));
      router.refresh();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className="glass rounded-xl overflow-hidden border border-white/10 flex flex-col h-full transition-all duration-300 hover:neon-cyan p-5"
    >
      <div className="flex items-start justify-between mb-4 gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-white leading-tight truncate">
              {isFa && item.nameFa ? item.nameFa : item.name}
            </h3>
          </div>
        </div>
        <Badge
          variant="outline"
          className={`shrink-0 ${isAvailable ? "text-green-400 border-green-400/30" : "text-red-400 border-red-400/30"}`}
        >
          {item.availableQuantity}/{item.totalQuantity}
        </Badge>
      </div>

      {item.description && (
        <p className="text-sm text-zinc-300 line-clamp-2 mb-4 flex-1">{item.description}</p>
      )}

      <div className="mt-auto">
        {existingRequest ? (
          existingRequest.status === "PENDING" ? (
            <Button disabled variant="secondary" className="w-full bg-yellow-500/10 text-yellow-400">
              {t("requestPending")}
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={handleRelease}
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Check className="w-4 h-4 me-2 text-green-400" />
              {t("assignedToYourTeam")} — {t("release")}
            </Button>
          )
        ) : (
          <Button
            disabled={!canRequest || !isAvailable || isSubmitting}
            onClick={handleRequest}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white disabled:opacity-40"
          >
            {isSubmitting
              ? t("requesting")
              : !isAvailable
              ? t("outOfStock")
              : t("requestItem")}
          </Button>
        )}
      </div>
    </motion.div>
  );
}
