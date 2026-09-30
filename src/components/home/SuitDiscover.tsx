"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rich } from "../Rich";
import { Logo } from "../Logo";
import { Button } from "../Button";
import { Reveal } from "../Reveal";
import type { StageState } from "../webgl/SuitStage";
import type { SculptState } from "../webgl/DepthSculpture";
import { m } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// WebGL se učitava tek na klijentu (lazy) — ne blokira prvi prikaz
const SuitStage = dynamic(() => import("../webgl/SuitStage").then((x) => x.SuitStage), { ssr: false });
// Rezerva dok nema pravog 3D fajla: fotorealistična skulptura + mapa dubine (2.5D okret)
const DepthSculpture = dynamic(() => import("../webgl/DepthSculpture").then((x) => x.DepthSculpture), { ssr: false });

const GLB = "/models/suit.glb";

/**
 * 3D mermerno odelo (Three.js) — stalno se lagano okreće, a skrol ga podiže
 * odozdo. Iza modela "YOUR MOST important SUIT", kasnije preko njega
 * "DESERVES TO LAST forever.". Sekcija 300vh, platno sticky 100vh.
 */
export function SuitDiscover() {
  const root = useRef<HTMLElement>(null);
  const state = useRef<StageState>({ progress: 0, pointerX: 0, pointerY: 0 });
  const sculpt = useRef<SculptState>({ angle: -0.9, zoom: 2.05, y: 1.35, fade: 1, pointerX: 0, pointerY: 0, opacity: 1 });
  // postoji li pravi 3D model? (spusti ga u public/models/suit.glb)
  const [hasGlb, setHasGlb] = useState<boolean | null>(null);
  useEffect(() => {
    fetch(GLB, { method: "HEAD" })
      .then((r) => setHasGlb(r.ok && !(r.headers.get("content-type") || "").includes("text/html")))
      .catch(() => setHasGlb(false));
  }, []);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const s = state.current;
      if (prefersReducedMotion()) {
        s.progress = 0.5;
        return;
      }
      gsap.to(s, {
        progress: 1,
        ease: "none",
        onUpdate: () => {
          // ista putanja i za 2.5D rezervu
          const p = s.progress;
          sculpt.current.y = 1.35 - p * 1.97;
          sculpt.current.angle = -0.95 + 1.9 * (0.5 - 0.5 * Math.cos(Math.PI * p));
        },
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom bottom", scrub: true },
      });
      // naslov iza modela odlazi gore brže od modela
      gsap.to(q("[data-important]"), {
        yPercent: -60,
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: "30% top", scrub: true },
      });
      gsap.fromTo(
        q("[data-important] [data-line]"),
        { yPercent: 110 },
        { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: root.current, start: "top 70%" } },
      );
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
        sculpt.current.pointerX = s.pointerX;
        sculpt.current.pointerY = s.pointerY;
      };
      window.addEventListener("pointermove", onMove);
      return () => window.removeEventListener("pointermove", onMove);
    },
    { scope: root },
  );

  return (
    <>
      <section ref={root} className="relative h-[300svh]">
        <div className="absolute inset-x-0 top-[var(--header-top)] z-20 flex h-[45px] items-center justify-center pt-[48px] max-md:pt-[40px]">
          <Logo className="h-[44px] max-md:h-[30px]" />
        </div>
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          {/* naslov IZA modela */}
          <div data-important className="absolute inset-x-0 top-[21svh] z-0 px-g text-center">
            <h2 className="t-header" style={{ fontSize: "clamp(52px, 8.35vw, 120px)" }}>
              <Rich text={"YOUR MOST\n_important_ SUIT"} lines dot={false} />
            </h2>
          </div>
          {hasGlb === true && <SuitStage state={state} className="absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,#000_82%,transparent_99%)]" />}
          {hasGlb === false && (
            <DepthSculpture src={m("sculpt-tux")} depth={m("depth-tux")} state={sculpt} className="absolute inset-0 z-10 [mask-image:linear-gradient(to_bottom,#000_82%,transparent_99%)]" />
          )}
        </div>
        {/* marker za reveal drugog naslova */}
        <div data-deserve-trigger className="absolute left-0 top-[42%] h-px w-px" />
        <div className="pointer-events-none absolute inset-x-0 top-[38%] z-20 h-[100svh]">
          <div className="sticky top-0 flex h-[100svh] items-end justify-center pb-[6vh]">
            <h2 data-deserve className="t-header text-center" style={{ fontSize: "clamp(52px, 8.35vw, 120px)" }}>
              <Rich text={"DESERVES TO\nLAST  _forever._"} lines />
            </h2>
          </div>
        </div>
      </section>

      <section className="relative -mt-[14svh] px-g pb-[240px] text-center max-md:pb-[140px]">
        <Reveal mode="fade" className="mx-auto max-w-[460px]">
          <h2 data-fade className="t-sans-title">
            SARTO is a luxury fine-art studio that transforms your wedding suit into a timeless sculpture.
          </h2>
          <p data-fade className="t-body mx-auto mt-[22px] max-w-[450px]">
            Each SARTO sculpture stands approximately 16 inches tall and weighs 5–10 pounds. Carved in marble-white
            plaster, ceramic, and resin, every piece is crafted with exceptional precision and detail, exactly as it was
            worn on your wedding day.
          </p>
          <div data-fade className="mt-[58px]">
            <Button label="_Start your_ COMMISSION" href="/order" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
