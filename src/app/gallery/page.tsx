import type { Metadata } from "next";
import { SecondaryHero } from "@/components/SecondaryHero";
import { Reassurance } from "@/components/Reassurance";
import { GalleryGrid } from "@/components/GalleryGrid";

export const metadata: Metadata = { title: "Galerija" };

export default function Gallery() {
  return (
    <>
      <SecondaryHero
        className="pt-[200px] max-md:pt-[150px]"
        eyebrow={{ bs: "GALERIJA _SARTA_", en: "_SARTO's_ GALLERY" }}
        title={{ bs: "_gdje_ USPOMENA\nPOSTAJE\nREMEK-DJELO.", en: "_where_ MEMORY\nBECOMES A\nMASTERPIECE." }}
        body={{
          bs: "Stoljećima su domovi bili ispunjeni predmetima koji čuvaju uspomene, identitet i porodičnu historiju. SARTO nastavlja tu tradiciju za novu generaciju, pretvarajući vjenčana odijela u skulpture muzejskog kvaliteta. Nova vrsta porodičnog nasljeđa za moderno doba.",
          en: "For centuries, homes have been filled with objects that preserve memory, identity, and family history. SARTO continues that tradition for a new generation, transforming wedding suits into museum-quality sculptures. A new category of heirloom for the modern age.",
        }}
      />
      <GalleryGrid />
      <Reassurance
        title={{ bs: "Vaša priča zaslužuje\nda postane skulptura.", en: "Your story deserves\nto be sculpted." }}
        body={{ bs: "Bila bi nam čast da je oblikujemo s vama.", en: "We would be honored to craft it with you." }}
      />
    </>
  );
}
