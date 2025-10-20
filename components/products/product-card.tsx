import { IProducts } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import Cart from "./cart/cart-products-icon";

import "./product-card.scss";

export type ProductCardProps = {
  product: IProducts;
  isToggle: boolean;
};

export default function ProductCard({ product, isToggle }: ProductCardProps) {
  return (
    <div className={!isToggle ? "card-product" : "card-product-list"}>
      <Link href={`/products/${product.id}`} prefetch={false}>
        <Image
          className="card-product-img"
          src={product.thumbnail}
          width={250}
          height={250}
          alt={product.title}
        />
      </Link>
      <div className="card-info">
        <h2 className="title-card">
          {product.title.split(" ").length > 2
            ? product.title.split(" ").slice(0, 2).join(" ") + "..."
            : product.title}
        </h2>
        <p className="card-product-price">{product.price} $</p>
      </div>
      <Cart product={product} />
    </div>
  );
}
