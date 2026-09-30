"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import { Rich } from "../Rich";
import { Logo } from "../Logo";
import { m } from "@/content/site";
import { useT } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(useGSAP);

const FRAMES = ["hero-1", "hero-2", "hero-3"];

/**
 * Hero = "video" od 3 kadra (sporo zumiranje + pretapanje).
 * Intro (logo + tagline) kreće tek kad globalni Splash javi `sarto:ready`.
 */
export function HomeHero() {
  const root = useRef<HTMLElement>(null);
  const [frame, setFrame] = useState(0);
  const [visible, setVisible] = useState(true);
  const lenis = useLenis();
  const t = useT();

  // pauziraj smenu kadrova kad hero nije na ekranu (štedi GPU pri skrolu)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.01 });
    io.observe(root.current!);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || prefersReducedMotion()) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % FRAMES.length), 5200);
    return () => window.clearInterval(id);
  }, [visible]);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      gsap.set([q("[data-hero-logo]"), q("[data-hero-chev]")], { autoAlpha: 0 });
      gsap.set(q("[data-hero-tag] [data-line]"), { yPercent: 110 });
      const heroIn = () =>
        gsap
          .timeline()
          .fromTo(q("[data-hero-img]"), { scale: 1.12 }, { scale: 1, duration: 2.4, ease: "expo.out" }, 0)
          .fromTo(q("[data-hero-logo]"), { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 1.6, ease: "expo.out" }, 0.1)
          .to(q("[data-hero-tag] [data-line]"), { yPercent: 0, duration: 1.3, ease: "expo.out" }, 0.35)
          .to(q("[data-hero-chev]"), { autoAlpha: 1, duration: 1 }, 0.9);
      if (window.__sartoReady) heroIn();
      else window.addEventListener("sarto:ready", heroIn, { once: true });
      return () => window.removeEventListener("sarto:ready", heroIn);
    },
    { scope: root },
  );

  return (
    <section ref={root} data-header="dark" className="relative h-[100svh] min-h-[560px] overflow-hidden bg-[#3a1d10] text-paper">
      {/* "video" */}
      <div data-hero-img className="absolute inset-0 will-change-transform">
        {FRAMES.map((f, i) => (
          <div
            key={f}
            className="absolute inset-0 transition-opacity duration-[1600ms] ease-[var(--ease-custom)]"
            style={{ opacity: frame === i ? 1 : 0 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={m(f)}
              alt=""
              decoding="async"
              className="h-full w-full object-cover will-change-transform"
              style={{
                transform: frame === i ? "scale(1)" : "scale(1.08)",
                transition: "transform 7s cubic-bezier(.25,.1,.25,1)",
              }}
              fetchPriority={i === 0 ? "high" : "low"}
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_52%,rgba(0,0,0,0.28),rgba(0,0,0,0)_70%)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col items-center justify-center px-g text-center">
        <h1 className="sr-only">{t({ bs: "SARTO — skulptura vašeg vjenčanog odijela", en: "SARTO — Custom sculpture of your wedding suit" })}</h1>
        <div data-hero-logo>
          <Logo className="w-[min(250px,58vw)]" />
        </div>
        <p data-hero-tag className="mt-[10px] text-[clamp(18px,1.6vw,23px)] leading-[1.1] tracking-[-0.01em]">
          <span className="mask">
            <span data-line className="rt-line">
              <Rich
                text={t({
                  bs: "SKULPTURA _vašeg_ VJENČANOG ODIJELA",
                  en: "_Custom_ SCULPTURE _of your_ WEDDING SUIT",
                })}
                dot={false}
              />
              <span className="rt-dot" />
            </span>
          </span>
        </p>
      </div>
      <button
        data-hero-chev
        aria-label={t({ bs: "Skrolaj dolje", en: "Scroll down" })}
        onClick={() => lenis?.scrollTo(window.innerHeight, { duration: 1.6 })}
        className="absolute bottom-[24px] left-1/2 z-10 -translate-x-1/2 p-2"
      >
        <svg width="12" height="8" viewBox="0 0 12 8" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M1 1.5l5 5 5-5" />
        </svg>
      </button>
    </section>
  );
}
