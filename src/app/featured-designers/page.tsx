import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { Accordion } from "@/components/Accordion";

export const metadata: Metadata = { title: "Featured Tailors" };

const LIST = [
  { q: "Aldrighi Sartoria", a: "A Neapolitan house founded in 1952, known for soft shoulders, hand-rolled lapels and the barchetta breast pocket. Featured: ivory shawl-collar tuxedo, cream double-breasted suit." },
  { q: "Hollis & Rowe", a: "Savile Row tailoring with a structured English silhouette. Featured: charcoal three-piece suit, notch-lapel single-breasted suit." },
  { q: "Maison Vautrin", a: "Parisian eveningwear atelier. Featured: white dinner jacket and silk bow ties." },
  { q: "Photography — Studio Ocra", a: "Editorial campaign photography on hand-painted canvas backdrops, New York." },
];

export default function Featured() {
  return (
    <>
      <SecondaryHero
        className="pb-[140px] pt-[200px] max-md:pt-[140px]"
        eyebrow="_Proudly recognizing our_"
        title={"FEATURED\nTAILORS"}
        body="The suits featured throughout SARTO's website, campaigns, and editorial imagery are the work of the tailors and ateliers credited below. We are grateful for their artistry and collaboration."
      />
      <section className="mx-auto max-w-[1180px] px-g pb-[200px]">
        <Accordion items={LIST} />
      </section>
    </>
  );
}
