"use client";
import Image from "next/image";

export default function ImageCard({ src, width, height, alt }: any) {
  return (
    <Image
      className="card-product-img"
      src={src}
      width={width}
      height={height}
      alt={alt}
      onError={(e) => (e.currentTarget.src = "/fback-image-card.svg")}
      unoptimized
    ></Image>
  );
}
