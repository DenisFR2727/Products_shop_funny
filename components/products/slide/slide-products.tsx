"use client";
import { IProducts } from "@/lib/types";
import { useEffect, useState } from "react";

import "./slide-products.scss";

interface ProductsProps {
  products: IProducts[];
}
export default function SlideProducts({ products }: ProductsProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = index;
      let attempts = 0;

      do {
        nextIndex = (nextIndex + 1) % products.length;
        attempts++;
      } while (
        (!products[nextIndex]?.thumbnail ||
          products[nextIndex].thumbnail === "") &&
        attempts < products.length
      );

      setIndex(nextIndex);
    }, 5000);
    return () => clearInterval(interval);
  }, [index, products]);

  return (
    <div className="slide-products">
      {products.map((product, i) =>
        product.thumbnail ? (
          <img
            key={i}
            src={product.thumbnail}
            alt={`Product ${i}`}
            className={i === index ? "active" : ""}
          />
        ) : null
      )}
    </div>
  );
}
