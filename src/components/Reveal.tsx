"use client";

import { useRef, type ElementType, type HTMLAttributes } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Props = {
  as?: ElementType;
  delay?: number;
  stagger?: number;
  start?: string;
  mode?: "lines" | "fade" | "media";
} & HTMLAttributes<HTMLElement>;

/**
 * Reveal pri ulasku u ekran:
 *  - lines: svaki [data-line] klizi odozdo iz maske (naslovi)
 *  - fade:  deca [data-fade] (ili ceo blok) blago se podižu i pojavljuju
 *  - media: slika se "otkriva" clip-pathom i blago smanjuje zoom
 */
export function Reveal({
  as,
  delay = 0,
  stagger = 0.08,
  start = "top 88%",
  mode = "lines",
  children,
  ...rest
}: Props) {
  const Tag = (as ?? "div") as "div"; // tip suzen radi TS-a; runtime tag je `as`
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current!;
      if (prefersReducedMotion()) return;
      const st = { trigger: el, start, once: true };
      if (mode === "lines") {
        const lines = el.querySelectorAll("[data-line]");
        gsap.fromTo(
          lines,
          { yPercent: 105 },
          { yPercent: 0, duration: 1.3, ease: "expo.out", stagger, delay, scrollTrigger: st },
        );
      } else if (mode === "fade") {
        const kids = el.querySelectorAll("[data-fade]");
        gsap.fromTo(
          kids.length ? kids : el,
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: 1.2, ease: "expo.out", stagger, delay, scrollTrigger: st },
        );
      } else {
        const img = el.querySelector("img, video, canvas");
        const tl = gsap.timeline({ scrollTrigger: st, delay });
        tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.out" });
        if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 1.8, ease: "expo.out" }, 0);
      }
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} {...rest}>
      {children}
    </Tag>
  );
}
