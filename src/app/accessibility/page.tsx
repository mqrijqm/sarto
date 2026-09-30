import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Pristupačnost" };

export default function Accessibility() {
  return (
    <LegalPage
      eyebrow={{ bs: "NAŠA OBAVEZA", en: "OUR COMMITMENT" }}
      title={{ bs: "PRISTUPAČNOST", en: "ACCESSIBILITY" }}
      sections={[
        {
          h: { bs: "Izjava o pristupačnosti", en: "Accessibility Statement" },
          p: [
            {
              bs: "SARTO se trudi da naša stranica bude upotrebljiva svima. Cilj nam je usklađenost sa smjernicama WCAG 2.2 na nivou AA.",
              en: "SARTO is committed to making our website usable by everyone. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA.",
            },
          ],
        },
        {
          h: { bs: "Pokret i animacija", en: "Motion & Animation" },
          p: [
            {
              bs: "Stranica poštuje postavku „smanji pokret“ vašeg operativnog sistema. Kada je uključena, animacije vezane za skrol, 3D pokreti i prelazi stranica zamjenjuju se svojim mirnim završnim stanjem.",
              en: "Our website respects your operating system’s “reduce motion” setting. When it is enabled, scroll-driven animation, 3D movement and page transitions are replaced with their static final states.",
            },
          ],
        },
        {
          h: { bs: "Povratne informacije", en: "Feedback" },
          p: [
            {
              bs: "Ako naiđete na bilo kakvu prepreku pri korištenju stranice, pišite nam na hello@sartostudio.com ili nazovite +1 (212) 555-0148. Odgovorićemo u roku od dva radna dana.",
              en: "If you encounter any barrier while using this website, please contact us at hello@sartostudio.com or +1 (212) 555-0148. We will respond within two business days.",
            },
          ],
        },
      ]}
    />
  );
}
