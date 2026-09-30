"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { m } from "@/content/site";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Široka slika koja se pri skrolu širi od margina (30px) do skoro punog ekrana, uz blagi parallax. */
export function WideMedia({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const el = ref.current!;
      const img = el.querySelector("img");
      gsap.fromTo(
        el,
        { clipPath: "inset(0px 30px 0px 30px)" },
        { clipPath: "inset(0px 5px 0px 5px)", ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "top 20%", scrub: true } },
      );
      gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, { yPercent: 8, scale: 1.12, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`relative h-[118svh] overflow-hidden max-md:h-[70svh] ${className}`} style={{ clipPath: "inset(0 30px 0 30px)" }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m(name)} alt={alt} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
    </div>
  );
}
