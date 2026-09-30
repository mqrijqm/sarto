import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { Accordion } from "@/components/Accordion";

export const metadata: Metadata = { title: "Krojači i fotografi" };

const LIST = [
  {
    q: "Aldrighi Sartoria",
    a: {
      bs: "Napuljska kuća osnovana 1952, poznata po mekim ramenima, ručno rolanim reverima i džepu „barchetta“. Na stranici: smoking boje slonovače sa šal-reverom, krem dvoredno odijelo.",
      en: "A Neapolitan house founded in 1952, known for soft shoulders, hand-rolled lapels and the barchetta breast pocket. Featured: ivory shawl-collar tuxedo, cream double-breasted suit.",
    },
  },
  {
    q: "Hollis & Rowe",
    a: {
      bs: "Savile Row krojenje sa strukturiranom engleskom siluetom. Na stranici: tamnosivo trodijelno odijelo, jednoredno odijelo sa zarezanim reverom.",
      en: "Savile Row tailoring with a structured English silhouette. Featured: charcoal three-piece suit, notch-lapel single-breasted suit.",
    },
  },
  {
    q: "Maison Vautrin",
    a: {
      bs: "Pariški atelje večernje odjeće. Na stranici: bijeli večernji sako i svilene leptir-mašne.",
      en: "Parisian eveningwear atelier. Featured: white dinner jacket and silk bow ties.",
    },
  },
  {
    q: { bs: "Fotografija — Studio Ocra", en: "Photography — Studio Ocra" },
    a: {
      bs: "Editorijalna kampanjska fotografija na ručno oslikanim platnima, New York.",
      en: "Editorial campaign photography on hand-painted canvas backdrops, New York.",
    },
  },
];

export default function Featured() {
  return (
    <>
      <SecondaryHero
        className="pb-[140px] pt-[200px] max-md:pt-[140px]"
        eyebrow={{ bs: "_S ponosom predstavljamo naše_", en: "_Proudly recognizing our_" }}
        title={{ bs: "KROJAČE\n_i_ FOTOGRAFE", en: "FEATURED\nTAILORS" }}
        body={{
          bs: "Odijela prikazana na SARTO stranici, u kampanjama i editorijalima djelo su krojača i ateljea navedenih u nastavku. Zahvalni smo na njihovoj umjetnosti i saradnji.",
          en: "The suits featured throughout SARTO's website, campaigns, and editorial imagery are the work of the tailors and ateliers credited below. We are grateful for their artistry and collaboration.",
        }}
      />
      <section className="mx-auto max-w-[1180px] px-g pb-[200px]">
        <Accordion items={LIST} />
      </section>
    </>
  );
}
