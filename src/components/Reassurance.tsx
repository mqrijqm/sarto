"use client";

import { Button } from "./Button";
import { Reveal } from "./Reveal";
import { useT, type Loc } from "@/lib/i18n";

export function Reassurance({
  title = { bs: "Vaša priča zaslužuje\nda postane skulptura", en: "Your story deserves\nto be sculpted" },
  body = { bs: "Bila bi nam čast da je oblikujemo s vama.", en: "We’d be honored to craft it with you." },
  className = "",
}: {
  title?: Loc;
  body?: Loc;
  className?: string;
}) {
  const t = useT();
  return (
    <section className={`px-g py-[200px] text-center max-md:py-[120px] ${className}`}>
      <Reveal mode="fade">
        <h2 data-fade className="t-sans-title whitespace-pre-line">
          {t(title)}
        </h2>
        <p data-fade className="t-body mt-[36px]">
          {t(body)}
        </p>
        <div data-fade className="mt-[58px]">
          <Button label={{ bs: "_Započnite svoju_ NARUDŽBU", en: "_Start your_ COMMISSION" }} href="/order" />
        </div>
      </Reveal>
    </section>
  );
}
