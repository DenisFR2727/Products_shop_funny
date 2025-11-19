"use client";

import Image from "next/image";
import { useState } from "react";

interface ImageCardProps {
  src: string;
  width: number;
  height: number;
  alt: string;
}

export default function ImageCard({ src, width, height, alt }: ImageCardProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <Image
      className="card-product-img"
      src={imgSrc}
      width={width}
      height={height}
      alt={alt}
      onError={(e) => setImgSrc("/fback-image-card.svg")}
      unoptimized
    />
  );
}
