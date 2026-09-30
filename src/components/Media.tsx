"use client";

import { Reveal } from "./Reveal";
import { m } from "@/content/site";
import { useT, type Loc } from "@/lib/i18n";

/** Slika sa reveal animacijom (clip + zoom-out). `name` = fajl iz /public/media bez ekstenzije. */
export function Media({ name, alt = "", className = "", priority }: { name: string; alt?: Loc; className?: string; priority?: boolean }) {
  const t = useT();
  return (
    <Reveal mode="media" className={`media ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m(name)} alt={t(alt)} loading={priority ? "eager" : "lazy"} decoding="async" />
    </Reveal>
  );
}
