"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Dvojezičnost: bosanski (podrazumevano) + engleski.
 * Izbor se čuva u kolačiću `lang` (server ga čita u layout-u => nema treptanja pri učitavanju).
 *
 *   <L bs="Naslov" en="Title" />           — inline tekst
 *   const t = useT(); t({ bs: "...", en: "..." })  — kad treba string (props)
 *   Loc = string | { bs, en }              — tip za props koji primaju prevod
 */
export type Lang = "bs" | "en";
export type Loc = string | { bs: string; en: string };

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "bs", setLang: () => {} });

export function LangProvider({ initial, children }: { initial: Lang; children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initial);
  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
  }, []);
  useEffect(() => {
    document.documentElement.lang = lang;
    // tekst menja visinu blokova => ScrollTrigger mora ponovo da izmeri
    window.dispatchEvent(new Event("sarto:lang"));
  }, [lang]);
  return <Ctx.Provider value={{ lang, setLang }}>{children}</Ctx.Provider>;
}

export const useLang = () => useContext(Ctx);

export function useT() {
  const { lang } = useLang();
  return useCallback((v: Loc) => (typeof v === "string" ? v : v[lang]), [lang]);
}

/** Inline prevod. Može i ReactNode (za rečenice sa linkovima/kurzivom). */
export function L({ bs, en }: { bs: ReactNode; en: ReactNode }) {
  const { lang } = useLang();
  return <>{lang === "en" ? en : bs}</>;
}
