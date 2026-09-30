"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Rich } from "./Rich";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Veliki naslov: svaki red se podiže
 * iz maske, stepenasto jedan za drugim, kad naslov uđe u ekran (About → Our VISION).
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
          // bez scrub-a: red se uvek izdigne do kraja (scrub je ostavljao slova napola isečena)
          yPercent: 0,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.12,
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
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
