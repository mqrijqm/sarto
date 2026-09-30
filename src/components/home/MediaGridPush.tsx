"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "../Button";
import { m } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const GRID_ITEMS = [
  "situ-lamp", "situ-wallpaper", "situ-painting", "situ-console", "situ-piano",
  "situ-desk", "up-lapel", "art-sunset", "art-hands", "situ-shelves",
  "situ-abstract", "grid-drape", "situ-green", "situ-mantel", "up-full",
  "up-trouser", "situ-peonies", "situ-barcart", "art-portrait", "art-temple",
];

/**
 * 5 kolona malih slika sa velikim razmacima, dugme "Explore the GALLERY"
 * sticky u sredini. Kolone se pri skrolu razmiču (push) različitim brzinama,
 * a redovi ulaze sa blagim zakašnjenjem.
 */
export function MediaGridPush({ items = GRID_ITEMS }: { items?: string[] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      (q("[data-cell]") as HTMLElement[]).forEach((cell, i) => {
        const col = i % 5;
        gsap.fromTo(
          cell,
          { autoAlpha: 0, y: 70 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 1.3,
            ease: "expo.out",
            delay: col * 0.06,
            scrollTrigger: { trigger: cell, start: "top 92%", once: true },
          },
        );
      });
      // push: spoljne kolone beže brže od srednje
      const speeds = [-60, -25, 0, -25, -60];
      (q("[data-col-shift]") as HTMLElement[]).forEach((el) => {
        const col = Number(el.dataset.colShift);
        gsap.to(el, {
          y: speeds[col],
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
        });
      });
      // izlaz — grid bledi kad odlazi
      gsap.to(q("[data-grid]"), {
        opacity: 0.35,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "bottom 70%", end: "bottom 10%", scrub: true },
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative px-g pt-[100px]">
      <div data-grid className="grid grid-cols-5 gap-x-[10px] gap-y-[96px] max-md:grid-cols-3 max-md:gap-y-[40px]">
        {items.map((name, i) => (
          <div key={name + i} data-col-shift={i % 5} className={`flex ${["justify-start", "justify-center", "justify-center", "justify-center", "justify-end"][i % 5]} max-md:justify-center`}>
            <div data-cell className="media aspect-[153/191] w-[min(153px,100%)] md:w-[10.6vw] md:max-w-[190px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m(name)} alt="" loading="lazy" />
            </div>
          </div>
        ))}
      </div>
      {/* sticky dugme preko grida */}
      <div className="pointer-events-none absolute inset-0 pt-[100px]">
        <div className="sticky top-[calc(50svh-22px)] flex justify-center pb-[40vh]">
          <div className="pointer-events-auto">
            <Button label="_Explore the_ GALLERY" href="/gallery" className="w-[270px]" />
          </div>
        </div>
      </div>
    </section>
  );
}
