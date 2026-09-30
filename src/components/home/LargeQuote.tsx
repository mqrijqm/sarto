"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";
import { useLang } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Coin3D = dynamic(() => import("../webgl/Coin3D").then((x) => x.Coin3D), { ssr: false });

const LINES: Record<"bs" | "en", [string, string][]> = {
  en: [
    ["I HELD A", "MOMENT IN"],
    ["MY HAND", "BRILLIANT"],
    ["AS A STAR,", "FRAGILE AS"],
    ["A FLOWER,", "A TINY SLIVER"],
    ["OF ONE", "HOUR."],
  ],
  bs: [
    ["DRŽAO SAM", "TRENUTAK U"],
    ["RUCI, BLISTAV", "KAO ZVIJEZDA,"],
    ["KRHAK KAO", "CVIJET,"],
    ["SIĆUŠAN", "DJELIĆ"],
    ["JEDNOG", "SATA."],
  ],
};

const FULL = {
  en: "I held a moment in my hand, brilliant as a star, fragile as a flower, a tiny sliver of one hour. — Carl Sandburg",
  bs: "Držao sam trenutak u ruci, blistav kao zvijezda, krhak kao cvijet, sićušan djelić jednog sata. — Carl Sandburg",
};

/**
 * Ogroman citat: svaki red je podeljen na levu i desnu polovinu. Dok novčić (3D)
 * prolazi kroz red, reči se razmiču da mu naprave mesto, pa se sklapaju.
 * Performanse: sve dimenzije se mere jednom (i na resize), a pri skrolu se menja
 * samo `transform` — nema preračunavanja rasporeda (layout) u svakom frejmu.
 */
export function LargeQuote() {
  const root = useRef<HTMLElement>(null);
  const spin = useRef(0);
  const { lang } = useLang();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const rows = q("[data-row]") as HTMLElement[];
      const coin = q("[data-coin]")[0] as HTMLElement;
      const block = q("[data-lines]")[0] as HTMLElement;
      const halves = rows.map((r) => ({
        l: r.querySelector("[data-l]") as HTMLElement,
        r: r.querySelector("[data-r]") as HTMLElement,
      }));
      const setGap = (i: number, g: number) => {
        halves[i].l.style.transform = `translate3d(${-g / 2}px,0,0)`;
        halves[i].r.style.transform = `translate3d(${g / 2}px,0,0)`;
      };

      if (prefersReducedMotion()) {
        rows.forEach((_, i) => setGap(i, 30));
        return;
      }

      // merenja — samo na start/refresh
      let m = { vw: 0, coin: 0, travel: 0, centers: [] as number[], h: 0 };
      const measure = () => {
        m = {
          vw: window.innerWidth,
          coin: coin.offsetWidth,
          travel: block.offsetHeight + coin.offsetWidth * 0.2,
          centers: rows.map((r) => r.offsetTop + r.offsetHeight / 2),
          h: rows[0]?.offsetHeight ?? 1,
        };
      };
      measure();

      const update = (p: number) => {
        const y = -m.coin * 0.6 + p * m.travel;
        coin.style.transform = `translate3d(-50%, ${y}px, 0)`;
        spin.current = p * Math.PI * 4;
        const coinCenter = y + m.coin / 2;
        m.centers.forEach((c, i) => {
          const d = Math.abs(c - coinCenter) / (m.h * 1.25);
          const open = Math.max(0, 1 - d * d); // zvono oko novčića
          const before = coinCenter < c - m.h ? Math.min(1, (c - coinCenter) / (m.vw * 0.6)) : 0;
          setGap(i, 24 + open * (m.coin * 1.05) + before * m.vw * 0.55);
        });
      };

      const st = ScrollTrigger.create({
        trigger: block,
        start: "top 85%",
        end: "bottom 25%",
        scrub: true,
        onRefresh: (self) => {
          measure();
          update(self.progress);
        },
        onUpdate: (self) => update(self.progress),
      });
      update(0);
      return () => st.kill();
    },
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="relative overflow-hidden pb-[40px] pt-[260px] max-md:pt-[140px]">
      <div data-lines className="relative">
        <blockquote aria-label={FULL[lang]}>
          {LINES[lang].map(([l, r], i) => (
            <div
              key={lang + i}
              data-row
              aria-hidden
              className="grid font-display leading-[1.02]"
              style={{ gridTemplateColumns: "1fr 0px 1fr", fontSize: "clamp(56px, 11.4vw, 164px)" }}
            >
              <span data-l className="whitespace-nowrap text-right will-change-transform [direction:rtl]">
                <span className="[direction:ltr]">{l}</span>
              </span>
              <span />
              <span data-r className="whitespace-nowrap will-change-transform">
                {r}
              </span>
            </div>
          ))}
        </blockquote>
        <div
          data-coin
          className="pointer-events-none absolute left-1/2 top-0 z-10 aspect-square w-[clamp(140px,16vw,230px)] will-change-transform"
          style={{ transform: "translate3d(-50%,-60%,0)" }}
        >
          <Coin3D spin={spin} className="h-full w-full" />
        </div>
      </div>
      <p className="mt-[36px] text-center text-[20px] tracking-[0.02em]">CARL SANDBURG</p>
    </section>
  );
}
