"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Coin3D = dynamic(() => import("../webgl/Coin3D").then((x) => x.Coin3D), { ssr: false });

const LINES: [string, string][] = [
  ["I HELD A", "MOMENT IN"],
  ["MY HAND", "BRILLIANT"],
  ["AS A STAR,", "FRAGILE AS"],
  ["A FLOWER,", "A TINY SLIVER"],
  ["OF ONE", "HOUR."],
];

/**
 * Ogroman citat: svaki red je podeljen na levu i desnu polovinu. Dok novčić
 * (3D) prolazi kroz red, reči se razmiču da mu naprave mesto, pa se sklapaju.
 */
export function LargeQuote() {
  const root = useRef<HTMLElement>(null);
  const spin = useRef(0);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const rows = q("[data-row]") as HTMLElement[];
      const coin = q("[data-coin]")[0] as HTMLElement;
      const setGap = (row: HTMLElement, g: number) => row.style.setProperty("--gap", `${g}px`);

      if (prefersReducedMotion()) {
        rows.forEach((r) => setGap(r, 30));
        return;
      }

      const st = ScrollTrigger.create({
        trigger: q("[data-lines]")[0],
        start: "top 85%",
        end: "bottom 25%",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          const vw = window.innerWidth;
          const coinSize = coin.offsetWidth;
          // novčić putuje od vrha do dna bloka
          const block = q("[data-lines]")[0] as HTMLElement;
          const travel = block.offsetHeight + coinSize * 0.2;
          const y = -coinSize * 0.6 + p * travel;
          coin.style.transform = `translate3d(-50%, ${y}px, 0)`;
          spin.current = p * Math.PI * 4;
          rows.forEach((row) => {
            const rowCenter = row.offsetTop + row.offsetHeight / 2;
            const coinCenter = y + coinSize / 2;
            const d = Math.abs(rowCenter - coinCenter) / (row.offsetHeight * 1.25);
            const open = Math.max(0, 1 - d * d); // zvono oko novčića
            // pre nego što novčić stigne, redovi su "rašireni"
            const before = coinCenter < rowCenter - row.offsetHeight ? Math.min(1, (rowCenter - coinCenter) / (vw * 0.6)) : 0;
            const g = 24 + open * (coinSize * 1.05) + before * vw * 0.55;
            setGap(row, g);
          });
        },
      });
      return () => st.kill();
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative overflow-hidden pb-[40px] pt-[260px] max-md:pt-[140px]">
      <div data-lines className="relative">
        <blockquote aria-label="I held a moment in my hand, brilliant as a star, fragile as a flower, a tiny sliver of one hour. — Carl Sandburg">
          {LINES.map(([l, r], i) => (
            <div
              key={i}
              data-row
              aria-hidden
              className="grid font-display leading-[1.02]"
              style={{
                gridTemplateColumns: "1fr var(--gap, 24px) 1fr",
                fontSize: "clamp(56px, 11.4vw, 164px)",
              }}
            >
              <span className="whitespace-nowrap text-right [direction:rtl]">
                <span className="[direction:ltr]">{l}</span>
              </span>
              <span />
              <span className="whitespace-nowrap">{r}</span>
            </div>
          ))}
        </blockquote>
        <div data-coin className="pointer-events-none absolute left-1/2 top-0 z-10 aspect-square w-[clamp(140px,16vw,230px)]" style={{ transform: "translate3d(-50%,-60%,0)" }}>
          <Coin3D spin={spin} className="h-full w-full" />
        </div>
      </div>
      <p className="mt-[36px] text-center text-[20px] tracking-[0.02em]">CARL SANDBURG</p>
    </section>
  );
}
