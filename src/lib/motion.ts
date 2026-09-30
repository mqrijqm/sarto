// Jedan izvor istine za tajminge — easing krive preuzete sa reference.
export const EASE = {
  expo: "expo.out", // cubic-bezier(.19,1,.22,1)
  inOutExpo: "expo.inOut",
  quart: "power3.out",
  inOutQuart: "power3.inOut",
  custom: "power1.inOut",
} as const;

export const DUR = {
  fast: 0.4,
  base: 0.9,
  slow: 1.2,
  xslow: 1.6,
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Da li uređaj može da nosi teže WebGL efekte (slab laptop / telefon => lakša verzija)
export const isLowPower = () => {
  if (typeof navigator === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  return cores <= 4 || mem <= 4;
};
