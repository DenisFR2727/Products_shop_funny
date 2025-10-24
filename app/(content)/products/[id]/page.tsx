import { getProduct } from "@/lib/api";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import DetailsNav from "@/components/details/details-nav";
import AddToCart from "@/components/products/cart/cart-button-add";

import "./details-product.scss";
import { Metadata } from "next";

export const dynamic = "force-static";

export type PropsId = {
  params: Promise<{
    id: string;
  }>;
};

export const metadata: Metadata = {
  title: "Product detail info",
  description: "Product detail info and add to cart.",
};

export default async function DetailsProductPage({ params }: PropsId) {
  const { id } = await params;
  const product = await getProduct(+id);
  const mainImage =
    Array.isArray(product?.images) && product.images.length
      ? product.images[0]
      : "/fallback.jpg";

  if (!product) {
    notFound();
  }

  return (
    <div className="details_product">
      <div className="details-content">
        <div>
          <DetailsNav />
          <Link href={`/products/${id}/image`}>
            <Image
              src={mainImage}
              width={400}
              height={400}
              alt={product.title}
            />
          </Link>
        </div>
        <div className="details-info">
          <h2>{product.title}</h2>
          <p>
            Brand: <span>{product.brand}</span>
          </p>
          <p>
            Category: <span>{product.category}</span>
          </p>
          <p>
            Price: <span>{product?.price ?? "N/A"} $</span>
          </p>
          <span className="dimensions">Dimensions</span>
          <ul className="det-dimensions">
            <li>
              width:
              <span className="det-item">
                {product.dimensions?.width ?? "N/A"}
              </span>
            </li>
            <li>
              height:
              <span className="det-item">
                {product.dimensions?.height ?? "N/A"}
              </span>
            </li>
            <li>
              depth:
              <span className="det-item">
                {product.dimensions?.depth ?? "N/A"}
              </span>
            </li>
          </ul>
          <p className="desc">{product.description}</p>
          <AddToCart product={product} />
        </div>
      </div>
    </div>
  );
}
