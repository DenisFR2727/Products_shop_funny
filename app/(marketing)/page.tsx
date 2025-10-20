import Link from "next/link";
import ProductCard from "@/components/products/product-card";

import { notFound } from "next/navigation";
import { getProducts } from "@/lib/api";
import SlideProducts from "@/components/products/slide/slide-products";

import "./marketing.scss";
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
        <h2>Featured products</h2>
        <div className="home_line"></div>
        <div className="home_products-marketing">
          {featuredProducts?.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              isToggle={isToggle}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
