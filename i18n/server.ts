import en from "./locales/en.json";
import ar from "./locales/ar.json";
import ckb from "./locales/ckb.json";
import { getLang } from "@/lib/config/api.config";

export async function getServerTranslation() {
  const lang = await getLang();
  const resources = { en, ar, ckb };
  const translation = resources[lang as keyof typeof resources] || en;

  return {
    t: (key: string, options?: any) => {
      const keys = key.split(".");
      let value: any = translation;
      for (const k of keys) {
        value = value?.[k];
      }
      if (options?.returnObjects) {
        return value;
      }
      return value || key;
    },
    i18n: {
      language: lang,
    },
  };
}
