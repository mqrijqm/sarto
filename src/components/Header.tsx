"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLang, useT } from "@/lib/i18n";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RollText } from "./Button";
import { Menu } from "./Menu";
import { Logo } from "./Logo";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fiksni MENU (levo) + CTA (desno). Iznad tamnih sekcija (data-header="dark")
 * dugmad postaju "frost" — providna bela 20% sa belim tekstom.
 */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    const setup = () => {
      triggers.forEach((t) => t.kill());
      triggers.length = 0;
      document.querySelectorAll<HTMLElement>('[data-header="dark"]').forEach((el) => {
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 52px",
            end: "bottom 52px",
            onToggle: (self) => setDark(self.isActive),
          }),
        );
      });
      setDark(triggers.some((t) => t.isActive));
    };
    const id = window.setTimeout(setup, 60);
    window.addEventListener("sarto:sections", setup);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener("sarto:sections", setup);
      triggers.forEach((t) => t.kill());
    };
  }, [pathname]);

  const t = useT();
  const cta =
    pathname === "/product"
      ? { label: { bs: "RAZGOVARAJTE _sa_ SAVJETNIKOM", en: "TALK _to a_ SCULPTURE _advisor_" }, href: "/legals/faq" }
      : pathname === "/order"
        ? null
        : { label: { bs: "_Započnite svoju_ NARUDŽBU", en: "_Start your_ COMMISSION" }, href: "/order" };
  const menuLabel = t({ bs: "MENI", en: "MENU" });

  const frost = dark && !open;

  return (
    <>
      <Menu open={open} onClose={() => setOpen(false)} />
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex items-start justify-between px-g pt-[var(--header-top)]">
        <button
          type="button"
          aria-expanded={open}
          aria-controls="site-menu"
          onClick={() => setOpen((v) => !v)}
          className={`btn pointer-events-auto w-[130px] max-md:w-[104px] ${frost ? "btn--frost" : ""}`}
        >
          <span className="roll">
            <span className="roll__inner">
              <span className="block">{open ? <CloseLabel /> : menuLabel}</span>
              <span className="roll__copy" aria-hidden>
                {open ? <CloseLabel /> : menuLabel}
              </span>
            </span>
          </span>
        </button>
        <div className="flex items-start gap-[10px]">
        <LangToggle frost={frost} hidden={open} />
        {cta && (
          <Link
            href={cta.href}
            className={`btn pointer-events-auto transition-opacity duration-500 ${frost ? "btn--frost" : ""} ${
              open ? "opacity-0" : ""
            } max-md:hidden`}
          >
            <RollText label={cta.label} />
          </Link>
        )}
        </div>
      </header>
      {pathname !== "/" && (
        <div className="absolute inset-x-0 top-[var(--header-top)] z-40 flex h-[45px] items-center justify-center">
          <Link href="/" aria-label={t({ bs: "SARTO početna", en: "SARTO home" })}>
            <Logo className="h-[30px] max-md:h-[22px]" />
          </Link>
        </div>
      )}
    </>
  );
}

function CloseLabel() {
  const t = useT();
  return (
    <span className="inline-flex items-center gap-[8px]">
      <span className="inline-block h-[5px] w-[5px] rotate-45 bg-current" />
      {t({ bs: "ZATVORI", en: "CLOSE" })}
    </span>
  );
}

/** BS / EN prekidač — isti stil kao ostala dugmad u headeru. */
function LangToggle({ frost, hidden }: { frost: boolean; hidden: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <div
      role="group"
      aria-label="Language / Jezik"
      className={`btn pointer-events-auto gap-[10px] px-[18px] transition-opacity duration-500 ${frost ? "btn--frost" : ""} ${hidden ? "opacity-0" : ""}`}
    >
      {(["bs", "en"] as const).map((l, i) => (
        <span key={l} className="flex items-center gap-[10px]">
          {i > 0 && <span className="inline-block h-[4px] w-[4px] rotate-45 bg-current opacity-40" />}
          <button
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={lang === l}
            className={`uppercase transition-opacity duration-300 ${lang === l ? "opacity-100" : "opacity-55 hover:opacity-90"}`}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
