"use client";

import { Rich } from "./Rich";
import { useT, type Loc } from "@/lib/i18n";

/** Rich (kurziv + dijamant tačka) sa prevodom — za server stranice koje ne mogu da koriste useT. */
export function LRich({ text, lines, dot = false }: { text: Loc; lines?: boolean; dot?: boolean }) {
  const t = useT();
  return <Rich text={t(text)} lines={lines} dot={dot} />;
}
