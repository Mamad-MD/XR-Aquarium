"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, X, Package, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslations, useLocale } from "next-intl";

export interface AdminEquipmentItem {
  id: string;
  name: string;
  nameFa: string | null;
  totalQuantity: number;
  availableQuantity: number;
}

export interface AdminEquipmentRequestItem {
  id: string;
  quantity: number;
  status: string;
  equipment: { id: string; name: string; nameFa: string | null };
  team: { id: string; name: string; nameFa: string | null };
  requestedBy: { name: string | null; nameFa: string | null };
}

interface AdminEquipmentPanelProps {
  equipment: AdminEquipmentItem[];
  pendingRequests: AdminEquipmentRequestItem[];
  assignedRequests: AdminEquipmentRequestItem[];
}

export function AdminEquipmentPanel({
  equipment,
  pendingRequests,
  assignedRequests,
}: AdminEquipmentPanelProps) {
  const t = useTranslations("Dashboard");
  const tEquip = useTranslations("Equipment");
  const locale = useLocale();
  const isFa = locale === "fa";
  const router = useRouter();

  const [form, setForm] = useState({ name: "", nameFa: "", description: "", totalQuantity: "1" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async () => {
    if (!form.name.trim() || !form.totalQuantity) {
      toast.error(tEquip("nameAndQuantityRequired"));
      return;
    }
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/equipment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message || tEquip("addSuccess"));
      setForm({ name: "", nameFa: "", description: "", totalQuantity: "1" });
      router.refresh();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const respondToRequest = async (requestId: string, status: "APPROVED" | "REJECTED") => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/admin/equipment/request", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, status }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const revoke = async (requestId: string) => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/equipment/return", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        toast.error(data.message || t("actionError"));
        return;
      }
      toast.success(data.message);
      router.refresh();
    } catch (error) {
      toast.error(t("unexpectedError"));
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <div className="flex flex-col gap-6">
        <Card className="glass border-slate-800 h-fit">
          <CardHeader>
            <CardTitle>{tEquip("addNew")}</CardTitle>
            <CardDescription>{tEquip("addNewDesc")}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <Label>{tEquip("nameEn")}</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="bg-slate-900/50 border-slate-800"
                  placeholder="Meta Quest 3"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label>{tEquip("nameFa")}</Label>
                <Input
                  dir="rtl"
                  value={form.nameFa}
                  onChange={(e) => setForm({ ...form, nameFa: e.target.value })}
                  className="bg-slate-900/50 border-slate-800"
                  placeholder="متا کوئست ۳"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label>{tEquip("description")}</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="bg-slate-900/50 border-slate-800"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>{tEquip("totalQuantity")}</Label>
              <Input
                type="number"
                min={1}
                value={form.totalQuantity}
                onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })}
                className="bg-slate-900/50 border-slate-800"
              />
            </div>
            <Button
              onClick={handleCreate}
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700 text-white mt-2"
            >
              <Package className="w-4 h-4 me-2" /> {tEquip("addNew")}
            </Button>
          </CardContent>
        </Card>

        <Card className="glass border-slate-800 h-fit">
          <CardHeader>
            <CardTitle>{tEquip("inventory")}</CardTitle>
          </CardHeader>
          <CardContent>
            {equipment.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">{tEquip("noEquipment")}</div>
            ) : (
              <div className="flex flex-col gap-2">
                {equipment.map((eq) => (
                  <div
                    key={eq.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-slate-900/20"
                  >
                    <p className="text-sm font-medium text-white" dir="auto">
                      {isFa && eq.nameFa ? eq.nameFa : eq.name}
                    </p>
                    <span className="text-xs text-slate-400 font-sans" dir="ltr">
                      {eq.availableQuantity}/{eq.totalQuantity}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col gap-6">
        <Card className="glass border-slate-800 h-fit">
          <CardHeader>
            <CardTitle>{tEquip("pendingRequestsAdmin")}</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingRequests.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">{tEquip("noPendingRequests")}</div>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingRequests.map((r) => (
                  <div
                    key={r.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-slate-800 bg-slate-900/40"
                  >
                    <div>
                      <p className="text-sm font-medium text-white" dir="auto">
                        {isFa && r.equipment.nameFa ? r.equipment.nameFa : r.equipment.name}{" "}
                        <span className="text-slate-500 font-sans">× {r.quantity}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1" dir="auto">
                        {r.team.name} — {isFa && r.requestedBy.nameFa ? r.requestedBy.nameFa : r.requestedBy.name}
                      </p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-green-500/20 hover:bg-green-500/30 text-green-400"
                        disabled={isSubmitting}
                        onClick={() => respondToRequest(r.id, "APPROVED")}
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        disabled={isSubmitting}
                        onClick={() => respondToRequest(r.id, "REJECTED")}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass border-slate-800 h-fit">
          <CardHeader>
            <CardTitle>{tEquip("assignedEquipment")}</CardTitle>
          </CardHeader>
          <CardContent>
            {assignedRequests.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">{tEquip("noAssigned")}</div>
            ) : (
              <div className="flex flex-col gap-2">
                {assignedRequests.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-slate-800/60 bg-slate-900/20"
                  >
                    <div>
                      <p className="text-sm font-medium text-white" dir="auto">
                        {isFa && r.equipment.nameFa ? r.equipment.nameFa : r.equipment.name}{" "}
                        <span className="text-slate-500 font-sans">× {r.quantity}</span>
                      </p>
                      <p className="text-xs text-slate-500 mt-1" dir="auto">{r.team.name}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => revoke(r.id)}
                      className="border-slate-700 text-slate-300 hover:bg-slate-800"
                    >
                      <RotateCcw className="w-3.5 h-3.5 me-1" /> {tEquip("revoke")}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
