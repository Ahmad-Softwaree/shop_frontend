"use client";

import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { getCookie } from "@/lib/config/cookie.config";
import { ENUMs } from "@/lib/enums";
import i18n from "@/i18n/i18n";

function LanguageSetup() {
  useEffect(() => {
    const cookieLang = getCookie(ENUMs.GLOBAL.LANG_COOKIE);
    let langToUse = ENUMs.GLOBAL.DEFAULT_LANG as string;

    if (cookieLang && i18n.languages.includes(cookieLang)) {
      langToUse = cookieLang;
    }

    // Only change if different from current
    if (i18n.language !== langToUse) {
      i18n.changeLanguage(langToUse);
    }

    document.body.classList.remove(
      "english_font",
      "arabic_font",
      "kurdish_font"
    );

    if (langToUse === "en") {
      document.body.classList.add("english_font");
      document.dir = "ltr";
    } else if (langToUse === "ar") {
      document.body.classList.add("arabic_font");
      document.dir = "rtl";
    } else if (langToUse === "ckb") {
      document.body.classList.add("kurdish_font");
      document.dir = "rtl";
    }
  }, []);

  return null;
}

export default function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render children until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <LanguageSetup />
      {children}
    </I18nextProvider>
  );
}
