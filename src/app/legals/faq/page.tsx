import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { Accordion } from "@/components/Accordion";
import { Reassurance } from "@/components/Reassurance";

export const metadata: Metadata = { title: "Česta pitanja" };

const FAQ = [
  {
    q: { bs: "Šta je tačno SARTO skulptura?", en: "What exactly is a SARTO sculpture?" },
    a: {
      bs: "SARTO skulptura je unikatno naručeno umjetničko djelo inspirisano vašim vjenčanim odijelom. Uz naprednu digitalnu obradu i pažljiv umjetnički proces, naši umjetnici i inženjeri vaše odijelo pretvaraju u skulpturu koja u fizičkom obliku čuva uspomenu na dan vjenčanja. Svaka skulptura se izrađuje pojedinačno i nikada se ne reprodukuje, ne umnožava niti nudi kao dio serije.",
      en: "A SARTO sculpture is a one-of-one commissioned artwork inspired by your wedding suit. Using advanced digital capture and a meticulous artistic process, our artists and engineers transform your suit into a fine-art sculpture that preserves the memory of your wedding day in physical form. Each sculpture is individually created at your commission and is never reproduced, duplicated, or offered as part of an edition.",
    },
  },
  {
    q: { bs: "Hoće li se moje odijelo na bilo koji način izmijeniti?", en: "Will my suit be altered in any way?" },
    a: {
      bs: "Nikada. Odijelo snimamo bez rezanja, pribadača ili označavanja i vraćamo ga u potpuno istom stanju u kojem smo ga primili — ispeglano i u SARTO navlaci.",
      en: "Never. Your suit is captured without cutting, pinning or marking, and it is returned in exactly the condition in which we received it — pressed and hung in a SARTO garment bag.",
    },
  },
  {
    q: { bs: "Koliko traje izrada?", en: "How long does a commission take?" },
    a: {
      bs: "Svaka skulptura je gotova za 12–16 sedmica od dolaska odijela u naš studio. Hitne narudžbe za godišnjice i poklone moguće su na upit.",
      en: "Each sculpture is completed in 12–16 weeks from the arrival of your suit at our studio. Rush commissions are available on request for anniversaries and gifts.",
    },
  },
  {
    q: { bs: "Možete li izraditi smoking, jutarnje odijelo ili kilt?", en: "Can you sculpt a tuxedo, morning suit or kilt?" },
    a: {
      bs: "Da. Izrađujemo smokinge, klasična odijela, jutarnja odijela, svečane uniforme i škotsku nošnju. Leptir-mašne, cvijeće za revers i maramice su uključeni u skulpturu.",
      en: "Yes. We sculpt tuxedos, lounge suits, morning dress, military dress uniforms and highland wear. Accessories such as bow ties, boutonnières and pocket squares are included in the sculpture.",
    },
  },
  {
    q: { bs: "Koliko je skulptura velika?", en: "How large is the sculpture?" },
    a: {
      bs: "Otprilike 40 cm visine i 2–5 kg težine. Veća djela muzejskih dimenzija dostupna su po privatnoj narudžbi.",
      en: "Approximately 16 inches (40 cm) tall, weighing 5–10 pounds. Larger museum-scale pieces are available by private commission.",
    },
  },
  {
    q: { bs: "Možemo li naručiti par za mladence?", en: "Can we commission a pair for the couple?" },
    a: {
      bs: "Naravno. Mnogi parovi naručuju odijelo i vjenčanicu zajedno; oba djela završavamo tako da stoje jedno pored drugog.",
      en: "Absolutely. Many couples commission the suit and the gown together; we finish both pieces to be displayed side by side.",
    },
  },
  {
    q: { bs: "Šaljete li u inostranstvo?", en: "Do you ship internationally?" },
    a: {
      bs: "Da. Za vaše odijelo šaljemo osiguran SARTO paket, a gotovu skulpturu isporučujemo širom svijeta u našoj prepoznatljivoj kutiji.",
      en: "Yes. We provide an insured SARTO Shipping Kit for your suit and deliver the finished sculpture worldwide in our signature box.",
    },
  },
];

export default function Faq() {
  return (
    <>
      <SecondaryHero
        className="pb-[140px] pt-[200px] max-md:pt-[140px]"
        eyebrow={{ bs: "PITANJA _i_ ODGOVORI", en: "QUESTIONS & ANSWERS" }}
        title={{ bs: "PITANJA", en: "FAQ" }}
      />
      <section className="mx-auto max-w-[1180px] px-g">
        <Accordion items={FAQ} />
      </section>
      <Reassurance />
    </>
  );
}
