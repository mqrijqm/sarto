import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Politika privatnosti" };

export default function Policy() {
  return (
    <LegalPage
      eyebrow={{ bs: "POSLJEDNJE AŽURIRANJE 1. SEPTEMBRA 2026.", en: "LAST UPDATED SEPTEMBER 1, 2026" }}
      title={{ bs: "POLITIKA\nPRIVATNOSTI", en: "PRIVACY\nPOLICY" }}
      sections={[
        {
          h: { bs: "Podaci koje prikupljamo", en: "Information We Collect" },
          p: [
            {
              bs: "Prikupljamo podatke koje nam date prilikom narudžbe skulpture, prijave na newsletter ili kontakta sa studijom — ime, email, adresu za dostavu i datum vjenčanja — kao i fotografije i 3D snimke vašeg odjevnog predmeta.",
              en: "We collect the information you provide when you commission a sculpture, subscribe to our newsletter or contact the studio — such as your name, email, shipping address and wedding date — together with images and 3D captures of your garment.",
            },
          ],
        },
        {
          h: { bs: "Kako koristimo vaše podatke", en: "How We Use Your Information" },
          p: [
            {
              bs: "Vaše podatke koristimo za izradu narudžbe, obavještavanje o napretku i, ako to želite, za vijesti iz studija. Snimci odjevnog predmeta koriste se isključivo za izradu vaše skulpture.",
              en: "Your information is used to fulfil your commission, communicate with you about its progress, and, if you opt in, to share news from the studio. Garment captures are used solely to create your sculpture.",
            },
          ],
        },
        {
          h: { bs: "Dijeljenje podataka", en: "Sharing" },
          p: [
            {
              bs: "Ne prodajemo vaše lične podatke. Dijelimo ih samo s pouzdanim partnerima neophodnim za naše usluge, poput procesora plaćanja i osiguranih kurira, uz strogu povjerljivost.",
              en: "We do not sell your personal information. We share it only with trusted partners required to deliver our services, such as payment processors and insured couriers, under strict confidentiality.",
            },
          ],
        },
        {
          h: { bs: "Čuvanje podataka i vaša prava", en: "Retention & Your Rights" },
          p: [
            {
              bs: "U svakom trenutku možete zatražiti uvid, ispravku ili brisanje svojih podataka pisanjem na hello@sartostudio.com. Digitalni snimci se sigurno arhiviraju deset godina kako bi vaša porodica kasnije mogla naručiti nova izdanja, osim ako ne zatražite brisanje.",
              en: "You may request access to, correction of, or deletion of your personal data at any time by writing to hello@sartostudio.com. Digital captures are archived securely for ten years to allow future re-editions for your family, unless you ask us to delete them.",
            },
          ],
        },
        {
          h: { bs: "Kolačići", en: "Cookies" },
          p: [
            {
              bs: "Koristimo neophodne kolačiće za rad stranice (uključujući izbor jezika) i analitiku koja poštuje privatnost. Ne-neophodne kolačiće možete isključiti u postavkama browsera.",
              en: "We use essential cookies to operate the website (including your language choice) and privacy-friendly analytics to understand how it is used. You can disable non-essential cookies in your browser settings.",
            },
          ],
        },
      ]}
    />
  );
}
