"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "./Button";
import { useCart, money } from "./cart/Cart";
import { L, useT } from "@/lib/i18n";

const STYLES = [
  { bs: "Smoking", en: "Tuxedo" },
  { bs: "Jednoredno", en: "Single-breasted" },
  { bs: "Dvoredno", en: "Double-breasted" },
  { bs: "Drugo / jutarnje odijelo", en: "Other / morning suit" },
];

const COLLECT = [
  { bs: "SARTO paket za slanje", en: "SARTO Shipping Kit" },
  { bs: "Privatno preuzimanje (New York)", en: "Private collection (New York)" },
  { bs: "Predaja u partnerskom ateljeu", en: "Satellite atelier drop-off" },
];

/**
 * Order: kratko objašnjenje + tamno dugme. Klik otvara formu (visina se animira).
 * Ako u korpi ima stavki, prikazuje rezime. Slanje je demo (nema backenda).
 */
export function OrderPanel() {
  const [step, setStep] = useState<"intro" | "form" | "done">("intro");
  const form = useRef<HTMLDivElement>(null);
  const { lines, total } = useCart();
  const t = useT();

  const openForm = () => {
    setStep("form");
    requestAnimationFrame(() => {
      if (form.current) gsap.fromTo(form.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 1, ease: "expo.out" });
    });
  };

  const field = "mt-[6px] w-full border-b border-ink bg-transparent pb-[8px] font-sans text-[16px] outline-none";

  return (
    <div className="w-full max-w-[640px] text-center">
      <h1 className="t-sans-title">
        <L bs="Vaše odijelo. Umjetničko djelo." en="Your suit. A work of art." />
      </h1>
      <p className="t-body mt-[36px]">
        <L
          bs="Naručite umjetničku skulpturu svog vjenčanog odijela. Nakon kupovine, član našeg tima će vas kontaktirati kako bi dogovorio sljedeće korake i vodio vas kroz proces."
          en="Commission a fine art sculpture of your wedding suit. Following your purchase, a member of our team will reach out to coordinate next steps and guide you through the process."
        />
      </p>
      <p className="t-body mt-[26px]">
        <L bs="SARTO studio svakog mjeseca prima ograničen broj narudžbi." en="The SARTO studio accepts a limited number of commissions each month." />
      </p>

      {lines.length > 0 && step !== "done" && (
        <div className="mx-auto mt-[30px] max-w-[420px] border-y border-line py-[14px] text-left font-sans text-[15px]">
          {lines.map((l) => (
            <div key={l.id} className="flex justify-between py-[4px]">
              <span>
                {l.style} <L bs="skulptura" en="sculpture" /> × {l.qty}
              </span>
              <span>{money(l.price * l.qty)}</span>
            </div>
          ))}
          <div className="mt-[6px] flex justify-between font-medium">
            <span>
              <L bs="Ukupno" en="Subtotal" />
            </span>
            <span>{money(total)}</span>
          </div>
        </div>
      )}

      {step === "intro" && (
        <div className="mt-[36px]">
          <Button label={{ bs: "_Naručite svoju_ SKULPTURU", en: "_Commission your_ SCULPTURE" }} variant="dark" onClick={openForm} />
        </div>
      )}

      {step === "form" && (
        <div ref={form} className="overflow-hidden">
          <form
            className="mx-auto mt-[36px] grid max-w-[460px] gap-[18px] text-left"
            onSubmit={(e) => {
              e.preventDefault();
              setStep("done");
            }}
          >
            {[
              { id: "name", label: { bs: "Ime i prezime", en: "Full name" }, type: "text", auto: "name" },
              { id: "email", label: { bs: "Email", en: "Email" }, type: "email", auto: "email" },
              { id: "date", label: { bs: "Datum vjenčanja", en: "Wedding date" }, type: "date", auto: "off" },
            ].map((f) => (
              <label key={f.id} className="block">
                <span className="t-label text-mute">{t(f.label)}</span>
                <input required id={f.id} name={f.id} type={f.type} autoComplete={f.auto} className={`${field} focus:border-b-2`} />
              </label>
            ))}
            <label className="block">
              <span className="t-label text-mute">{t({ bs: "Stil odijela", en: "Suit style" })}</span>
              <select name="style" className={field} defaultValue={lines[0]?.style ?? t(STYLES[0])}>
                {STYLES.map((s) => (
                  <option key={s.en}>{t(s)}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="t-label text-mute">{t({ bs: "Kako da preuzmemo vaše odijelo?", en: "How should we collect your suit?" })}</span>
              <select name="collect" className={field}>
                {COLLECT.map((c) => (
                  <option key={c.en}>{t(c)}</option>
                ))}
              </select>
            </label>
            <div className="mt-[16px] text-center">
              <Button label={{ bs: "_Pošaljite_ ZAHTJEV", en: "_Send my_ REQUEST" }} variant="dark" type="submit" />
            </div>
          </form>
        </div>
      )}

      {step === "done" && (
        <p className="rt-i mt-[36px] text-[24px]" style={{ fontWeight: 500 }}>
          <L bs="Hvala vam. SARTO savjetnik će vam se javiti u roku od 48 sati." en="Thank you. A SARTO advisor will be in touch within 48 hours." />
        </p>
      )}

      <p className="t-body mt-[30px] text-ink/70">
        <L bs="Imate pitanja prije početka?" en="Have questions before you begin?" />{" "}
        <Link href="/legals/faq" className="u-link">
          <L bs="Zakažite privatnu konsultaciju" en="Book a private consultation" />
        </Link>
        .
      </p>
    </div>
  );
}
