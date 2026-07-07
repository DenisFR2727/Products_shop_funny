"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

import { IProducts } from "@/lib/types";

import "./slide-products.scss";

interface ProductsProps {
  products: IProducts[];
}

const SLIDE_SIZE = 500;

function hasThumbnail(product: IProducts): boolean {
  return Boolean(product.thumbnail);
}

function getNextThumbnailIndex(
  products: IProducts[],
  currentIndex: number,
): number {
  if (products.length === 0) {
    return 0;
  }

  let nextIndex = currentIndex;
  let attempts = 0;

  do {
    nextIndex = (nextIndex + 1) % products.length;
    attempts++;
  } while (!hasThumbnail(products[nextIndex]!) && attempts < products.length);

  return nextIndex;
}

export default function SlideProducts({ products }: ProductsProps) {
  const [index, setIndex] = useState(0);

  const nextIndex = useMemo(
    () => getNextThumbnailIndex(products, index),
    [products, index],
  );

  const slideIndices = useMemo(() => {
    const indices = index === nextIndex ? [index] : [index, nextIndex];
    return indices.filter((i) => hasThumbnail(products[i]!));
  }, [index, nextIndex, products]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((current) => getNextThumbnailIndex(products, current));
    }, 5000);

    return () => clearInterval(interval);
  }, [products]);

  return (
    <div className="slide-products">
      <div className="slide-products__bg" aria-hidden="true"></div>
      {slideIndices.map((i) => {
        const product = products[i]!;

        return (
          <div
            key={product.id}
            className={`slide-products__slide${i === index ? " active" : ""}`}
          >
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              sizes={`${SLIDE_SIZE}px`}
              className="slide-products__image"
              priority={i === index}
              loading={i === index ? undefined : "lazy"}
            />
          </div>
        );
      })}
    </div>
  );
}
