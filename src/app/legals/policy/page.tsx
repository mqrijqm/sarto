import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function Policy() {
  return (
    <LegalPage
      eyebrow="LAST UPDATED SEPTEMBER 1, 2026"
      title={"PRIVACY\nPOLICY"}
      sections={[
        { h: "Information We Collect", p: ["We collect the information you provide when you commission a sculpture, subscribe to our newsletter or contact the studio — such as your name, email, shipping address and wedding date — together with images and 3D captures of your garment."] },
        { h: "How We Use Your Information", p: ["Your information is used to fulfil your commission, communicate with you about its progress, and, if you opt in, to share news from the studio. Garment captures are used solely to create your sculpture."] },
        { h: "Sharing", p: ["We do not sell your personal information. We share it only with trusted partners required to deliver our services, such as payment processors and insured couriers, under strict confidentiality."] },
        { h: "Retention & Your Rights", p: ["You may request access to, correction of, or deletion of your personal data at any time by writing to hello@sartostudio.com. Digital captures are archived securely for ten years to allow future re-editions for your family, unless you ask us to delete them."] },
        { h: "Cookies", p: ["We use essential cookies to operate the website and privacy-friendly analytics to understand how it is used. You can disable non-essential cookies in your browser settings."] },
      ]}
    />
  );
}
