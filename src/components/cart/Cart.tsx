"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useLenis } from "lenis/react";
import { m } from "@/content/site";
import { L, useT } from "@/lib/i18n";
import { Button } from "../Button";

export type CartLine = { id: string; title: string; style: string; image: string; price: number; qty: number };

type Ctx = {
  lines: CartLine[];
  open: boolean;
  setOpen: (v: boolean) => void;
  add: (l: Omit<CartLine, "qty">) => void;
  setQty: (id: string, qty: number) => void;
  total: number;
  count: number;
};

const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => {
  const c = useContext(CartCtx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
};

export const money = (n: number) => `$${n.toLocaleString("en-US")}`;

/** Jednostavna korpa (u memoriji + localStorage kao udobnost). Za pravi shop: zameniti Shopify/Stripe pozivima. */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("sarto:cart");
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("sarto:cart", JSON.stringify(lines));
    } catch {}
  }, [lines]);

  const add: Ctx["add"] = (l) => {
    setLines((ls) => {
      const ex = ls.find((x) => x.id === l.id);
      return ex ? ls.map((x) => (x.id === l.id ? { ...x, qty: x.qty + 1 } : x)) : [...ls, { ...l, qty: 1 }];
    });
    setOpen(true);
  };
  const setQty: Ctx["setQty"] = (id, qty) => setLines((ls) => (qty <= 0 ? ls.filter((x) => x.id !== id) : ls.map((x) => (x.id === id ? { ...x, qty } : x))));
  const total = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const count = lines.reduce((s, l) => s + l.qty, 0);

  return (
    <CartCtx.Provider value={{ lines, open, setOpen, add, setQty, total, count }}>
      {children}
      <CartDrawer />
    </CartCtx.Provider>
  );
}

function CartDrawer() {
  const { lines, open, setOpen, setQty, total } = useCart();
  const root = useRef<HTMLDivElement>(null);
  const lenis = useLenis();
  const t = useT();

  useEffect(() => {
    const el = root.current!;
    const q = gsap.utils.selector(el);
    if (open) {
      lenis?.stop();
      gsap.set(el, { autoAlpha: 1 });
      gsap.to(q("[data-scrim]"), { opacity: 1, duration: 0.5 });
      gsap.fromTo(q("[data-sheet]"), { xPercent: 100 }, { xPercent: 0, duration: 1, ease: "expo.out" });
      gsap.fromTo(q("[data-in]"), { y: 20, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.05, duration: 0.9, ease: "expo.out", delay: 0.2 });
    } else {
      lenis?.start();
      gsap.to(q("[data-scrim]"), { opacity: 0, duration: 0.4 });
      gsap.to(q("[data-sheet]"), { xPercent: 100, duration: 0.7, ease: "expo.inOut", onComplete: () => { gsap.set(el, { autoAlpha: 0 }); } });
    }
  }, [open, lenis]);

  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [setOpen]);

  return (
    <div ref={root} className="invisible fixed inset-0 z-[80]" aria-hidden={!open} inert={!open}>
      <div data-scrim className="absolute inset-0 bg-ink/30 opacity-0" onClick={() => setOpen(false)} />
      <aside data-sheet role="dialog" aria-label={t({ bs: "Vaša narudžba", en: "Your commission" })} className="absolute inset-y-0 right-0 flex w-[min(460px,100%)] flex-col bg-beige px-[30px] pb-[30px] pt-[34px]">
        <div data-in className="flex items-center justify-between">
          <p className="t-eyebrow">
            <L bs={<><span className="rt-i">Vaša</span> NARUDŽBA</>} en={<><span className="rt-i">Your</span> COMMISSION</>} />
          </p>
          <button className="t-small u-link-in" onClick={() => setOpen(false)}>
            <L bs="Zatvori" en="Close" />
          </button>
        </div>
        <div className="mt-[34px] flex-1 overflow-y-auto border-t border-line" data-lenis-prevent>
          {lines.length === 0 && (
            <p data-in className="t-body py-[40px] text-mute">
              <L bs="Još nema narudžbe. Izaberite stil odijela da počnete." en="No commission yet. Choose a suit style to begin." />
            </p>
          )}
          {lines.map((l) => (
            <div data-in key={l.id} className="flex gap-[16px] border-b border-line py-[18px]">
              <div className="media h-[120px] w-[90px] shrink-0 bg-[#ece8e3]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m(l.image)} alt="" className="!object-contain" />
              </div>
              <div className="flex flex-1 flex-col">
                <p className="t-sans-sub">{l.title}</p>
                <p className="t-small mt-[6px] text-mute">{l.style}</p>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-[14px] font-sans text-[15px]">
                    <button aria-label={t({ bs: "Smanji", en: "Decrease" })} onClick={() => setQty(l.id, l.qty - 1)} className="h-[26px] w-[26px] border border-line">−</button>
                    <span>{l.qty}</span>
                    <button aria-label={t({ bs: "Povećaj", en: "Increase" })} onClick={() => setQty(l.id, l.qty + 1)} className="h-[26px] w-[26px] border border-line">+</button>
                  </div>
                  <span className="font-sans text-[15px]">{money(l.price * l.qty)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div data-in className="pt-[20px]">
          <div className="flex justify-between font-sans text-[15px] font-medium">
            <span><L bs="Ukupno" en="Subtotal" /></span>
            <span>{money(total)}</span>
          </div>
          <p className="t-small mt-[8px] text-mute"><L bs="Depozit od 50% osigurava vaše mjesto. Naš tim će vas kontaktirati u roku od 48 sati da dogovori preuzimanje odijela." en="A deposit of 50% secures your place. Our team will contact you within 48 hours to arrange the collection of your suit." /></p>
          <div className="mt-[22px]" onClick={() => setOpen(false)}>
            <Button label={{ bs: "NASTAVITE _na_ PLAĆANJE", en: "PROCEED _to_ CHECKOUT" }} href="/order" variant="dark" block />
          </div>
          <Link href="/legals/faq" onClick={() => setOpen(false)} className="t-small u-link-in mt-[14px] block text-center">
            <L bs="Pitanja prije početka?" en="Questions before you begin?" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
