import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getProducts } from "@/lib/api/api";
import SlideProducts from "@/components/products/slide/slide-products";
import ProgressHandler from "@/components/products/modal/progress/ProgressHandlerDynamic";
import FeaturedProductsList from "@/components/products/home/featured-products-list";

import "./marketing.scss";

export const metadata: Metadata = {
  title: "Welcome in my shopping site",
  description:
    "There you can choose and order products. There is also a view of images that can be downloaded.",
};

export default async function HomePage() {
  const response = await getProducts();
  const data = response.products;

  const isToggle: boolean = true;

  const featuredProducts = data.slice(1, 4);

  if (!response.products) {
    notFound();
  }
  return (
    <div id="home">
      <div id="dialog-overlay"></div>
      <Suspense fallback={null}>
        <ProgressHandler />
      </Suspense>
      <div className="home_layout">
        <div className="home_marketing">
          <SlideProducts products={data} />
          <div className="home_text">
            <h1>We are changing the way people shop</h1>
            <p>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore
              repellat explicabo enim soluta temporibus asperiores aut obcaecati
              perferendis porro nobis.
            </p>
            <Link href="/products">
              <button>OUR PRODUCTS</button>
            </Link>
          </div>
        </div>
        <h2 className="featured-products-title">Featured products</h2>
        <div className="home_line"></div>
        <FeaturedProductsList products={featuredProducts} isToggle={isToggle} />
      </div>
    </div>
  );
}
