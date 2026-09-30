import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function Terms() {
  return (
    <LegalPage
      eyebrow="LAST UPDATED SEPTEMBER 1, 2026"
      title={"TERMS _and_\nCONDITIONS"}
      sections={[
        {
          h: "Agreement to Our Legal Terms",
          p: [
            "These Terms & Conditions (“Terms”) govern all purchases, commissions, services, shipments, and interactions with SARTO (“SARTO,” “we,” “our,” or “us”). By purchasing a SARTO sculpture, submitting a garment, using our website, or otherwise engaging our services, the client (“Client,” “you,” or “your”) agrees to be bound by these Terms.",
            "These Terms are subject to change by SARTO without prior written notice at any time, in our sole discretion. Any changes will be in effect as of the “Last Updated Date” referenced on the SARTO website.",
          ],
        },
        {
          h: "Commissions & Deposits",
          p: [
            "A commission is confirmed once a deposit of fifty percent (50%) of the commission price has been received. The balance is due prior to shipment of the finished sculpture. SARTO accepts a limited number of commissions each month and may decline any commission at its discretion.",
          ],
        },
        {
          h: "Your Garment",
          p: [
            "SARTO will take reasonable care of any garment submitted for capture. Garments are not cut, pinned, marked or altered, and are returned in the condition received. Clients are responsible for removing personal items from pockets before shipment.",
            "While in our custody, garments are insured up to the declared value stated at the time of commission.",
          ],
        },
        {
          h: "Artistic Interpretation",
          p: [
            "Each sculpture is a hand-finished work of art. Minor variations in surface, tone and scale are inherent to the process and are not considered defects. Colors of the original garment are not reproduced; all sculptures are finished in SARTO white.",
          ],
        },
        {
          h: "Delivery, Returns & Cancellations",
          p: [
            "Delivery times are estimates. Because every sculpture is created to order, commissions cannot be returned. Cancellations made before the capture of your garment are refunded less a consultation fee of $250.",
          ],
        },
        {
          h: "Intellectual Property",
          p: [
            "SARTO retains the copyright in all sculptures, digital captures and derivative files. SARTO will never reproduce, duplicate or sell your sculpture or its digital data to any third party.",
          ],
        },
      ]}
    />
  );
}
