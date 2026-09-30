import { Reveal } from "../Reveal";
import { Button } from "../Button";
import { Rich } from "../Rich";
import { m } from "@/content/site";

function Img({ name, alt, className = "" }: { name: string; alt: string; className?: string }) {
  return (
    <Reveal mode="media" className={`media ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={m(name)} alt={alt} loading="lazy" />
    </Reveal>
  );
}

/** Levo: sticky velika slika. Desno: mozaik slika + tekst + citat osnivača. */
export function StickyGrid() {
  return (
    <section className="grid grid-cols-2 gap-[10px] px-g max-md:grid-cols-1">
      <div className="max-md:hidden">
        <div className="sticky top-[10px] h-[calc(100svh-20px)]">
          <Img name="sticky-plaster" alt="Plaster detail of the lapel and pocket square" className="h-full" />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="grid grid-cols-2 gap-[10px]">
          <Img name="grid-back" alt="Tuxedo beside its sculpture" className="aspect-[335/455]" />
          <Img name="grid-drape" alt="Plaster jacket back" className="aspect-[335/455]" />
        </div>

        <Reveal mode="fade" className="mx-auto max-w-[440px] px-[10px] py-[150px] text-center max-md:py-[90px]">
          <h3 data-fade className="t-sans-title">
            Worn once.
            <br />
            Never meant to disappear.
          </h3>
          <p data-fade className="rt-i mx-auto mt-[40px] max-w-[300px] text-[19px] leading-[1.1]" style={{ fontWeight: 500 }}>
            You wear your suit once, then it&rsquo;s hung away for years. It deserves to be appreciated forever.
          </p>
          <p data-fade className="t-small mt-[4px]">
            SARTO transforms your suit into a lasting sculpture, created through a balance of advanced technology and
            hand craftsmanship so that we can preserve every detail. Every commission begins with a private consultation.
            Together, we&rsquo;ll discuss your commission, coordinate the collection of your suit, and personally guide
            you through every step of the SARTO experience.
          </p>
        </Reveal>

        <div className="flex flex-col items-center pb-[150px] pt-[40px] max-md:pb-[90px]">
          <Img name="grid-small" alt="Cream suit detail" className="aspect-[131/184] w-[131px]" />
          <div className="mt-[36px]">
            <Button label="DISCOVER _our_ PROCESS" href="/process" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[10px]">
          <Img name="grid-front" alt="Ivory double-breasted suit detail" className="aspect-[335/455]" />
          <Img name="grid-bust" alt="Plaster sleeve and shoulder" className="aspect-[335/455]" />
        </div>

        <Reveal mode="fade" className="mx-auto max-w-[380px] py-[150px] text-center max-md:py-[90px]">
          <blockquote data-fade className="t-sans-title" style={{ fontSize: "clamp(24px,2.35vw,34px)" }}>
            &ldquo;Technology often pulls us away from what&rsquo;s real. SARTO does the opposite &ndash; we use it to
            bring memory back to physical form.&rdquo;
          </blockquote>
          <p data-fade className="mt-[40px] text-[16px] leading-[1.35] tracking-[0.02em]">
            MATTEO ALDRIGHI VANCE,
            <br />
            <Rich text="_founder of_ SARTO" dot={false} />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
