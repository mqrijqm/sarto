"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useLenis } from "lenis/react";
import { m } from "@/content/site";

gsap.registerPlugin(Flip);

type Cat = "In Situ" | "Up Close" | "Brand World";
type Item = { name: string; cat: Cat; caption: string };

const ITEMS: Item[] = [
  { name: "situ-painting", cat: "In Situ", caption: "SARTO Sculpture | Displayed on a burl side table beneath a harbour painting." },
  { name: "situ-desk", cat: "In Situ", caption: "SARTO Sculpture | On an antique writing desk." },
  { name: "situ-lamp", cat: "In Situ", caption: "SARTO Sculpture | Beside a chinoiserie lamp in the entry hall." },
  { name: "up-full", cat: "Up Close", caption: "Tuxedo study | Plaster, hand-finished." },
  { name: "situ-barcart", cat: "In Situ", caption: "SARTO Sculpture | On a silver bar cart." },
  { name: "situ-peonies", cat: "In Situ", caption: "SARTO Sculpture | Kitchen counter with peonies." },
  { name: "situ-shelves", cat: "In Situ", caption: "SARTO Sculpture | Library shelves." },
  { name: "up-lapel", cat: "Up Close", caption: "Peak lapel & boutonnière | Plaster detail." },
  { name: "art-temple", cat: "Brand World", caption: "Ruins at golden hour | Inspiration archive." },
  { name: "situ-console", cat: "In Situ", caption: "SARTO Sculpture | Fluted oak console." },
  { name: "grid-drape", cat: "Up Close", caption: "Jacket back & vent | Plaster detail." },
  { name: "art-coin", cat: "Brand World", caption: "Bronze coin, 1st century | Inspiration archive." },
  { name: "situ-mantel", cat: "In Situ", caption: "A family of four sculptures | Fireplace mantel." },
  { name: "art-portrait", cat: "Brand World", caption: "Portrait of a gentleman | Inspiration archive." },
  { name: "art-sunset", cat: "Brand World", caption: "Sea at sunset | Inspiration archive." },
  { name: "situ-piano", cat: "In Situ", caption: "SARTO Sculpture | On the grand piano." },
  { name: "grid-bust", cat: "Up Close", caption: "Shoulder & sleeve | Plaster detail." },
  { name: "situ-wallpaper", cat: "In Situ", caption: "SARTO Sculpture | Powder room shelf." },
  { name: "up-trouser", cat: "Up Close", caption: "Trouser crease & shoes | Plaster detail." },
  { name: "art-hands", cat: "Brand World", caption: "Terracotta relief | Inspiration archive." },
  { name: "situ-abstract", cat: "In Situ", caption: "SARTO Sculpture | Beside an abstract canvas." },
  { name: "sticky-plaster", cat: "Up Close", caption: "Brocade waistcoat | Plaster detail." },
  { name: "situ-green", cat: "In Situ", caption: "SARTO Sculpture as a lamp | Home office." },
  { name: "name-flower", cat: "Brand World", caption: "Gardenia | The SARTO seal." },
  { name: "p-deliver", cat: "Brand World", caption: "The SARTO box." },
];

const CATS: Cat[] = ["In Situ", "Up Close", "Brand World"];

/** Filter (toggle) + 5-kolonski grid; promena filtera animira raspored (GSAP Flip); klik otvara lightbox. */
export function GalleryGrid() {
  const [active, setActive] = useState<Cat | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const lenis = useLenis();

  const shown = useMemo(() => ITEMS.map((it, i) => ({ ...it, i })).filter((it) => !active || it.cat === active), [active]);

  const choose = (c: Cat) => {
    flipState.current = Flip.getState(grid.current!.querySelectorAll("[data-flip]"));
    setActive((a) => (a === c ? null : c));
  };

  useEffect(() => {
    if (!flipState.current) return;
    Flip.from(flipState.current, {
      duration: 0.9,
      ease: "expo.inOut",
      stagger: 0.012,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out", delay: 0.3 }),
      onLeave: (els) => gsap.to(els, { opacity: 0, duration: 0.3 }),
    });
    flipState.current = null;
  }, [active]);

  // lightbox: zaključaj skrol, strelice / Esc
  useEffect(() => {
    if (open === null) return;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % shown.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + shown.length) % shown.length));
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      lenis?.start();
    };
  }, [open, shown.length, lenis]);

  const cur = open !== null ? shown[open] : null;

  return (
    <section className="px-g pt-[120px]">
      <div className="flex flex-wrap items-center gap-[10px]">
        <span className="t-body mr-[40px]">Filter</span>
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => choose(c)}
            className={`btn w-[130px] !px-0 !tracking-[0.02em] ${active === c ? "btn--dark" : ""}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div ref={grid} className="mt-[74px] grid grid-cols-5 gap-x-[10px] gap-y-[96px] max-md:grid-cols-3 max-md:gap-y-[36px]">
        {shown.map((it, k) => (
          <button
            key={it.name}
            data-flip
            data-flip-id={it.name}
            type="button"
            onClick={() => setOpen(k)}
            className={`group flex ${["justify-start", "justify-center", "justify-center", "justify-center", "justify-end"][k % 5]} max-md:justify-center`}
            aria-label={`Open image: ${it.caption}`}
          >
            <span className="media block aspect-[153/191] w-full md:w-[10.6vw] md:max-w-[190px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m(it.name)} alt="" loading="lazy" className="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]" />
            </span>
          </button>
        ))}
      </div>

      {cur && (
        <div role="dialog" aria-modal="true" aria-label={cur.caption} className="fixed inset-0 z-[70] flex items-center justify-center bg-beige/95 p-[60px] max-md:p-[16px]" onClick={() => setOpen(null)}>
          <figure className="relative flex h-full max-h-[86svh] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={cur.name} src={m(cur.name)} alt={cur.caption} className="h-full w-auto max-w-full animate-[lbIn_.8s_var(--ease-out-expo)] object-contain" />
            <figcaption className="t-small mt-[16px] text-center">{cur.caption}</figcaption>
          </figure>
          <button className="btn absolute right-[30px] top-[30px]" onClick={() => setOpen(null)}>
            CLOSE
          </button>
          <button aria-label="Previous" className="absolute left-[24px] top-1/2 p-3 text-[28px]" onClick={(e) => { e.stopPropagation(); setOpen((o) => (o! - 1 + shown.length) % shown.length); }}>
            ←
          </button>
          <button aria-label="Next" className="absolute right-[24px] top-1/2 p-3 text-[28px]" onClick={(e) => { e.stopPropagation(); setOpen((o) => (o! + 1) % shown.length); }}>
            →
          </button>
          <style>{`@keyframes lbIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </section>
  );
}
