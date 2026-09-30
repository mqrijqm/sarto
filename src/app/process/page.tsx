import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { WideMedia } from "@/components/WideMedia";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { SplitSticky, NumberedCard } from "@/components/SplitSticky";
import { L } from "@/lib/i18n";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = { title: "Proces" };

const STEPS = [
  {
    n: "I.",
    img: "p-commission",
    title: { bs: "Narudžba", en: "Commission" },
    body: {
      bs: "Svako putovanje počinje narudžbom skulpture preko SARTO stranice. Od tada vas naš tim lično vodi kroz svaki korak, počevši od sigurnog dolaska vašeg odijela u naš studio.",
      en: "Every journey begins by commissioning your sculpture through the SARTO website. From there, our team will personally guide you through each step, beginning with the safe arrival of your suit at our studio.",
    },
  },
  {
    n: "II.",
    img: "p-capture",
    title: { bs: "Snimanje", en: "Capture" },
    body: {
      bs: "Silueta, tkanina i detalji odijela bilježe se naprednim snimanjem i inženjeringom. Originalno odijelo se nikada ne mijenja.",
      en: "The suit's silhouette, cloth, and detail are documented using advanced imaging & engineering. The original garment is never altered.",
    },
  },
  {
    n: "III.",
    img: "p-create",
    title: { bs: "Izrada", en: "Create" },
    body: {
      bs: "Djelo se digitalno prevodi, precizno izrađuje i ručno završava.",
      en: "The work is digitally translated, precision-fabricated, and finished by hand.",
    },
  },
  {
    n: "IV.",
    img: "p-deliver",
    title: { bs: "Isporuka", en: "Deliver" },
    body: {
      bs: "Gotova skulptura šalje se klijentu, spremna da bude izložena i da živi s vama.",
      en: "The completed commissioned sculpture is sent to the client & ready to display and live with.",
    },
  },
];

export default function Process() {
  return (
    <>
      <SecondaryHero
        className="pb-[200px] pt-[200px] max-md:pb-[100px] max-md:pt-[150px]"
        eyebrow={{ bs: "PROCES _izrade_ SKULPTURE", en: "_Sculpture_ CREATION PROCESS" }}
        title={{ bs: "_svaka_ SKULPTURA\nPOČINJE _od_ ODIJELA.", en: "_every_ SCULPTURE\nBEGINS _with_ A SUIT." }}
      />
      <WideMedia name="wide-process" alt="Charcoal three-piece suit beside its sculpture" />

      <SecondaryHero
        className="pb-[120px] pt-[180px]"
        eyebrow={{ bs: "_nakon_ PRVE KONSULTACIJE,", en: "_after your_ INITIAL CONSULTATION," }}
        title={{ bs: "_usklađujemo_\nSVAKI DETALJ.", en: "_we_ COORDINATE\n_every_ DETAIL." }}
        body={{
          bs: "Svaka narudžba počinje privatnom konsultacijom. Zajedno ćemo razgovarati o narudžbi, dogovoriti preuzimanje vašeg odijela i lično vas voditi kroz svaki korak SARTO iskustva. Tokom cijelog procesa odijelo ostaje netaknuto i neizmijenjeno i vraća vam se u stanju u kojem smo ga primili. Skulptura se zatim ručno završava i isporučuje kao trajno umjetničko djelo.",
          en: "Every commission begins with a private consultation. Together, we'll discuss your commission, coordinate the collection of your suit, and personally guide you through every step of the SARTO experience. Throughout the process, the suit remains completely untouched and unaltered, and is returned in the same condition in which we receive it. The sculpture is then hand-finished and delivered as a lasting work of art.",
        }}
      />

      <SplitSticky image="grid-front" alt="Ivory double-breasted suit, close-up">
        <div className="grid grid-cols-2 gap-x-[10px] gap-y-[64px]">
          {STEPS.map((s) => (
            <NumberedCard key={s.n} n={s.n} title={s.title} body={s.body} image={s.img} alt={s.title} />
          ))}
        </div>
        <Reveal mode="fade" className="mx-auto max-w-[440px] py-[140px] text-center">
          <p data-fade className="t-sans-title" style={{ fontSize: "clamp(24px,2.35vw,34px)" }}>
            <L
              bs="Svaka narudžba počinje tako što SARTO preuzme vaše odijelo. Dogovorićemo način koji vam najviše odgovara: SARTO paket za slanje, privatno preuzimanje ili predaju u jednom od naših partnerskih ateljea."
              en="Every commission begins with SARTO receiving your suit. We’ll arrange this in the way that best suits you: using a SARTO Shipping Kit, scheduling a private SARTO collection, or arranging collection through one of our satellite ateliers."
            />
          </p>
          <p data-fade className="rt-i mt-[40px] text-[17px]" style={{ fontWeight: 500 }}>
            <L bs="Za pitanja nam pišite na" en="For questions, please contact" />{" "}
            <a className="u-link" href={`mailto:${CONTACT.commissions}`}>
              {CONTACT.commissions}
            </a>
            .
          </p>
        </Reveal>
      </SplitSticky>

      <div className="flex justify-center py-[180px]">
        <Button label={{ bs: "_Započnite svoju_ NARUDŽBU", en: "_Start your_ COMMISSION" }} href="/order" />
      </div>
    </>
  );
}
