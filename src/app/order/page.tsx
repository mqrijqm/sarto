import type { Metadata } from "next";
import { Media } from "@/components/Media";
import { OrderPanel } from "@/components/OrderPanel";

export const metadata: Metadata = { title: "Order" };

export default function Order() {
  return (
    <section className="grid grid-cols-2 items-start gap-[40px] px-g pb-[140px] pt-[180px] max-md:grid-cols-1 max-md:pt-[120px]">
      <div className="sticky top-[180px] flex justify-center max-md:static">
        <OrderPanel />
      </div>
      <Media name="step-3" alt="Ivory tuxedo beside its plaster sculpture" className="aspect-[643/960]" priority />
    </section>
  );
}
