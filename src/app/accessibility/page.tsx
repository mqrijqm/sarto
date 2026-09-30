import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Accessibility" };

export default function Accessibility() {
  return (
    <LegalPage
      eyebrow="OUR COMMITMENT"
      title="ACCESSIBILITY"
      sections={[
        { h: "Accessibility Statement", p: ["SARTO is committed to making our website usable by everyone. We aim to conform to the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA."] },
        { h: "Motion & Animation", p: ["Our website respects your operating system’s “reduce motion” setting. When it is enabled, scroll-driven animation, 3D movement and page transitions are replaced with their static final states."] },
        { h: "Feedback", p: ["If you encounter any barrier while using this website, please contact us at hello@sartostudio.com or +1 (212) 555-0148. We will respond within two business days."] },
      ]}
    />
  );
}
