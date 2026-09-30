import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { Reassurance } from "@/components/Reassurance";
import { GalleryGrid } from "@/components/GalleryGrid";

export const metadata: Metadata = { title: "Gallery" };

export default function Gallery() {
  return (
    <>
      <SecondaryHero
        className="pt-[200px] max-md:pt-[150px]"
        eyebrow="_SARTO's_ GALLERY"
        title={"_where_ MEMORY\nBECOMES A\nMASTERPIECE."}
        body="For centuries, homes have been filled with objects that preserve memory, identity, and family history. SARTO continues that tradition for a new generation, transforming wedding suits into museum-quality sculptures. A new category of heirloom for the modern age."
      />
      <GalleryGrid />
      <Reassurance title={"Your story deserves\nto be sculpted."} body="We would be honored to craft it with you." />
    </>
  );
}
