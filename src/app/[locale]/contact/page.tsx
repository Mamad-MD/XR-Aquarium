import { getTranslations } from "next-intl/server";
import { Mail, MapPin, MessageCircle } from "lucide-react";

export default async function ContactPage() {
  const t = await getTranslations("ContactPage");

  return (
    <div className="container mx-auto px-4 py-24 min-h-screen max-w-4xl">
      <div className="flex flex-col items-center mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 gradient-text">{t("title")}</h1>
        <p className="text-zinc-500 max-w-2xl">{t("subtitle")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass rounded-xl p-6 border border-white/10 text-center">
          <Mail className="w-8 h-8 text-cyan-400 mb-4 mx-auto" />
          <h3 className="text-base font-semibold text-white mb-2">{t("email")}</h3>
          <a href={`mailto:${t("emailAddress")}`} className="text-sm text-cyan-400 hover:underline" dir="ltr">
            {t("emailAddress")}
          </a>
        </div>
        <div className="glass rounded-xl p-6 border border-white/10 text-center">
          <MessageCircle className="w-8 h-8 text-purple-400 mb-4 mx-auto" />
          <h3 className="text-base font-semibold text-white mb-2">{t("social")}</h3>
          <p className="text-sm text-zinc-400" dir="ltr">{t("socialHandle")}</p>
        </div>
        <div className="glass rounded-xl p-6 border border-white/10 text-center">
          <MapPin className="w-8 h-8 text-pink-400 mb-4 mx-auto" />
          <h3 className="text-base font-semibold text-white mb-2">{t("location")}</h3>
          <p className="text-sm text-zinc-400">{t("locationBody")}</p>
        </div>
      </div>

      <div className="glass-strong rounded-xl p-6 md:p-8 mt-8 text-center">
        <p className="text-zinc-300 leading-relaxed">{t("note")}</p>
      </div>
    </div>
  );
}
