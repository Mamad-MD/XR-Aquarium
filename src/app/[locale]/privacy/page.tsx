import { getTranslations } from "next-intl/server";
import { ShieldCheck } from "lucide-react";

export default async function PrivacyPage() {
  const t = await getTranslations("PrivacyPage");
  const sections = ["dataCollection", "dataUse", "dataSharing", "userRights", "contactUs"] as const;

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-3xl">
      <div className="flex flex-col items-center mb-12 text-center">
        <ShieldCheck className="w-12 h-12 text-cyan-400 mb-4" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{t("title")}</h1>
        <p className="text-zinc-500 max-w-2xl">{t("lastUpdated")}</p>
      </div>

      <div className="flex flex-col gap-6">
        {sections.map((key) => (
          <div key={key} className="glass rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">{t(`${key}Title`)}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">{t(`${key}Body`)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
