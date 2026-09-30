"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { isValidElement } from "react";
import { useT, type Loc } from "@/lib/i18n";

type Item = { q: Loc; a: React.ReactNode | Loc };

// { bs, en } objekat (a ne React element) => prevod
const isLoc = (v: unknown): v is { bs: string; en: string } =>
  !!v && typeof v === "object" && !isValidElement(v) && "bs" in (v as object) && "en" in (v as object);

/**
 * Harmonika. `variant="faq"`: veliko sans pitanje, odgovor u desnoj polovini (FAQ, Featured).
 * `variant="compact"`: mali serif red sa +/− (Product panel).
 */
export function Accordion({ items, variant = "faq", defaultOpen = 0 }: { items: Item[]; variant?: "faq" | "compact"; defaultOpen?: number }) {
  const [open, setOpen] = useState<number>(defaultOpen);
  return (
    <div className={variant === "faq" ? "border-t border-[#b9b5b1]" : ""}>
      {items.map((it, i) => (
        <Row key={i} item={it} open={open === i} onToggle={() => setOpen(open === i ? -1 : i)} variant={variant} />
      ))}
    </div>
  );
}

function Row({ item, open, onToggle, variant }: { item: Item; open: boolean; onToggle: () => void; variant: "faq" | "compact" }) {
  const body = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  // visina se animira GSAP-om (auto -> 0 i obrnuto)
  const setRef = (el: HTMLDivElement | null) => {
    body.current = el;
    if (el && first.current) {
      gsap.set(el, { height: open ? "auto" : 0 });
      first.current = false;
    }
  };
  const prev = useRef(open);
  if (prev.current !== open && body.current) {
    gsap.to(body.current, { height: open ? "auto" : 0, duration: 0.8, ease: "expo.out" });
    prev.current = open;
  }

  const faq = variant === "faq";
  const t = useT();
  const answer = isLoc(item.a) ? t(item.a) : item.a;
  return (
    <div className={faq ? "border-b border-[#b9b5b1]" : ""}>
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className={`flex w-full items-center justify-between text-left ${faq ? "py-[18px]" : "py-[10px]"}`}
      >
        <span className={faq ? "t-sans-title" : "t-body"}>{t(item.q)}</span>
        <span className="relative ml-6 h-[16px] w-[16px] shrink-0" aria-hidden>
          <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 bg-ink" />
          <span
            className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 bg-ink transition-transform duration-500"
            style={{ transform: `translateX(-50%) scaleY(${open ? 0 : 1})` }}
          />
        </span>
      </button>
      <div ref={setRef} className="overflow-hidden">
        <div className={faq ? "grid grid-cols-2 pb-[36px] max-md:grid-cols-1" : "pb-[14px]"}>
          {faq && <span />}
          <div className={faq ? "t-body leading-[1.5]" : "t-small leading-[1.45] text-ink/80"}>{answer}</div>
        </div>
      </div>
    </div>
  );
}
