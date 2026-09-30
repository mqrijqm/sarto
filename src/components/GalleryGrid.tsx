"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import { useLenis } from "lenis/react";
import { m } from "@/content/site";
import { useT } from "@/lib/i18n";

gsap.registerPlugin(Flip);

type Cat = "situ" | "close" | "brand";
type Item = { name: string; cat: Cat; caption: { bs: string; en: string } };

const ITEMS: Item[] = [
  { name: "situ-painting", cat: "situ", caption: { bs: "Skulptura SARTO | Na stoliću od korijena oraha, ispod slike luke.", en: "SARTO Sculpture | Displayed on a burl side table beneath a harbour painting." } },
  { name: "art-gent-1", cat: "brand", caption: { bs: "Portret gospodina u fraku | Arhiva inspiracije.", en: "Portrait of a gentleman in a frock coat | Inspiration archive." } },
  { name: "situ-desk", cat: "situ", caption: { bs: "Skulptura SARTO | Na antiknom pisaćem stolu.", en: "SARTO Sculpture | On an antique writing desk." } },
  { name: "situ-lamp", cat: "situ", caption: { bs: "Skulptura SARTO | Pored lampe u ulaznom holu.", en: "SARTO Sculpture | Beside a chinoiserie lamp in the entry hall." } },
  { name: "up-full", cat: "close", caption: { bs: "Studija smokinga | Gips, ručno završeno.", en: "Tuxedo study | Plaster, hand-finished." } },
  { name: "art-gent-4", cat: "brand", caption: { bs: "Krojač u radionici, 18. vijek | Arhiva inspiracije.", en: "A tailor in his workshop, 18th century | Inspiration archive." } },
  { name: "situ-barcart", cat: "situ", caption: { bs: "Skulptura SARTO | Na srebrnim kolicima za piće.", en: "SARTO Sculpture | On a silver bar cart." } },
  { name: "situ-peonies", cat: "situ", caption: { bs: "Skulptura SARTO | Kuhinjski pult s božurima.", en: "SARTO Sculpture | Kitchen counter with peonies." } },
  { name: "situ-shelves", cat: "situ", caption: { bs: "Skulptura SARTO | Police biblioteke.", en: "SARTO Sculpture | Library shelves." } },
  { name: "up-lapel", cat: "close", caption: { bs: "Revers i cvijet | Detalj u gipsu.", en: "Peak lapel & boutonnière | Plaster detail." } },
  { name: "art-gent-2", cat: "brand", caption: { bs: "Mladoženja u fraku, ulje na platnu | Arhiva inspiracije.", en: "A groom in a tailcoat, oil on canvas | Inspiration archive." } },
  { name: "art-temple", cat: "brand", caption: { bs: "Ruševine u zlatnom satu | Arhiva inspiracije.", en: "Ruins at golden hour | Inspiration archive." } },
  { name: "situ-console", cat: "situ", caption: { bs: "Skulptura SARTO | Konzola od hrasta.", en: "SARTO Sculpture | Fluted oak console." } },
  { name: "grid-drape", cat: "close", caption: { bs: "Leđa sakoa i šlic | Detalj u gipsu.", en: "Jacket back & vent | Plaster detail." } },
  { name: "art-still-1", cat: "brand", caption: { bs: "Mrtva priroda: košulja, sat i karanfil | Arhiva inspiracije.", en: "Still life: shirt, watch and carnation | Inspiration archive." } },
  { name: "art-coin", cat: "brand", caption: { bs: "Bronzani novčić, 1. vijek | Arhiva inspiracije.", en: "Bronze coin, 1st century | Inspiration archive." } },
  { name: "situ-mantel", cat: "situ", caption: { bs: "Porodica od četiri skulpture | Kamin.", en: "A family of four sculptures | Fireplace mantel." } },
  { name: "art-portrait", cat: "brand", caption: { bs: "Portret gospodina | Arhiva inspiracije.", en: "Portrait of a gentleman | Inspiration archive." } },
  { name: "art-gent-3", cat: "brand", caption: { bs: "Gospodin u zelenom kaputu | Arhiva inspiracije.", en: "Gentleman in a green coat | Inspiration archive." } },
  { name: "art-sunset", cat: "brand", caption: { bs: "More u zalasku sunca | Arhiva inspiracije.", en: "Sea at sunset | Inspiration archive." } },
  { name: "situ-piano", cat: "situ", caption: { bs: "Skulptura SARTO | Na klaviru.", en: "SARTO Sculpture | On the grand piano." } },
  { name: "grid-bust", cat: "close", caption: { bs: "Rame i rukav | Detalj u gipsu.", en: "Shoulder & sleeve | Plaster detail." } },
  { name: "art-gent-5", cat: "brand", caption: { bs: "Vjenčani portret, 19. vijek | Arhiva inspiracije.", en: "Wedding portrait, 19th century | Inspiration archive." } },
  { name: "situ-wallpaper", cat: "situ", caption: { bs: "Skulptura SARTO | Polica u kupatilu.", en: "SARTO Sculpture | Powder room shelf." } },
  { name: "up-trouser", cat: "close", caption: { bs: "Nabor pantalona i cipele | Detalj u gipsu.", en: "Trouser crease & shoes | Plaster detail." } },
  { name: "art-gent-6", cat: "brand", caption: { bs: "Večernji kaput na stolici | Arhiva inspiracije.", en: "Evening coat on a chair | Inspiration archive." } },
  { name: "art-hands", cat: "brand", caption: { bs: "Reljef od terakote | Arhiva inspiracije.", en: "Terracotta relief | Inspiration archive." } },
  { name: "situ-abstract", cat: "situ", caption: { bs: "Skulptura SARTO | Pored apstraktnog platna.", en: "SARTO Sculpture | Beside an abstract canvas." } },
  { name: "sticky-plaster", cat: "close", caption: { bs: "Brokatni prsluk | Detalj u gipsu.", en: "Brocade waistcoat | Plaster detail." } },
  { name: "art-still-2", cat: "brand", caption: { bs: "Mermerna bista u galeriji | Arhiva inspiracije.", en: "Marble bust in a gallery | Inspiration archive." } },
  { name: "situ-green", cat: "situ", caption: { bs: "Skulptura SARTO kao lampa | Kućna radna soba.", en: "SARTO Sculpture as a lamp | Home office." } },
  { name: "name-flower", cat: "brand", caption: { bs: "Gardenija | SARTO pečat.", en: "Gardenia | The SARTO seal." } },
  { name: "p-deliver", cat: "brand", caption: { bs: "SARTO kutija.", en: "The SARTO box." } },
];

const CATS: Cat[] = ["situ", "close", "brand"];
const CAT_LABEL: Record<Cat, { bs: string; en: string }> = {
  situ: { bs: "U prostoru", en: "In Situ" },
  close: { bs: "Izbliza", en: "Up Close" },
  brand: { bs: "Svijet brenda", en: "Brand World" },
};

/** Filter (toggle) + 5-kolonski grid; promena filtera animira raspored (GSAP Flip); klik otvara lightbox. */
export function GalleryGrid() {
  const [active, setActive] = useState<Cat | null>(null);
  const [open, setOpen] = useState<number | null>(null);
  const grid = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const lenis = useLenis();
  const t = useT();

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
        <span className="t-body mr-[40px]">{t({ bs: "Filter", en: "Filter" })}</span>
        {CATS.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={active === c}
            onClick={() => choose(c)}
            className={`btn w-[130px] !px-0 !tracking-[0.02em] ${active === c ? "btn--dark" : ""}`}
          >
            {t(CAT_LABEL[c])}
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
            aria-label={`${t({ bs: "Otvori sliku", en: "Open image" })}: ${t(it.caption)}`}
          >
            <span className="media block aspect-[153/191] w-full md:w-[10.6vw] md:max-w-[190px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m(it.name, "sm")} alt="" loading="lazy" decoding="async" className="transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]" />
            </span>
          </button>
        ))}
      </div>

      {cur && (
        <div role="dialog" aria-modal="true" aria-label={t(cur.caption)} className="fixed inset-0 z-[70] flex items-center justify-center bg-beige/95 p-[60px] max-md:p-[16px]" onClick={() => setOpen(null)}>
          <figure className="relative flex h-full max-h-[86svh] flex-col items-center" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img key={cur.name} src={m(cur.name)} alt={t(cur.caption)} className="h-full w-auto max-w-full animate-[lbIn_.8s_var(--ease-out-expo)] object-contain" />
            <figcaption className="t-small mt-[16px] text-center">{t(cur.caption)}</figcaption>
          </figure>
          <button className="btn absolute right-[30px] top-[30px]" onClick={() => setOpen(null)}>
            {t({ bs: "ZATVORI", en: "CLOSE" })}
          </button>
          <button aria-label={t({ bs: "Prethodna", en: "Previous" })} className="absolute left-[24px] top-1/2 p-3 text-[28px]" onClick={(e) => { e.stopPropagation(); setOpen((o) => (o! - 1 + shown.length) % shown.length); }}>
            ←
          </button>
          <button aria-label={t({ bs: "Sljedeća", en: "Next" })} className="absolute right-[24px] top-1/2 p-3 text-[28px]" onClick={(e) => { e.stopPropagation(); setOpen((o) => (o! + 1) % shown.length); }}>
            →
          </button>
          <style>{`@keyframes lbIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}`}</style>
        </div>
      )}
    </section>
  );
}
