import type { Metadata } from "next";
import { ProductView } from "@/components/product/ProductView";

export const metadata: Metadata = { title: "Naručite skulpturu" };

export default function Product() {
  return <ProductView />;
}
