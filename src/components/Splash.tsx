"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n";
import { prefersReducedMotion } from "@/lib/motion";

const Coin3D = dynamic(() => import("./webgl/Coin3D").then((x) => x.Coin3D), { ssr: false });

// šta mora da bude spremno pre nego što sajt "izađe" iza splasha — zavisi od stranice
const BASE = ["/media/coin-front.webp", "/media/coin-back.webp"];
const CRITICAL: Record<string, string[]> = {
  "/": ["/media/hero-1.webp", "/media/hero-2.webp", "/media/hero-3.webp", "/media/marble-tex.webp", "/models/suit.glb"],
  "/about": ["/media/wide-about.webp"],
  "/process": ["/media/wide-process.webp"],
  "/product": ["/media/sculpt-tux.webp", "/media/depth-tux.webp"],
  "/order": ["/media/step-3.webp"],
};

const VERBS = {
  bs: ["Uzimamo mjere", "Krojimo", "Režemo", "Šijemo", "Peglamo", "Skeniramo", "Vajamo", "Poliramo mramor"],
  en: ["Taking measurements", "Cutting the pattern", "Trimming", "Sewing", "Pressing", "Scanning", "Sculpting", "Polishing the marble"],
};

const MIN_MS = 2200;
const MAX_MS = 5000;

/** Globalni splash: 3D novčić lebdi i vrti se, ispod 0–100% i glagoli koji se smenjuju. */
export function Splash() {
  const root = useRef<HTMLDivElement>(null);
  const spin = useRef(0);
  const [done, setDone] = useState(false);
  const [verb, setVerb] = useState(0);
  const { lang } = useLang();
  const lenis = useLenis();
  const pathname = usePathname();

  // glagoli se smenjuju
  useEffect(() => {
    if (done) return;
    const id = window.setInterval(() => setVerb((v) => (v + 1) % VERBS.bs.length), 950);
    return () => window.clearInterval(id);
  }, [done]);

  // novčić se stalno vrti (brzina raste pri izlasku)
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const speed = { v: 2.4 };
    (window as unknown as { __coinSpeed?: typeof speed }).__coinSpeed = speed;
    const tick = (t: number) => {
      spin.current += ((t - last) / 1000) * speed.v;
      last = t;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    lenis?.stop();
  }, [lenis]);

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    const pct = q("[data-pct]")[0] as HTMLElement;
    const bar = q("[data-bar]")[0] as HTMLElement;
    const start = performance.now();
    let loaded = 0;
    const list = [...BASE, ...(CRITICAL[pathname] ?? [])];
    const total = list.length + 1;
    const bump = () => loaded++;

    // preuzmi kritične fajlove u keš browsera
    const jobs: Promise<unknown>[] = list.map((u) =>
      fetch(u)
        .then((r) => r.blob())
        .catch(() => null)
        .finally(bump),
    );
    jobs.push(document.fonts.ready.then(bump));
    const all = Promise.all(jobs);

    const shown = { v: 0 };
    let finished = false;
    const render = () => {
      pct.textContent = `${Math.round(shown.v)}%`;
      bar.style.transform = `scaleX(${shown.v / 100})`;
    };
    // procenat prati stvarno učitavanje, ali ne brže od minimalnog trajanja.
    // Peglanje je vezano za VREME (dt), ne za broj frejmova — radi isto i na sporom računaru.
    let lastT = performance.now();
    const tick = () => {
      if (finished) return;
      const now = performance.now();
      const dt = Math.min(0.25, (now - lastT) / 1000);
      lastT = now;
      const t = now - start;
      const real = (loaded / total) * 100;
      const time = Math.min(100, (t / MIN_MS) * 100);
      const target = Math.min(real, time);
      shown.v += (target - shown.v) * (1 - Math.exp(-dt * 7));
      if (target >= 100 && shown.v > 98.5) shown.v = 100;
      render();
      if (shown.v >= 100) {
        finished = true;
        exit();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    // sigurnosni izlaz ako mreža zaglavi
    const guard = window.setTimeout(() => {
      loaded = total;
    }, MAX_MS);
    all.then(() => undefined);

    const exit = () => {
      const speed = (window as unknown as { __coinSpeed?: { v: number } }).__coinSpeed;
      const tl = gsap.timeline({
        onComplete: () => {
          lenis?.start();
          window.__sartoReady = true;
          window.dispatchEvent(new Event("sarto:ready"));
          setDone(true);
        },
      });
      if (speed) tl.to(speed, { v: 14, duration: 0.9, ease: "power2.in" }, 0);
      tl.to(q("[data-meta]"), { autoAlpha: 0, y: 10, duration: 0.5, ease: "power2.in" }, 0.1)
        .to(q("[data-coin]"), { scale: 0.2, autoAlpha: 0, duration: 0.8, ease: "expo.in" }, 0.3)
        .to(el, { clipPath: "inset(0% 0% 100% 0%)", duration: 1.1, ease: "expo.inOut" }, 0.85);
    };

    if (prefersReducedMotion()) {
      loaded = total;
    }
    return () => window.clearTimeout(guard);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (done) return null;
  const verbs = VERBS[lang];

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-beige"
      style={{ clipPath: "inset(0% 0% 0% 0%)" }}
      aria-busy="true"
      aria-label={lang === "bs" ? "Učitavanje" : "Loading"}
    >
      <div data-coin className="splash-float relative aspect-square w-[clamp(150px,19vw,260px)]">
        <Coin3D spin={spin} className="h-full w-full" />
        {/* meka senka ispod novčića dok lebdi */}
        <div className="splash-shadow absolute -bottom-[18%] left-1/2 h-[10%] w-[55%] rounded-[50%] bg-ink/15 blur-[10px]" />
      </div>
      <div data-meta className="mt-[70px] flex flex-col items-center text-center">
        <p data-pct className="font-display text-[clamp(34px,3.4vw,48px)] leading-none tabular-nums tracking-[0.02em]">
          0%
        </p>
        <div className="mt-[18px] h-px w-[180px] overflow-hidden bg-ink/15">
          <div data-bar className="h-full w-full origin-left bg-ink" style={{ transform: "scaleX(0)" }} />
        </div>
        <p key={verb} className="splash-verb rt-i mt-[16px] text-[17px] text-ink/70">
          {verbs[verb]}…
        </p>
      </div>
      <style>{`
        .splash-float{animation:splashFloat 3.2s ease-in-out infinite}
        .splash-shadow{animation:splashShadow 3.2s ease-in-out infinite}
        .splash-verb{animation:splashVerb .45s var(--ease-out-expo) both}
        @keyframes splashFloat{0%,100%{transform:translateY(-10px) rotateX(8deg)}50%{transform:translateY(12px) rotateX(-8deg)}}
        @keyframes splashShadow{0%,100%{opacity:.45;transform:translateX(-50%) scale(.8)}50%{opacity:.9;transform:translateX(-50%) scale(1.05)}}
        @keyframes splashVerb{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
      `}</style>
    </div>
  );
}

declare global {
  interface Window {
    __sartoReady?: boolean;
  }
}
