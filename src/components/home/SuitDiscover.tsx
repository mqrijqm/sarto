"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rich } from "../Rich";
import { Logo } from "../Logo";
import { Button } from "../Button";
import { Reveal } from "../Reveal";
import type { SculptState } from "../webgl/DepthSculpture";
import { m } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL se učitava tek na klijentu (lazy) — ne blokira prvi prikaz
const DepthSculpture = dynamic(() => import("../webgl/DepthSculpture").then((x) => x.DepthSculpture), {
  ssr: false,
});

/**
 * Skulptura odela ulazi odozdo, okreće se dok kamera klizi niz nju,
 * preko nje "DESERVES TO LAST forever.", donji deo se utapa u pozadinu.
 * Sekcija je 300vh, platno je sticky 100vh.
 */
export function SuitDiscover() {
  const root = useRef<HTMLElement>(null);
  const state = useRef<SculptState>({ angle: -0.9, zoom: 2.05, y: 1.3, fade: 1.6, pointerX: 0, pointerY: 0, opacity: 1 });

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      if (reduced) {
        Object.assign(state.current, { angle: 0, zoom: 1.02, y: 0 });
        return;
      }
      const s = state.current;
      // y: + pomera sliku nadole — start: skulptura tek viri odozdo
      gsap
        .timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "bottom bottom", scrub: true } })
        .fromTo(s, { y: 1.3 }, { y: -0.3, ease: "none", duration: 1 }, 0)
        .fromTo(s, { angle: -0.95 }, { angle: 0.95, ease: "sine.inOut", duration: 1 }, 0);

      gsap.fromTo(
        q("[data-deserve] [data-line]"),
        { yPercent: 110 },
        {
          yPercent: 0,
          ease: "expo.out",
          duration: 1.4,
          stagger: 0.08,
          scrollTrigger: { trigger: q("[data-deserve-trigger]")[0], start: "top 60%" },
        },
      );

      const onMove = (e: PointerEvent) => {
        s.pointerX = (e.clientX / window.innerWidth) * 2 - 1;
        s.pointerY = (e.clientY / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <>
      <section ref={root} className="relative h-[300svh]">
        <div className="absolute inset-x-0 top-[var(--header-top)] z-10 flex h-[45px] items-center justify-center pt-[48px] max-md:pt-[40px]">
          <Logo className="h-[44px] max-md:h-[30px]" />
        </div>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <DepthSculpture src={m("sculpt-tux")} depth={m("depth-tux")} state={state} className="absolute inset-0" />
        </div>
        {/* marker za reveal naslova, na ~40% sekcije */}
        <div data-deserve-trigger className="absolute left-0 top-[42%] h-px w-px" />
        <div className="pointer-events-none absolute inset-x-0 top-[38%] h-[100svh]">
          <div className="sticky top-0 flex h-[100svh] items-end justify-center pb-[6vh]">
            <h2 data-deserve className="t-header text-center" style={{ fontSize: "clamp(52px, 8.35vw, 120px)" }}>
              <Rich text={"DESERVES TO\nLAST  _forever._"} lines />
            </h2>
          </div>
        </div>
      </section>

      <section className="relative px-g pb-[240px] pt-[40px] text-center max-md:pb-[140px]">
        <Reveal mode="fade" className="mx-auto max-w-[460px]">
          <h2 data-fade className="t-sans-title">
            SARTO is a luxury fine-art studio that transforms your wedding suit into a timeless sculpture.
          </h2>
          <p data-fade className="t-body mx-auto mt-[22px] max-w-[450px]">
            Each SARTO sculpture stands approximately 16 inches tall and weighs 5–10 pounds. Our sculptures are made of
            plaster, ceramic, and resin and are crafted with exceptional precision and detail, exactly as it was worn on
            your wedding day.
          </p>
          <div data-fade className="mt-[58px]">
            <Button label="_Start your_ COMMISSION" href="/order" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
