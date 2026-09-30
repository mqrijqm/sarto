"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "./Button";
import { useCart, money } from "./cart/Cart";

/**
 * Order: kratko objašnjenje + tamno dugme. Klik otvara formu (visina se animira).
 * Ako u korpi ima stavki, prikazuje rezime. Slanje je demo (nema backenda).
 */
export function OrderPanel() {
  const [step, setStep] = useState<"intro" | "form" | "done">("intro");
  const form = useRef<HTMLDivElement>(null);
  const { lines, total } = useCart();

  const openForm = () => {
    setStep("form");
    requestAnimationFrame(() => {
      if (form.current) gsap.fromTo(form.current, { height: 0, opacity: 0 }, { height: "auto", opacity: 1, duration: 1, ease: "expo.out" });
    });
  };

  return (
    <div className="w-full max-w-[640px] text-center">
      <h1 className="t-sans-title">Your suit. A work of art.</h1>
      <p className="t-body mt-[36px]">
        Commission a fine art sculpture of your wedding suit. Following your purchase, a member of our team will reach out to coordinate next steps and guide you through the process.
      </p>
      <p className="t-body mt-[26px]">The SARTO studio accepts a limited number of commissions each month.</p>

      {lines.length > 0 && step !== "done" && (
        <div className="mx-auto mt-[30px] max-w-[420px] border-y border-line py-[14px] text-left font-sans text-[15px]">
          {lines.map((l) => (
            <div key={l.id} className="flex justify-between py-[4px]">
              <span>
                {l.style} sculpture × {l.qty}
              </span>
              <span>{money(l.price * l.qty)}</span>
            </div>
          ))}
          <div className="mt-[6px] flex justify-between font-medium">
            <span>Subtotal</span>
            <span>{money(total)}</span>
          </div>
        </div>
      )}

      {step === "intro" && (
        <div className="mt-[36px]">
          <Button label="_Commission your_ SCULPTURE" variant="dark" onClick={openForm} />
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
              { id: "name", label: "Full name", type: "text", auto: "name" },
              { id: "email", label: "Email", type: "email", auto: "email" },
              { id: "date", label: "Wedding date", type: "date", auto: "off" },
            ].map((f) => (
              <label key={f.id} className="block">
                <span className="t-label text-mute">{f.label}</span>
                <input required id={f.id} name={f.id} type={f.type} autoComplete={f.auto} className="mt-[6px] w-full border-b border-ink bg-transparent pb-[8px] font-sans text-[16px] outline-none focus:border-b-2" />
              </label>
            ))}
            <label className="block">
              <span className="t-label text-mute">Suit style</span>
              <select name="style" className="mt-[6px] w-full border-b border-ink bg-transparent pb-[8px] font-sans text-[16px] outline-none" defaultValue={lines[0]?.style ?? "Tuxedo"}>
                <option>Tuxedo</option>
                <option>Single-breasted</option>
                <option>Double-breasted</option>
                <option>Other / morning suit</option>
              </select>
            </label>
            <label className="block">
              <span className="t-label text-mute">How should we collect your suit?</span>
              <select name="collect" className="mt-[6px] w-full border-b border-ink bg-transparent pb-[8px] font-sans text-[16px] outline-none">
                <option>SARTO Shipping Kit</option>
                <option>Private collection (New York)</option>
                <option>Satellite atelier drop-off</option>
              </select>
            </label>
            <div className="mt-[16px] text-center">
              <Button label="_Send my_ REQUEST" variant="dark" type="submit" />
            </div>
          </form>
        </div>
      )}

      {step === "done" && (
        <p className="rt-i mt-[36px] text-[24px]" style={{ fontWeight: 500 }}>
          Thank you. A SARTO advisor will be in touch within 48 hours.
        </p>
      )}

      <p className="t-body mt-[30px] text-ink/70">
        Have questions before you begin?{" "}
        <Link href="/legals/faq" className="u-link">
          Book a private consultation
        </Link>
        .
      </p>
    </div>
  );
}
