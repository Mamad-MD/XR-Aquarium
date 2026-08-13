"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { EquipmentCard } from "@/components/equipment/equipment-card";
import { useTranslations } from "next-intl";
import type { Equipment } from "@prisma/client";

interface MyRequest {
  id: string;
  equipmentId: string;
  quantity: number;
  status: string;
}

interface EquipmentClientProps {
  equipment: Equipment[];
  isLeader: boolean;
  teamStatus: string | null;
  myTeamRequests: MyRequest[];
}

export function EquipmentClient({
  equipment,
  isLeader,
  teamStatus,
  myTeamRequests,
}: EquipmentClientProps) {
  const t = useTranslations("Equipment");

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen">
      <div className="flex flex-col items-center mb-12 text-center">
        <motion.h1
          className="text-4xl md:text-5xl font-bold mb-4 gradient-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {t("title")}
        </motion.h1>
        <motion.p
          className="text-zinc-500 max-w-2xl"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {t("subtitle")}
        </motion.p>
      </div>

      {isLeader && teamStatus !== "APPROVED" && (
        <div className="glass-strong rounded-xl p-4 mb-8 text-center text-sm text-yellow-400 border border-yellow-500/20">
          {t("teamNotApprovedNotice")}
        </div>
      )}

      {!isLeader && (
        <div className="glass-strong rounded-xl p-4 mb-8 text-center text-sm text-zinc-400 border border-white/10">
          {t("onlyLeaderNotice")}
        </div>
      )}

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
      >
        {equipment.map((item) => {
          const existingRequest = myTeamRequests.find((r) => r.equipmentId === item.id);
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <EquipmentCard
                item={item}
                canRequest={isLeader && teamStatus === "APPROVED"}
                existingRequest={existingRequest || null}
              />
            </motion.div>
          );
        })}

        {equipment.length === 0 && (
          <div className="col-span-full text-center py-20 text-zinc-500 flex flex-col items-center gap-3">
            <Package className="w-12 h-12 text-zinc-700" />
            {t("noEquipment")}
          </div>
        )}
      </motion.div>
    </div>
  );
}
