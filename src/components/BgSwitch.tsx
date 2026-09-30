"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Dok je sekcija na sredini ekrana, pozadina cele stranice prelazi u zadatu boju (About: pesak). */
export function BgSwitch({ color = "#e6d8cc", children, className = "" }: { color?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const html = document.documentElement;
      const set = (on: boolean) => html.style.setProperty("--page-bg", on ? color : "#f3f0ed");
      const st = ScrollTrigger.create({
        trigger: ref.current,
        start: "top 55%",
        end: "bottom -100%",
        onToggle: (self) => set(self.isActive),
      });
      return () => {
        st.kill();
        html.style.removeProperty("--page-bg");
      };
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
