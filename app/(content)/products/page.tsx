import AutoOpenSaleModal from "@/components/products/modal/sale/auto-sale";
import ProductsServices from "@/components/products/products-services";
import { getProducts } from "@/lib/api/api";
import { Metadata } from "next";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Products funny page",
  description: "Products funny page and filter products category.",
};

export default async function ProductsPage() {
  const response = await getProducts();
  const data = response.products;

  return (
    <>
      <div id="dialog-overlay"></div>
      <ProductsServices products={data} />
      <AutoOpenSaleModal delay={2000} />
    </>
  );
}
