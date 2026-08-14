import { getTranslations } from "next-intl/server";
import { Rocket, Target, Eye } from "lucide-react";

export default async function AboutPage() {
  const t = await getTranslations("AboutPage");

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{t("title")}</h1>
        <p className="text-zinc-500 max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="glass-strong rounded-xl p-6 md:p-8 mb-8">
        <p className="text-zinc-300 leading-relaxed text-base">{t("body")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 border border-white/10">
          <Rocket className="w-8 h-8 text-cyan-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{t("mission")}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{t("missionBody")}</p>
        </div>
        <div className="glass rounded-xl p-6 border border-white/10">
          <Eye className="w-8 h-8 text-purple-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{t("vision")}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{t("visionBody")}</p>
        </div>
        <div className="glass rounded-xl p-6 border border-white/10">
          <Target className="w-8 h-8 text-pink-400 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">{t("values")}</h3>
          <p className="text-sm text-zinc-400 leading-relaxed">{t("valuesBody")}</p>
        </div>
      </div>
    </div>
  );
}
