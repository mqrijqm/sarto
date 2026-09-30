"use client";

import { useRef, useState } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Accordion } from "../Accordion";
import { Button } from "../Button";
import { Media } from "../Media";
import { useCart, money } from "../cart/Cart";
import type { SculptState } from "../webgl/DepthSculpture";
import { m } from "@/content/site";
import { L, useT } from "@/lib/i18n";

const DepthSculpture = dynamic(() => import("../webgl/DepthSculpture").then((x) => x.DepthSculpture), { ssr: false });

const STYLES = [
  { id: "tux", label: { bs: "Smoking", en: "Tuxedo" }, img: "sculpt-tux", depth: "depth-tux", price: 2400 },
  { id: "single", label: { bs: "Jednoredno", en: "Single-breasted" }, img: "sculpt-single", depth: "depth-single", price: 2400 },
  { id: "double", label: { bs: "Dvoredno", en: "Double-breasted" }, img: "sculpt-double", depth: "depth-double", price: 2650 },
];

const LIFESTYLE = [
  { img: "situ-painting", wide: false, caption: { bs: "Skulptura SARTO | Odijelo: Aldrighi Sartoria. Izložena kao samostalna skulptura na stoliću.", en: "SARTO Sculpture | Suit by Aldrighi Sartoria. Displayed as a standalone sculpture on a side table." } },
  { img: "situ-green", wide: true, caption: { bs: "Skulptura SARTO kao lampa | Odijelo: Aldrighi Sartoria. Dostupno privatnim klijentima ili na upit.", en: "SARTO Sculpture as a lamp | Suit by Aldrighi Sartoria. Available for private clients or by request." } },
  { img: "situ-abstract", wide: false, caption: { bs: "Skulptura SARTO | Pored savremenog platna u dnevnoj sobi.", en: "SARTO Sculpture | Beside a contemporary canvas in the living room." } },
  { img: "situ-mantel", wide: true, caption: { bs: "Porodična narudžba | Četiri generacije vjenčanih odijela na kaminu.", en: "Family commission | Four generations of wedding suits on the fireplace mantel." } },
  { img: "situ-console", wide: false, caption: { bs: "Skulptura SARTO | Hrastova konzola u ulaznom holu.", en: "SARTO Sculpture | Fluted oak console in the entry hall." } },
];

/**
 * Product (PDP): levo viewer (prevuci da okreneš skulpturu) + lifestyle slike sa
 * natpisima; desno sticky panel sa cenom, stilovima, harmonikom i CTA -> korpa.
 */
export function ProductView() {
  const [style, setStyle] = useState(0);
  const cur = STYLES[style];
  const state = useRef<SculptState>({ angle: 0, zoom: 0.94, y: 0.02, fade: 0, pointerX: 0, pointerY: 0, opacity: 1 });
  const viewer = useRef<HTMLDivElement>(null);
  const { add } = useCart();
  const t = useT();

  // prevlačenje = okretanje; kad se pusti, polako se vraća u lagano "disanje"
  useGSAP(
    () => {
      const el = viewer.current!;
      const s = state.current;
      let dragging = false;
      let startX = 0;
      let startA = 0;
      const idle = gsap.to(s, { angle: 0.55, duration: 4.5, ease: "sine.inOut", yoyo: true, repeat: -1 });
      const down = (e: PointerEvent) => {
        dragging = true;
        startX = e.clientX;
        startA = s.angle;
        idle.pause();
        el.setPointerCapture(e.pointerId);
      };
      const move = (e: PointerEvent) => {
        if (!dragging) return;
        s.angle = gsap.utils.clamp(-1.1, 1.1, startA + ((e.clientX - startX) / el.offsetWidth) * 2.6);
      };
      const up = () => {
        if (!dragging) return;
        dragging = false;
        gsap.to(s, { angle: 0, duration: 1.6, ease: "expo.out", onComplete: () => { idle.restart(); } });
      };
      el.addEventListener("pointerdown", down);
      window.addEventListener("pointermove", move);
      window.addEventListener("pointerup", up);
      return () => {
        idle.kill();
        el.removeEventListener("pointerdown", down);
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
      };
    },
    { scope: viewer },
  );

  const pick = (i: number) => {
    if (i === style) return;
    // kratko "zatamnjenje" platna pri promeni stila
    gsap.to(state.current, { opacity: 0, duration: 0.25, onComplete: () => { setStyle(i); gsap.to(state.current, { opacity: 1, duration: 0.6, delay: 0.15 }); } });
  };

  return (
    <div className="grid grid-cols-[58fr_42fr] max-lg:grid-cols-1">
      <div>
        {/* viewer */}
        <section ref={viewer} className="relative h-[100svh] min-h-[640px] cursor-grab touch-pan-y bg-[#f1eeea] active:cursor-grabbing">
          <DepthSculpture key={cur.id} src={m(cur.img)} depth={m(cur.depth)} state={state} bg="#f1eeea" className="absolute inset-0" />
          <p className="t-label pointer-events-none absolute bottom-[140px] left-1/2 -translate-x-1/2 text-mute max-lg:bottom-[120px]">{t({ bs: "Prevucite da okrenete", en: "Drag to rotate" })}</p>
          <div className="absolute bottom-[20px] left-[20px] max-w-[410px] bg-paper px-[16px] py-[14px] text-[17px] leading-[1.6]">
            <L bs="Skulpture" en="Sculptures" /> | <a className="u-link" href="/about">SARTO Studio</a> <L bs="u New Yorku" en="in New York" />
            <br />
            <L bs="Odijela" en="Suits" /> | <a className="u-link" href="/featured-designers">Aldrighi Sartoria</a> <L bs="i" en="and" /> <a className="u-link" href="/featured-designers">Hollis &amp; Rowe</a>
          </div>
        </section>

        {/* lifestyle */}
        <div className="flex flex-col gap-[40px] py-[40px]">
          {LIFESTYLE.map((l) => (
            <figure key={l.img} className={`relative ${l.wide ? "" : "mx-auto w-[60%] max-lg:w-[84%]"}`}>
              <Media name={l.img} alt={l.caption} className={l.wide ? "aspect-[831/620]" : "aspect-[499/640]"} />
              <figcaption className={`absolute bottom-[40px] bg-paper px-[16px] py-[14px] text-[16px] leading-[1.6] ${l.wide ? "left-[50px] max-w-[410px]" : "left-[50px] right-[40px]"}`}>
                {t(l.caption)}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {/* sticky panel */}
      <aside className="bg-[#f8f7f6] max-lg:bg-transparent">
        <div className="sticky top-0 flex min-h-[100svh] flex-col justify-center px-[120px] py-[100px] max-xl:px-[60px] max-lg:min-h-0 max-lg:px-g">
          <h1 className="t-sans-title" style={{ fontSize: "clamp(26px,2.1vw,30px)" }}>
            <L bs={<>Naručite skulpturu<br />svog vjenčanog odijela.</>} en={<>Commission a sculpture<br />of your wedding suit.</>} />
          </h1>
          <p className="t-body mt-[26px] max-w-[330px]">
            <L
              bs={<>Narudžbe počinju od <span className="u-link">{money(cur.price)} po skulpturi</span>. Svaka skulptura je gotova za 12–16 sedmica. Pogledajte kako različiti stilovi odijela oživljavaju kao skulptura:</>}
              en={<>Commissions start at <span className="u-link">{money(cur.price)} per sculpture</span>. Each sculpture is completed in 12-16 weeks. See how different suit styles come to life as sculpture by clicking below:</>}
            />
          </p>
          <div className="mt-[34px] flex gap-[8px]" role="radiogroup" aria-label={t({ bs: "Stil odijela", en: "Suit style" })}>
            {STYLES.map((s, i) => (
              <button
                key={s.id}
                role="radio"
                aria-checked={i === style}
                onClick={() => pick(i)}
                className="group flex w-[82px] flex-col items-center text-center"
              >
                <span className={`media block h-[103px] w-[82px] bg-[#eceae6] outline-offset-2 transition-[outline-color] ${i === style ? "outline outline-1 outline-ink" : "outline outline-1 outline-transparent"}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m(s.img)} alt="" className="!object-contain p-[6px] transition-transform duration-700 group-hover:scale-105" />
                </span>
                <span className="t-small mt-[10px] leading-[1.1]">{t(s.label)}</span>
              </button>
            ))}
          </div>
          <div className="mt-[34px] max-w-[350px]">
            <Accordion
              variant="compact"
              defaultOpen={-1}
              items={[
                {
                  q: t({ bs: "Opis", en: "Description" }),
                  a: t({
                    bs: "Unikatna umjetnička skulptura vašeg vjenčanog odijela, visoka oko 40 cm, izlivena u gipsu, keramici i smoli i ručno završena u našem studiju. Svaki revers, dugme i nabor sačuvani su tačno onako kako ste ih nosili.",
                    en: "A one-of-one fine-art sculpture of your wedding suit, approximately 16 inches tall, cast in plaster, ceramic and resin and hand-finished in our New York studio. Every lapel, button and crease is preserved exactly as it was worn.",
                  }),
                },
                {
                  q: t({ bs: "Proces", en: "Process" }),
                  a: t({
                    bs: "Nakon kupovine dogovaramo preuzimanje vašeg odijela. Snima se naprednom tehnologijom, digitalno prevodi, precizno izrađuje i ručno završava. Odijelo vam vraćamo netaknuto.",
                    en: "After purchase, we arrange the collection of your suit. It is captured with advanced imaging, digitally translated, precision-fabricated and finished by hand. Your suit is returned untouched.",
                  }),
                },
                {
                  q: t({ bs: "Njega", en: "Care" }),
                  a: t({
                    bs: "Izložite je dalje od direktnog sunca i vlage. Prašinu nježno uklanjajte mekom, suhom četkicom. Ne koristite vodu ni sredstva za čišćenje.",
                    en: "Display away from direct sunlight and humidity. Dust gently with a soft, dry brush. Do not use water or cleaning products.",
                  }),
                },
              ]}
            />
          </div>
          <div className="mt-[36px] max-w-[350px]">
            <Button
              label={{ bs: "ZAPOČNITE NARUDŽBU", en: "START YOUR COMMISSION" }}
              block
              onClick={() => add({ id: cur.id, title: t({ bs: "Skulptura vjenčanog odijela", en: "Wedding Suit Sculpture" }), style: t(cur.label), image: cur.img, price: cur.price })}
            />
          </div>
        </div>
      </aside>
    </div>
  );
}
