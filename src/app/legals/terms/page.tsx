import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Uslovi korištenja" };

export default function Terms() {
  return (
    <LegalPage
      eyebrow={{ bs: "POSLJEDNJE AŽURIRANJE 1. SEPTEMBRA 2026.", en: "LAST UPDATED SEPTEMBER 1, 2026" }}
      title={{ bs: "USLOVI\n_korištenja_", en: "TERMS _and_\nCONDITIONS" }}
      sections={[
        {
          h: { bs: "Pristanak na naše pravne uslove", en: "Agreement to Our Legal Terms" },
          p: [
            {
              bs: "Ovi Uslovi korištenja („Uslovi“) uređuju sve kupovine, narudžbe, usluge, pošiljke i interakcije sa SARTOM („SARTO“, „mi“, „naš“). Kupovinom SARTO skulpture, slanjem odjevnog predmeta, korištenjem naše stranice ili na drugi način korištenjem naših usluga, klijent („Klijent“, „vi“, „vaš“) pristaje na ove Uslove.",
              en: "These Terms & Conditions (“Terms”) govern all purchases, commissions, services, shipments, and interactions with SARTO (“SARTO,” “we,” “our,” or “us”). By purchasing a SARTO sculpture, submitting a garment, using our website, or otherwise engaging our services, the client (“Client,” “you,” or “your”) agrees to be bound by these Terms.",
            },
            {
              bs: "SARTO može izmijeniti ove Uslove u bilo kom trenutku, bez prethodne pismene najave, po vlastitom nahođenju. Izmjene važe od „datuma posljednjeg ažuriranja“ navedenog na SARTO stranici.",
              en: "These Terms are subject to change by SARTO without prior written notice at any time, in our sole discretion. Any changes will be in effect as of the “Last Updated Date” referenced on the SARTO website.",
            },
          ],
        },
        {
          h: { bs: "Narudžbe i depoziti", en: "Commissions & Deposits" },
          p: [
            {
              bs: "Narudžba je potvrđena nakon uplate depozita od pedeset posto (50%) cijene. Ostatak se plaća prije slanja gotove skulpture. SARTO svakog mjeseca prima ograničen broj narudžbi i može odbiti bilo koju narudžbu po vlastitom nahođenju.",
              en: "A commission is confirmed once a deposit of fifty percent (50%) of the commission price has been received. The balance is due prior to shipment of the finished sculpture. SARTO accepts a limited number of commissions each month and may decline any commission at its discretion.",
            },
          ],
        },
        {
          h: { bs: "Vaš odjevni predmet", en: "Your Garment" },
          p: [
            {
              bs: "SARTO će se razumno brinuti o svakom odjevnom predmetu poslanom na snimanje. Predmeti se ne režu, ne pribadaju, ne označavaju i ne mijenjaju, i vraćaju se u stanju u kojem su primljeni. Klijent je dužan prije slanja isprazniti džepove.",
              en: "SARTO will take reasonable care of any garment submitted for capture. Garments are not cut, pinned, marked or altered, and are returned in the condition received. Clients are responsible for removing personal items from pockets before shipment.",
            },
            {
              bs: "Dok su kod nas, odjevni predmeti su osigurani do vrijednosti prijavljene prilikom narudžbe.",
              en: "While in our custody, garments are insured up to the declared value stated at the time of commission.",
            },
          ],
        },
        {
          h: { bs: "Umjetnička interpretacija", en: "Artistic Interpretation" },
          p: [
            {
              bs: "Svaka skulptura je ručno završeno umjetničko djelo. Manje razlike u površini, tonu i razmjeri sastavni su dio procesa i ne smatraju se nedostatkom. Boje originalnog odijela se ne reprodukuju; sve skulpture završavaju se u SARTO bijeloj.",
              en: "Each sculpture is a hand-finished work of art. Minor variations in surface, tone and scale are inherent to the process and are not considered defects. Colors of the original garment are not reproduced; all sculptures are finished in SARTO white.",
            },
          ],
        },
        {
          h: { bs: "Isporuka, povrat i otkazivanje", en: "Delivery, Returns & Cancellations" },
          p: [
            {
              bs: "Rokovi isporuke su okvirni. Budući da se svaka skulptura izrađuje po narudžbi, povrat nije moguć. Otkazivanje prije snimanja odijela refundira se umanjeno za naknadu za konsultaciju od 250 $.",
              en: "Delivery times are estimates. Because every sculpture is created to order, commissions cannot be returned. Cancellations made before the capture of your garment are refunded less a consultation fee of $250.",
            },
          ],
        },
        {
          h: { bs: "Intelektualno vlasništvo", en: "Intellectual Property" },
          p: [
            {
              bs: "SARTO zadržava autorska prava na sve skulpture, digitalne snimke i izvedene datoteke. SARTO nikada neće reprodukovati, umnožavati niti prodavati vašu skulpturu ili njene digitalne podatke trećim licima.",
              en: "SARTO retains the copyright in all sculptures, digital captures and derivative files. SARTO will never reproduce, duplicate or sell your sculpture or its digital data to any third party.",
            },
          ],
        },
      ]}
    />
  );
}
