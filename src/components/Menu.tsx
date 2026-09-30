"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { NAV, LEGAL, CONTACT } from "@/content/site";
import { useT } from "@/lib/i18n";

/** Panel koji se spušta odozgo (≈85vh), stavke ulaze stagger animacijom. */
export function Menu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const root = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline | null>(null);
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    gsap.set(el, { autoAlpha: 0 });
    gsap.set(q("[data-panel]"), { clipPath: "inset(0% 0% 100% 0%)" });
    tl.current = gsap
      .timeline({ paused: true })
      .set(el, { autoAlpha: 1 })
      .to(q("[data-scrim]"), { opacity: 1, duration: 0.6, ease: "power2.out" }, 0)
      .to(q("[data-panel]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "expo.inOut" }, 0)
      .fromTo(
        q("[data-item]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.06 },
        0.45,
      )
      .fromTo(q("[data-side]"), { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.05 }, 0.7);
    return () => {
      tl.current?.kill();
    };
  }, []);

  useEffect(() => {
    if (!tl.current) return;
    if (open) {
      tl.current.timeScale(1).play();
      lenis?.stop();
    } else {
      tl.current.timeScale(1.6).reverse();
      lenis?.start();
    }
  }, [open, lenis]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div ref={root} id="site-menu" className="fixed inset-0 z-[45]" aria-hidden={!open} inert={!open}>
      <div data-scrim className="absolute inset-0 bg-ink/25 opacity-0" onClick={onClose} />
      <div
        data-panel
        className="absolute inset-x-0 top-0 flex h-[85svh] min-h-[560px] flex-col justify-between overflow-hidden px-g pb-[30px] pt-[120px] max-md:h-[100svh] max-md:pt-[96px]"
        style={{
          background:
            "radial-gradient(60% 70% at 88% 40%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%), radial-gradient(40% 50% at 10% 100%, rgba(230,216,204,0.7), rgba(230,216,204,0) 70%), #f3f0ed",
        }}
      >
        <div className="flex items-start justify-between gap-8 max-md:flex-col">
          <nav aria-label={t({ bs: "Glavna navigacija", en: "Main" })}>
            <ul className="flex flex-col">
              {NAV.map((item) => {
                const active = item.href === pathname;
                return (
                  <li key={item.href} className="overflow-hidden">
                    <div data-item className="flex items-baseline gap-[10px]">
                      <span className="t-small w-[28px] shrink-0 max-md:w-[22px] max-md:text-[13px]">{item.n}</span>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        className={`font-display text-[clamp(40px,min(6.6vw,10.5svh),96px)] leading-[1.1] ${
                          active ? "u-link" : "u-link-in"
                        }`}
                        style={{ backgroundSize: active ? "100% 3px" : undefined }}
                      >
                        {t(item.label)}
                      </Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>
          <div data-side className="text-right text-[20px] leading-[1.05] max-md:text-left max-md:text-[16px]">
            <p>{t({ bs: "Kontakt:", en: "Contact:" })}</p>
            <a href={`tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`} className="block">
              {CONTACT.phone}
            </a>
            <a href={`mailto:${CONTACT.email}`} className="block">
              {CONTACT.email}
            </a>
          </div>
        </div>
        <ul className="absolute bottom-[30px] right-[var(--gutter)] flex flex-col items-end max-md:static max-md:mt-8 max-md:items-start">
          {LEGAL.map((l) => (
            <li key={l.href} data-side>
              <Link
                href={l.href}
                onClick={onClose}
                className="rt-i u-link-in text-[21px] leading-[1.1] text-mute transition-colors hover:text-ink"
              >
                {t(l.label)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
