import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { Accordion } from "@/components/Accordion";
import { Reassurance } from "@/components/Reassurance";

export const metadata: Metadata = { title: "FAQ" };

const FAQ = [
  { q: "What exactly is a SARTO sculpture?", a: "A SARTO sculpture is a one-of-one commissioned artwork inspired by your wedding suit. Using advanced digital capture and a meticulous artistic process, our artists and engineers transform your suit into a fine-art sculpture that preserves the memory of your wedding day in physical form. Each sculpture is individually created at your commission and is never reproduced, duplicated, or offered as part of an edition." },
  { q: "Will my suit be altered in any way?", a: "Never. Your suit is captured without cutting, pinning or marking, and it is returned in exactly the condition in which we received it — pressed and hung in a SARTO garment bag." },
  { q: "How long does a commission take?", a: "Each sculpture is completed in 12–16 weeks from the arrival of your suit at our studio. Rush commissions are available on request for anniversaries and gifts." },
  { q: "Can you sculpt a tuxedo, morning suit or kilt?", a: "Yes. We sculpt tuxedos, lounge suits, morning dress, military dress uniforms and highland wear. Accessories such as bow ties, boutonnières and pocket squares are included in the sculpture." },
  { q: "How large is the sculpture?", a: "Approximately 16 inches (40 cm) tall, weighing 5–10 pounds. Larger museum-scale pieces are available by private commission." },
  { q: "Can we commission a pair for the couple?", a: "Absolutely. Many couples commission the suit and the gown together; we finish both pieces to be displayed side by side." },
  { q: "Do you ship internationally?", a: "Yes. We provide an insured SARTO Shipping Kit for your suit and deliver the finished sculpture worldwide in our signature box." },
];

export default function Faq() {
  return (
    <>
      <SecondaryHero className="pb-[140px] pt-[200px] max-md:pt-[140px]" eyebrow="QUESTIONS & ANSWERS" title="FAQ" />
      <section className="mx-auto max-w-[1180px] px-g">
        <Accordion items={FAQ} />
      </section>
      <Reassurance />
    </>
  );
}
