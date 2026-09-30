import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { WideMedia } from "@/components/WideMedia";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { SplitSticky, NumberedCard } from "@/components/SplitSticky";
import { BgSwitch } from "@/components/BgSwitch";
import { Reassurance } from "@/components/Reassurance";
import { WordScrub } from "@/components/WordScrub";
import { L } from "@/lib/i18n";
import { LRich } from "@/components/LRich";
import { m } from "@/content/site";

export const metadata: Metadata = { title: "O nama" };

const VALUES = [
  {
    n: "I.",
    img: "values-1",
    title: { bs: "Naslijeđe", en: "Legacy" },
    body: {
      bs: "Naš proces stvara duboko lična djela koja čuvaju svaki detalj uspomene i naslijeđa koje želite sačuvati.",
      en: "Our process creates deeply personal pieces that capture every detail of the memory and legacy you wish to preserve.",
    },
  },
  {
    n: "II.",
    img: "values-2",
    title: { bs: "Umjetnost", en: "Artistry" },
    body: {
      bs: "Svaku narudžbu oživljavamo pomjerajući granice umjetnosti i oblikujući novu vrstu djela kroz spoj tehnologije i ljudske ruke.",
      en: "We bring each commission to life by pushing the bounds of artistry and shaping a new category of art through the union of technology and the human hand.",
    },
  },
  {
    n: "III.",
    img: "values-3",
    title: { bs: "Slavlje", en: "Celebration" },
    body: {
      bs: "Naš rad je ukorijenjen u radosti — hvata kroj i karakter vašeg odijela u njegovom najličnijem, trajnom obliku.",
      en: "Our work is rooted in joy, capturing the cut and character of your suit in its most personal, enduring form.",
    },
  },
];

const FOUNDER = { bs: "_osnivač_ SARTA", en: "_founder of_ SARTO" };

export default function About() {
  return (
    <>
      <SecondaryHero
        className="pb-[200px] pt-[200px] max-md:pb-[100px] max-md:pt-[150px]"
        eyebrow={{ bs: "_O_ SARTU", en: "_About_ SARTO" }}
        title={{ bs: "_gdje se_ ZANAT\n_susreće s_ EMOCIJOM.", en: "_where_ CRAFTSMANSHIP\n_meets_ EMOTION." }}
      />
      <WideMedia name="wide-about" alt="Cream peak-lapel suit beside its plaster sculpture" />

      <SecondaryHero
        className="pb-[80px] pt-[180px]"
        eyebrow="1."
        title={{ bs: "PRIČA\n_iza_ SARTA.", en: "_The_ STORY\n_behind_ SARTO." }}
      />
      <section className="grid grid-cols-[57fr_43fr] items-center gap-[10px] px-g max-md:grid-cols-1">
        <Media name="story-wedding" alt={{ bs: "Detalj vjenčanog odijela", en: "Wedding suit detail" }} className="aspect-[797/910]" />
        <Reveal mode="fade" className="mx-auto max-w-[340px] py-10">
          <h3 data-fade className="t-sans-title">
            <L bs="Vaše odijelo zaslužuje da se vidi" en="Your Suit Should Be Seen" />
          </h3>
          <p data-fade className="t-small mt-[36px] leading-[1.6]">
            <L
              bs="„Mjesecima sam išao na probe za svoje vjenčano odijelo, a nosio sam ga samo jedno veče. Kad pomislim na to odijelo, sjetim se cijelog dana — oca koji mi popravlja kravatu, prvog pogleda, posljednjeg plesa. Čuvati ga u navlaci činilo mi se kao da ga puštam da nestane, pa sam odlučio stvoriti nešto promišljenije i trajnije. Nešto što može sačuvati svaki šav i osjećaj tog dana.“"
              en="“I spent months on the fittings for my wedding suit, and wore it for just one evening. When I think of that suit, I think of the whole day — my father fixing my tie, the first look, the last dance. Keeping it in a garment bag felt like letting it disappear, so I set out to create something more intentional and lasting. Something that could hold every stitch, and the feeling of that day.”"
            />
          </p>
          <div data-fade className="mt-[70px] flex items-center gap-[10px]">
            <div className="media h-[50px] w-[50px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m("founder", "sm")} alt="" loading="lazy" />
            </div>
            <p className="text-[16px] leading-[1.15]">
              MATTEO ALDRIGHI VANCE,
              <br />
              <LRich text={FOUNDER} />
            </p>
          </div>
        </Reveal>
      </section>

      <section className="px-g pb-[160px] pt-[200px] text-center">
        <Reveal>
          <p className="t-eyebrow mb-[38px]">
            <span className="mask">
              <span data-line className="rt-line">
                <LRich text={{ bs: "_Naša_ VIZIJA:", en: "_Our_ VISION:" }} />
              </span>
            </span>
          </p>
        </Reveal>
        <WordScrub
          className="t-header mx-auto max-w-[1300px]"
          text={{
            bs: "SVIJET U KOJEM _svako_\nMOŽE OVJEKOVJEČITI\nSVOJE USPOMENE\nKROZ UMJETNOST.",
            en: "A WORLD WHERE _anyone_\nCAN IMMORTALIZE\nTHEIR MEMORIES\nTHROUGH FINE ART.",
          }}
        />
      </section>

      <SecondaryHero className="pb-[80px] pt-[40px]" title={{ bs: "_naše_ VRIJEDNOSTI", en: "_our_ VALUES" }} />
      <section className="grid grid-cols-3 gap-[10px] px-g max-md:grid-cols-1 max-md:gap-[60px]">
        {VALUES.map((v) => (
          <article key={v.n} className="text-center">
            <Media name={v.img} alt={v.title} className="aspect-[448/720]" />
            <Reveal mode="fade">
              <p data-fade className="t-body mt-[36px]">
                {v.n}
              </p>
              <h3 data-fade className="t-sans-title mt-[18px]">
                <L bs={v.title.bs} en={v.title.en} />
              </h3>
              <p data-fade className="t-small mx-auto mt-[34px] max-w-[270px] leading-[1.25]">
                <L bs={v.body.bs} en={v.body.en} />
              </p>
            </Reveal>
          </article>
        ))}
      </section>

      <BgSwitch>
        <SecondaryHero
          className="pb-[70px] pt-[180px]"
          title={{ bs: "PRIČA _o_ IMENU\n_i_ SIMBOLICI.", en: "_The_ STORY _of the_ NAME\n& SYMBOLISM." }}
        />
        <SplitSticky image="name-big" alt="Ivory tuxedo jacket, close-up">
          <div className="grid grid-cols-2 gap-[10px]">
            <NumberedCard
              upper
              n="I."
              image="name-family"
              alt={{ bs: "Crni smokinzi", en: "Black tuxedos" }}
              title={{ bs: "IME SARTO", en: "SARTO NAME" }}
              body={{
                bs: "Sarto na italijanskom znači krojač — posveta rukama koje kroje, šiju i peglaju svako vjenčano odijelo, i zanatu koji nastavljamo u novom obliku.",
                en: "Sarto is the Italian word for tailor — a tribute to the hands that cut, baste and press every wedding suit, and to the craft we continue in a new form.",
              }}
            />
            <NumberedCard
              upper
              n="II."
              image="name-flower"
              alt={{ bs: "Gardenija za revers", en: "Gardenia boutonniere" }}
              title={{ bs: "GARDENIJA", en: "GARDENIA" }}
              body={{
                bs: "Gardenija — klasični cvijet za revers — oblikuje SARTO pečat, odabrana zbog skulpturalne forme i simbolike profinjenosti, odanosti i novih početaka.",
                en: "The gardenia — the classic boutonnière — shapes the SARTO seal, chosen for its sculptural form and its symbolism of refinement, devotion and new beginnings.",
              }}
            />
          </div>
          <Reveal mode="fade" className="mx-auto max-w-[400px] py-[130px] text-center">
            <blockquote data-fade className="t-sans-title" style={{ fontSize: "clamp(24px,2.35vw,34px)" }}>
              <L
                bs="„SARTO ono što ste nosili jedno veče pretvara u nešto s čim možete živjeti zauvijek.“"
                en="“SARTO turns what you wore for an evening into something you can live with forever.”"
              />
            </blockquote>
            <p data-fade className="mt-[40px] text-[16px] leading-[1.35]">
              MATTEO ALDRIGHI VANCE,
              <br />
              <LRich text={FOUNDER} />
            </p>
            <div data-fade className="mt-[58px]">
              <Button label={{ bs: "_Započnite svoju_ NARUDŽBU", en: "_Start your_ COMMISSION" }} href="/order" />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-[10px]">
            <NumberedCard
              upper
              n="III."
              image="name-emblem"
              alt={{ bs: "SARTO amblem", en: "SARTO emblem" }}
              title={{ bs: "KROJAČ", en: "THE TAILOR" }}
              body={{
                bs: "Na našem pečatu je krojač koji sjedi i provlači jednu nit — pokret kojim počinje svaki odjevni predmet, drevna slika strpljenja i preciznosti.",
                en: "Our seal features a seated tailor drawing a single thread — the gesture that begins every garment, an ancient image of patience and precision.",
              }}
            />
            <NumberedCard
              upper
              n="IV."
              image="name-groom"
              alt={{ bs: "Krem odijelo, krupni plan", en: "Cream suit, close-up" }}
              title={{ bs: "PALETA ZORE", en: "SUNRISE PALETTE" }}
              body={{
                bs: "Inspirisana izlaskom i zalaskom sunca, naša paleta odražava trenutke prijelaza i slavlja — kraj jednog poglavlja sačuvan u formi.",
                en: "Inspired by sunrise and sunset, our palette reflects moments of transition and celebration, capturing the close of a chapter and preserving it in form.",
              }}
            />
          </div>
        </SplitSticky>
        <Reassurance />
      </BgSwitch>
    </>
  );
}
