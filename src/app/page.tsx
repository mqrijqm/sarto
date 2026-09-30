import { HomeHero } from "@/components/home/HomeHero";
import { SuitDiscover } from "@/components/home/SuitDiscover";
import { Stepper } from "@/components/home/Stepper";
import { StickyGrid } from "@/components/home/StickyGrid";
import { MediaGridPush } from "@/components/home/MediaGridPush";
import { LargeQuote } from "@/components/home/LargeQuote";
import { SecondaryHero } from "@/components/SecondaryHero";
import { Reassurance } from "@/components/Reassurance";

export default function Home() {
  return (
    <>
      <HomeHero />
      <SuitDiscover />
      <Stepper />
      <SecondaryHero
        className="pb-[70px] pt-[200px] max-md:pt-[120px]"
        eyebrow="_a_ PROCESS BUILT _for_ PERFECTION"
        title={"_so_ THAT YOU\nBECOME ART."}
      />
      <StickyGrid />
      <SecondaryHero className="pt-[40px]" eyebrow="_your_ MEMORY" title={"_will_ FOREVER\n_be a_ MASTERPIECE."} />
      <MediaGridPush />
      <LargeQuote />
      <Reassurance />
    </>
  );
}
