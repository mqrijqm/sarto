"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { FOOTER_NAV, BRAND } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [sent, setSent] = useState(false);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(ref);
      // Slova se "sklapaju": gornja i donja polovina svakog slova dolaze iz suprotnih pravaca
      const tl = gsap.timeline({
        scrollTrigger: { trigger: q("[data-mark]")[0], start: "top bottom", end: "bottom bottom", scrub: 0.6 },
      });
      q("[data-letter]").forEach((letter, i) => {
        const [top, bot] = letter.querySelectorAll("[data-half]");
        tl.fromTo(top, { yPercent: -38, scaleY: 1.5 }, { yPercent: 0, scaleY: 1, ease: "power2.out", duration: 1 }, i * 0.12)
          .fromTo(bot, { yPercent: 46, scaleY: 1.6 }, { yPercent: 0, scaleY: 1, ease: "power2.out", duration: 1 }, i * 0.12 + 0.05)
          .fromTo(letter, { opacity: 0 }, { opacity: 1, duration: 0.35 }, i * 0.12);
      });
    },
    { scope: ref },
  );

  return (
    <footer ref={ref} className="relative border-t border-line/80 pt-[40px]">
      <div className="px-g">
        <ul className="font-sans text-[15px] font-medium leading-[1.5] tracking-[0.04em]">
          {FOOTER_NAV.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="u-link-in">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="mt-[56px] flex items-end justify-between gap-10 max-md:flex-col max-md:items-start">
          <form
            className="w-[360px] max-w-full"
            onSubmit={(e) => {
              e.preventDefault();
              setSent(true);
            }}
          >
            <label htmlFor="nl" className="t-label block text-ink">
              Stay in touch with the studio
            </label>
            <div className="mt-[14px] flex items-center border-b border-ink pb-[8px]">
              <input
                id="nl"
                type="email"
                required
                placeholder={sent ? "Thank you — we’ll be in touch." : "Email address"}
                className="w-full bg-transparent font-sans text-[15px] tracking-[0.02em] outline-none placeholder:text-ink/60"
              />
              <button type="submit" aria-label="Subscribe" className="px-[6px] text-[20px] transition-transform hover:translate-x-1">
                ⟶
              </button>
            </div>
          </form>
          <ul className="text-right font-sans text-[15px] font-medium leading-[1.65] text-mute max-md:text-left">
            {[
              ["Instagram", "https://instagram.com"],
              ["LinkedIn", "https://linkedin.com"],
              ["Registry", "/registry"],
            ].map(([l, h]) => (
              <li key={l}>
                <a href={h} className="transition-colors hover:text-ink">
                  {l}
                  <span className="ml-[3px] text-[11px]">↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div data-mark className="mt-[40px] overflow-hidden px-g" aria-label={BRAND}>
        <div className="flex justify-between font-display leading-[0.8] text-ink" style={{ fontSize: "min(29.2vw, 480px)" }} aria-hidden>
          {BRAND.split("").map((ch, i) => (
            <span data-letter key={i} className="relative inline-block pt-[0.08em]">
              <span className="invisible">{ch}</span>
              <span data-half className="absolute inset-0 pt-[0.08em]" style={{ clipPath: "inset(0 0 50% 0)", transformOrigin: "50% 0%" }}>
                {ch}
              </span>
              <span data-half className="absolute inset-0 pt-[0.08em]" style={{ clipPath: "inset(49.6% 0 0 0)", transformOrigin: "50% 100%" }}>
                {ch}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-end justify-between gap-6 px-g pb-[24px] pt-[40px] font-sans text-[15px] font-medium leading-[1] text-mute max-md:flex-col max-md:items-start">
        <ul className="flex flex-wrap gap-x-[44px] gap-y-3">
          {[
            ["Accessibility", "/accessibility"],
            ["Terms & Conditions", "/legals/terms"],
            ["Privacy Policy", "/legals/policy"],
            ["Featured Tailors", "/featured-designers"],
          ].map(([l, h]) => (
            <li key={h}>
              <Link href={h} className="transition-colors hover:text-ink">
                {l} <span className="text-[11px]">↗</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-[70px]">
          <span>All Rights Reserved © {new Date().getFullYear()}</span>
          <Link href="/featured-designers" className="u-link">
            Credits
          </Link>
        </div>
      </div>
    </footer>
  );
}
