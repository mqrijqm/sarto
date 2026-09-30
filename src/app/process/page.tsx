import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { WideMedia } from "@/components/WideMedia";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/Button";
import { SplitSticky, NumberedCard } from "@/components/SplitSticky";
import { CONTACT } from "@/content/site";

export const metadata: Metadata = { title: "Process" };

const STEPS = [
  { n: "I.", title: "Commission", img: "p-commission", body: "Every journey begins by commissioning your sculpture through the SARTO website. From there, our team will personally guide you through each step, beginning with the safe arrival of your suit at our studio." },
  { n: "II.", title: "Capture", img: "p-capture", body: "The suit's silhouette, cloth, and detail are documented using advanced imaging & engineering. The original garment is never altered." },
  { n: "III.", title: "Create", img: "p-create", body: "The work is digitally translated, precision-fabricated, and finished by hand." },
  { n: "IV.", title: "Deliver", img: "p-deliver", body: "The completed commissioned sculpture is sent to the client & ready to display and live with." },
];

export default function Process() {
  return (
    <>
      <SecondaryHero className="pb-[200px] pt-[200px] max-md:pb-[100px] max-md:pt-[150px]" eyebrow="_Sculpture_ CREATION PROCESS" title={"_every_ SCULPTURE\nBEGINS _with_ A SUIT."} />
      <WideMedia name="wide-process" alt="Groom in a charcoal three-piece suit beside his sculpture" />

      <SecondaryHero
        className="pb-[120px] pt-[180px]"
        eyebrow="_after your_ INITIAL CONSULTATION,"
        title={"_we_ COORDINATE\n_every_ DETAIL."}
        body="Every commission begins with a private consultation. Together, we'll discuss your commission, coordinate the collection of your suit, and personally guide you through every step of the SARTO experience. Throughout the process, the suit remains completely untouched and unaltered, and is returned in the same condition in which we receive it. The sculpture is then hand-finished and delivered as a lasting work of art."
      />

      <SplitSticky image="grid-front" alt="Groom in an ivory double-breasted suit on a plinth">
        <div className="grid grid-cols-2 gap-x-[10px] gap-y-[64px]">
          {STEPS.map((s) => (
            <NumberedCard key={s.n} n={s.n} title={s.title} body={s.body} image={s.img} alt={s.title} />
          ))}
        </div>
        <Reveal mode="fade" className="mx-auto max-w-[440px] py-[140px] text-center">
          <p data-fade className="t-sans-title" style={{ fontSize: "clamp(24px,2.35vw,34px)" }}>
            Every commission begins with SARTO receiving your suit. We&rsquo;ll arrange this in the way that best suits
            you: using a SARTO Shipping Kit, scheduling a private SARTO collection, or arranging collection through one of
            our satellite ateliers.
          </p>
          <p data-fade className="rt-i mt-[40px] text-[17px]" style={{ fontWeight: 500 }}>
            For questions, please contact{" "}
            <a className="u-link" href={`mailto:${CONTACT.commissions}`}>
              {CONTACT.commissions}
            </a>
            .
          </p>
        </Reveal>
      </SplitSticky>

      <div className="flex justify-center py-[180px]">
        <Button label="_Start your_ COMMISSION" href="/order" />
      </div>
    </>
  );
}
