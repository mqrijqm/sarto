import type { ReactNode } from "react";
import { Reveal } from "./Reveal";
import { m } from "@/content/site";

export type Card = { img: string; alt: string; n: string; title: string; body: string };

function CardItem({ c, upper }: { c: Card; upper?: boolean }) {
  return (
    <article>
      <Reveal mode="media" className="media aspect-[335/462]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={m(c.img)} alt={c.alt} loading="lazy" />
      </Reveal>
      <Reveal mode="fade" className="pr-[30px] pt-[26px]">
        <p data-fade className="t-small">
          {c.n}
        </p>
        <h3 data-fade className={`t-sans-title mt-[26px] ${upper ? "uppercase" : ""}`}>
          {c.title}
        </h3>
        <p data-fade className="t-small mt-[36px] max-w-[320px] text-[15px] leading-[1.18]">
          {c.body}
        </p>
      </Reveal>
    </article>
  );
}

/**
 * Levo sticky velika slika, desno 2 kolone kartica (slika, rimski broj, naslov, tekst),
 * a između redova proizvoljan sadržaj (`middle`) — citat, CTA, tekst.
 */
export function CardGrid({
  sticky,
  stickyAlt,
  top,
  middle,
  bottom = [],
  after,
  upper,
}: {
  sticky: string;
  stickyAlt: string;
  top: Card[];
  middle?: ReactNode;
  bottom?: Card[];
  after?: ReactNode;
  upper?: boolean;
}) {
  return (
    <section className="grid grid-cols-2 gap-[10px] px-g max-md:grid-cols-1">
      <div>
        <div className="sticky top-[10px] h-[calc(100svh-20px)] max-md:relative max-md:h-[80svh]">
          <Reveal mode="media" className="media h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m(sticky)} alt={stickyAlt} loading="lazy" />
          </Reveal>
        </div>
      </div>
      <div className="flex flex-col pb-[10px]">
        <div className="grid grid-cols-2 gap-x-[10px] gap-y-[60px]">
          {top.map((c) => (
            <CardItem key={c.title} c={c} upper={upper} />
          ))}
        </div>
        {middle}
        {bottom.length > 0 && (
          <div className="grid grid-cols-2 gap-x-[10px] gap-y-[60px]">
            {bottom.map((c) => (
              <CardItem key={c.title} c={c} upper={upper} />
            ))}
          </div>
        )}
        {after}
      </div>
    </section>
  );
}
