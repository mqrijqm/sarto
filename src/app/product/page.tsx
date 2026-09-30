import type { Metadata } from "next";
import { ProductView } from "@/components/product/ProductView";

export const metadata: Metadata = { title: "Commission a Sculpture" };

export default function Product() {
  return <ProductView />;
}
