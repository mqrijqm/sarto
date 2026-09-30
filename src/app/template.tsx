"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// template.tsx se ponovo montira pri svakoj navigaciji => ulazna tranzicija stranice
export default function Template({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    // samo opacity — transform na roditelju bi pokvario position:fixed i ScrollTrigger merenja
    gsap.fromTo(ref.current, { opacity: 0 }, { opacity: 1, duration: 0.9, ease: "power2.out" });
  });
  return <div ref={ref}>{children}</div>;
}
