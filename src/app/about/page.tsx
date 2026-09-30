import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { WideMedia } from "@/components/WideMedia";
import { Media } from "@/components/Media";
import { Reveal } from "@/components/Reveal";
import { Rich } from "@/components/Rich";
import { Button } from "@/components/Button";
import { SplitSticky, NumberedCard } from "@/components/SplitSticky";
import { BgSwitch } from "@/components/BgSwitch";
import { Reassurance } from "@/components/Reassurance";
import { WordScrub } from "@/components/WordScrub";
import { m } from "@/content/site";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  { n: "I.", title: "Legacy", img: "values-1", body: "Our process creates deeply personal pieces that capture every detail of the memory and legacy you wish to preserve." },
  { n: "II.", title: "Artistry", img: "values-2", body: "We bring each commission to life by pushing the bounds of artistry and shaping a new category of art through the union of technology and the human hand." },
  { n: "III.", title: "Celebration", img: "values-3", body: "Our work is rooted in joy, capturing the cut and character of your suit in its most personal, enduring form." },
];

export default function About() {
  return (
    <>
      <SecondaryHero className="pb-[200px] pt-[200px] max-md:pb-[100px] max-md:pt-[150px]" eyebrow="_About_ SARTO" title={"_where_ CRAFTSMANSHIP\n_meets_ EMOTION."} />
      <WideMedia name="wide-about" alt="Cream peak-lapel suit beside its plaster sculpture" />

      <SecondaryHero className="pb-[80px] pt-[180px]" eyebrow="1." title={"_The_ STORY\n_behind_ SARTO."} />
      <section className="grid grid-cols-[57fr_43fr] items-center gap-[10px] px-g max-md:grid-cols-1">
        <Media name="story-wedding" alt="Wedding suit detail" className="aspect-[797/910]" />
        <Reveal mode="fade" className="mx-auto max-w-[340px] py-10">
          <h3 data-fade className="t-sans-title">Your Suit Should Be Seen</h3>
          <p data-fade className="t-small mt-[36px] leading-[1.6]">
            &ldquo;I spent months on the fittings for my wedding suit, and wore it for just one evening. When I think of that
            suit, I think of the whole day &mdash; my father fixing my tie, the first look, the last dance. Keeping it in a
            garment bag felt like letting it disappear, so I set out to create something more intentional and lasting.
            Something that could hold every stitch, and the feeling of that day.&rdquo;
          </p>
          <div data-fade className="mt-[70px] flex items-center gap-[10px]">
            <div className="media h-[50px] w-[50px] shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m("founder")} alt="Tailor’s tools" loading="lazy" />
            </div>
            <p className="text-[16px] leading-[1.15]">
              MATTEO ALDRIGHI VANCE,
              <br />
              <Rich text="_founder of_ SARTO" dot={false} />
            </p>
          </div>
        </Reveal>
      </section>

      <section className="px-g pb-[160px] pt-[200px] text-center">
        <Reveal>
          <p className="t-eyebrow mb-[38px]">
            <span className="mask">
              <span data-line className="rt-line">
                <Rich text="_Our_ VISION:" dot={false} />
              </span>
            </span>
          </p>
        </Reveal>
        <WordScrub className="t-header mx-auto max-w-[1300px]" text={"A WORLD WHERE _anyone_\nCAN IMMORTALIZE\nTHEIR MEMORIES\nTHROUGH FINE ART."} />
      </section>

      <SecondaryHero className="pb-[80px] pt-[40px]" title="_our_ VALUES" />
      <section className="grid grid-cols-3 gap-[10px] px-g max-md:grid-cols-1 max-md:gap-[60px]">
        {VALUES.map((v) => (
          <article key={v.n} className="text-center">
            <Media name={v.img} alt={v.title} className="aspect-[448/720]" />
            <Reveal mode="fade">
              <p data-fade className="t-body mt-[36px]">{v.n}</p>
              <h3 data-fade className="t-sans-title mt-[18px]">{v.title}</h3>
              <p data-fade className="t-small mx-auto mt-[34px] max-w-[270px] leading-[1.25]">{v.body}</p>
            </Reveal>
          </article>
        ))}
      </section>

      <BgSwitch>
        <SecondaryHero className="pb-[70px] pt-[180px]" title={"_The_ STORY _of the_ NAME\n& SYMBOLISM."} />
        <SplitSticky image="name-big" alt="Ivory tuxedo jacket, close-up">
          <div className="grid grid-cols-2 gap-[10px]">
            <NumberedCard upper n="I." image="name-family" alt="Black tuxedo detail" title="SARTO NAME" body="Sarto is the Italian word for tailor — a tribute to the hands that cut, baste and press every wedding suit, and to the craft we continue in a new form." />
            <NumberedCard upper n="II." image="name-flower" alt="Gardenia boutonniere" title="GARDENIA" body="The gardenia — the classic boutonnière — shapes the SARTO seal, chosen for its sculptural form and its symbolism of refinement, devotion and new beginnings." />
          </div>
          <Reveal mode="fade" className="mx-auto max-w-[400px] py-[130px] text-center">
            <blockquote data-fade className="t-sans-title" style={{ fontSize: "clamp(24px,2.35vw,34px)" }}>
              &ldquo;SARTO turns what you wore for an evening into something you can live with forever.&rdquo;
            </blockquote>
            <p data-fade className="mt-[40px] text-[16px] leading-[1.35]">
              MATTEO ALDRIGHI VANCE,
              <br />
              <Rich text="_founder of_ SARTO" dot={false} />
            </p>
            <div data-fade className="mt-[58px]">
              <Button label="_Start your_ COMMISSION" href="/order" />
            </div>
          </Reveal>
          <div className="grid grid-cols-2 gap-[10px]">
            <NumberedCard upper n="III." image="name-emblem" alt="SARTO emblem" title="THE TAILOR" body="Our seal features a seated tailor drawing a single thread — the gesture that begins every garment, an ancient image of patience and precision." />
            <NumberedCard upper n="IV." image="name-groom" alt="Cream suit, close-up" title="SUNRISE PALETTE" body="Inspired by sunrise and sunset, our palette reflects moments of transition and celebration, capturing the close of a chapter and preserving it in form." />
          </div>
        </SplitSticky>
        <Reassurance />
      </BgSwitch>
    </>
  );
}
