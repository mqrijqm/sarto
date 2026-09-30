"use client";

import { Reveal } from "./Reveal";
import { Rich } from "./Rich";
import { useT, type Loc } from "@/lib/i18n";

/** Eyebrow + ogroman naslov, centriran. Isti blok koristi skoro svaka stranica. */
export function SecondaryHero({
  eyebrow,
  title,
  body,
  className = "",
  size = "header",
}: {
  eyebrow?: Loc;
  title: Loc;
  body?: Loc;
  className?: string;
  size?: "header" | "xl";
}) {
  const t = useT();
  return (
    <section className={`px-g text-center ${className}`}>
      <Reveal>
        {eyebrow && (
          <p className="t-eyebrow mb-[38px] max-md:mb-[24px]">
            <span className="mask">
              <span data-line className="rt-line">
                <Rich text={t(eyebrow)} dot={false} />
              </span>
            </span>
          </p>
        )}
        <h2 className={size === "xl" ? "t-header-xl" : "t-header"}>
          <Rich key={t(title)} text={t(title)} lines />
        </h2>
      </Reveal>
      {body && (
        <Reveal mode="fade" className="t-body mx-auto mt-[70px] max-w-[360px] max-md:mt-[40px]">
          <p>{t(body)}</p>
        </Reveal>
      )}
    </section>
  );
}
