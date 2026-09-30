"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rich } from "./Rich";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Veliki naslov čiji redovi ulaze vezano za skrol (scrub): svaki red se podiže
 * iz maske i blago "stepenasto" kasni za prethodnim (About → Our VISION).
 */
export function WordScrub({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const lines = ref.current!.querySelectorAll("[data-line]");
      gsap.fromTo(
        lines,
        { yPercent: 100 },
        {
          yPercent: 0,
          ease: "power2.out",
          stagger: 0.25,
          scrollTrigger: { trigger: ref.current, start: "top 90%", end: "bottom 60%", scrub: 0.6 },
        },
      );
    },
    { scope: ref },
  );
  return (
    <h2 ref={ref} className={className}>
      <Rich text={text} lines />
    </h2>
  );
}
