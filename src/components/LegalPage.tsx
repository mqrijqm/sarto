import { SecondaryHero } from "./SecondaryHero";
import { Reveal } from "./Reveal";

export type LegalSection = { h: string; p: string[] };

/** Terms / Privacy / Accessibility: veliki naslov + dugačak tekst u koloni ~1135px. */
export function LegalPage({ eyebrow, title, sections }: { eyebrow: string; title: string; sections: LegalSection[] }) {
  return (
    <>
      <SecondaryHero className="pb-[160px] pt-[200px] max-md:pb-[80px] max-md:pt-[140px]" eyebrow={eyebrow} title={title} />
      <article className="mx-auto max-w-[1195px] px-g pb-[200px] max-md:pb-[120px]">
        {sections.map((s) => (
          <Reveal key={s.h} mode="fade" className="mb-[56px]" start="top 95%">
            <h2 data-fade className="text-[22px] tracking-[-0.01em]">
              {s.h}
            </h2>
            {s.p.map((p, i) => (
              <p data-fade key={i} className="t-body mt-[16px] text-[18px] leading-[1.5]">
                {p}
              </p>
            ))}
          </Reveal>
        ))}
      </article>
    </>
  );
}
