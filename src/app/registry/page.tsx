import type { Metadata } from "next";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";

export const metadata: Metadata = { title: "Registry" };

const REG = [
  { t: "The Knot", b: "Use the “Add to The Knot” button (under “Add a gift from anywhere”), then open the product page and add it. The name, photo and price fill in automatically." },
  { t: "Zola", b: "Use the “Add to Zola” browser extension, or choose “Add from another store” and paste the link to the product page." },
  { t: "Over The Moon", b: "Over The Moon is curated by invitation. Reach out and we’ll help you feature SARTO on your registry." },
];

export default function Registry() {
  return (
    <>
      <section className="px-g pt-[180px] text-center max-md:pt-[130px]">
        <Reveal as="h1" className="mx-auto max-w-[820px] font-display text-[clamp(46px,5.6vw,80px)] leading-[1.02]">
          <span className="mask">
            <span data-line className="rt-line">
              Add SARTO to your wedding
            </span>
          </span>
          <span className="mask">
            <span data-line className="rt-line">
              registry
            </span>
          </span>
        </Reveal>
        <Reveal mode="fade" className="t-sans-title mx-auto mt-[20px] max-w-[560px] font-normal">
          <p data-fade>A SARTO sculpture will become the most meaningful gift on your wedding registry.</p>
        </Reveal>
        <Media name="up-full" alt="Plaster suit sculpture" className="mx-auto mt-[66px] aspect-[340/395] w-[340px] max-w-full" priority />
      </section>

      <Reveal mode="fade" className="t-body mx-auto max-w-[540px] px-g pt-[50px] text-mute">
        <p data-fade>
          Unlike traditional registry gifts, a SARTO sculpture is entirely unique to you. Your commissioned sculpture will transform your wedding day into a lasting work of art for your home.
        </p>
        <p data-fade className="mt-[18px]">
          Below is a brief overview of how to add SARTO to some of the most popular wedding registries.
        </p>
      </Reveal>

      <section className="mx-auto grid max-w-[1100px] grid-cols-3 gap-[48px] px-g pt-[110px] max-md:grid-cols-1">
        {REG.map((r) => (
          <Reveal key={r.t} mode="fade" className="border-t border-line pt-[26px]">
            <h2 data-fade className="text-[22px] tracking-[-0.01em]">{r.t}</h2>
            <p data-fade className="t-body mt-[16px] text-mute">{r.b}</p>
          </Reveal>
        ))}
      </section>

      <div className="flex justify-center py-[110px]">
        <Button label="START YOUR COMMISSION" href="/product" />
      </div>
    </>
  );
}
