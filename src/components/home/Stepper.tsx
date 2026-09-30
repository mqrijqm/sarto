"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rich } from "../Rich";
import { m } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";
import { useLang, useT } from "@/lib/i18n";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PANELS = [
  { img: "step-1", alt: { bs: "Smoking od slonovače, krupni plan", en: "Ivory tuxedo, close-up" }, words: { bs: "_Od_ ODIJELA,", en: "_From_ SUIT," } },
  { img: "step-2", alt: { bs: "Gipsana skulptura odijela na sivom postamentu", en: "The plaster sculpture of the suit on a grey plinth" }, words: { bs: "_do_ PODATAKA,", en: "_to_ DATA," } },
  { img: "step-3", alt: { bs: "Smoking pored gotove skulpture", en: "Tuxedo beside the finished sculpture" }, words: { bs: "_do_ SKULPTURE.", en: "_to_ SCULPTURE." } },
];

/**
 * Pinovana scena: naslov "where INNOVATION meets CRAFTSMANSHIP", ispod kartica
 * koja raste do punog ekrana; zatim paneli uleću zdesna. Rečenica na dnu klizi
 * tako da aktivni deo bude centriran i svetao; dijamanti levo = stepper.
 */
export function Stepper() {
  const root = useRef<HTMLElement>(null);
  const { lang } = useLang();
  const t = useT();

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const panels = q("[data-panel]") as HTMLElement[];
      const words = q("[data-word]") as HTMLElement[];
      const dots = q("[data-dot]") as HTMLElement[];
      const line = q("[data-sentence]")[0] as HTMLElement;
      const card = panels[0];

      const setActive = (i: number) => {
        words.forEach((w, k) => gsap.to(w, { opacity: k === i ? 1 : 0.45, duration: 0.5, overwrite: true }));
        dots.forEach((d, k) => d.classList.toggle("is-active", k === i));
      };

      if (prefersReducedMotion()) {
        gsap.set(card, { clipPath: "inset(0% 0% 0% 0%)" });
        setActive(0);
        return;
      }

      // pomeraj rečenice da reč i bude u centru ekrana
      const offsetFor = (i: number) => {
        const w = words[i];
        const center = w.offsetLeft + w.offsetWidth / 2;
        return window.innerWidth / 2 - center;
      };

      const mm = gsap.matchMedia();
      mm.add("(min-width: 0px)", () => {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        // početni pravougaonik kartice (kao na referenci: ~38% širine, ispod naslova)
        const cw = Math.min(vw * 0.38, 560);
        const ch = cw * 0.79;
        const top = vh * 0.43;
        const insetTop = (top / vh) * 100;
        const insetSide = ((vw - cw) / 2 / vw) * 100;
        const insetBot = ((vh - top - ch) / vh) * 100;

        gsap.set(card, { clipPath: `inset(${insetTop}% ${insetSide}% ${insetBot}% ${insetSide}%)` });
        gsap.set(panels.slice(1), { xPercent: 100 });
        gsap.set(line, { x: offsetFor(0) });
        gsap.set(q("[data-ui]"), { autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${vh * 3.6}`,
            pin: true,
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const p = self.progress;
              setActive(p < 0.52 ? 0 : p < 0.8 ? 1 : 2);
            },
          },
        });

        tl.to(card, { clipPath: "inset(0% 0% 0% 0%)", ease: "power2.inOut", duration: 1 }, 0)
          .fromTo(card.querySelector("img"), { scale: 1.35 }, { scale: 1, ease: "power2.inOut", duration: 1 }, 0)
          .to(q("[data-heading]"), { autoAlpha: 0, duration: 0.3 }, 0.7)
          .to(q("[data-ui]"), { autoAlpha: 1, duration: 0.3 }, 0.8)
          .to({}, { duration: 0.5 })
          // panel 2
          .addLabel("p2")
          .to(panels[1], { xPercent: 0, ease: "power2.inOut", duration: 1 }, "p2")
          .to(panels[0], { xPercent: -25, ease: "power2.inOut", duration: 1 }, "p2")
          .to(line, { x: offsetFor(1), ease: "power2.inOut", duration: 1 }, "p2")
          .fromTo(panels[1].querySelector("img"), { scale: 1.15 }, { scale: 1, duration: 1.6, ease: "none" }, "p2")
          .to({}, { duration: 0.4 })
          // panel 3
          .addLabel("p3")
          .to(panels[2], { xPercent: 0, ease: "power2.inOut", duration: 1 }, "p3")
          .to(panels[1], { xPercent: -25, ease: "power2.inOut", duration: 1 }, "p3")
          .to(line, { x: offsetFor(2), ease: "power2.inOut", duration: 1 }, "p3")
          .to({}, { duration: 0.5 });
      });
      setActive(0);
      return () => mm.revert();
    },
    // nova rečenica (drugi jezik) => ponovo izmeri položaje reči
    { scope: root, dependencies: [lang], revertOnUpdate: true },
  );

  return (
    <section ref={root} className="relative h-[100svh] overflow-hidden">
      {/* naslov iza kartice */}
      <div data-heading className="absolute inset-x-0 top-[19svh] px-g text-center">
        <p className="t-eyebrow mb-[38px]">
          <Rich text={t({ bs: "SUŠTINA _SARTA_", en: "_the_ ESSENCE _of_ SARTO" })} dot={false} />
        </p>
        <h2 className="t-header">
          <Rich text={t({ bs: "_gdje se_ INOVACIJA\n_susreće sa_ ZANATOM", en: "_where_ INNOVATION\n_meets_ CRAFTSMANSHIP" })} />
        </h2>
      </div>

      {PANELS.map((p, i) => (
        <div key={p.img} data-panel className="absolute inset-0 overflow-hidden" style={{ zIndex: i + 1 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={m(p.img)} alt={t(p.alt)} className="h-full w-full object-cover" loading="lazy" />
        </div>
      ))}

      {/* stepper dijamanti */}
      <ul data-ui className="absolute left-[40px] top-1/2 z-10 flex -translate-y-1/2 flex-col gap-[14px] max-md:left-[16px]">
        {PANELS.map((p, i) => (
          <li key={i} data-dot className="stepdot h-[8px] w-[8px] rotate-45 bg-paper/50 transition-[background-color,transform] duration-500" />
        ))}
      </ul>

      {/* rečenica */}
      <div data-ui className="absolute inset-x-0 bottom-[5svh] z-10 overflow-hidden text-paper">
        <p
          data-sentence
          className="inline-flex whitespace-nowrap font-display leading-none"
          style={{ fontSize: "clamp(40px, 4.9vw, 72px)" }}
        >
          {PANELS.map((p, i) => (
            <span key={i} data-word className="mr-[0.3em] opacity-45">
              <Rich text={t(p.words)} />
            </span>
          ))}
        </p>
      </div>
      <style>{`.stepdot.is-active{background:#f8f8f8;transform:rotate(45deg) scale(1.15)}`}</style>
    </section>
  );
}
