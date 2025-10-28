"use client";
import Image from "next/image";
import MasonryLayout from "@/components/unsplash/masonry-layout";
import useUnsplashLoadingPage from "@/components/unsplash/hooks";
import SpinnerItem from "@/components/spinners/spinner";
import { setSelectedPhoto } from "@/lib/features/unsplash/unsplashSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import PhotoPageUnsplash from "@/app/(content)/unsplash/[slug]/@modal/(.)[slug]/image/page";
import { isLikeSelector } from "@/lib/selectors/unsplashSelectors";
import OverlayImage from "./overlay/overlay-image";
import { useWindowSize } from "@react-hook/window-size";
import { ScrollToTopButton } from "./scroll/scroll-to-top";

import "@/styles/globals.css";
import { useCallback } from "react";

export interface WindowSize {
  width: number;
}
export default function UnsplashList() {
  const dispatch = useAppDispatch();
  const isLike = useAppSelector(isLikeSelector);
  const { photos, srollTrigger, loading } = useUnsplashLoadingPage();
  const [width] = useWindowSize();
  const isMobile = width < 768;

  const isLikeInArrayIdPhotos = useCallback(
    function isLikeInArrayIdPhotos(idPhoto: string) {
      return isLike.some((item: any) => item === idPhoto);
    },
    [isLike]
  );

  return (
    <div>
      <MasonryLayout>
        {photos.map((photo) => (
          <li key={photo.id}>
            <div
              className="layout_hover-image"
              onClick={() => dispatch(setSelectedPhoto(photo))}
            >
              <Image
                src={photo.urls.full}
                width={photo.width}
                height={photo.height}
                alt={photo.alt_description}
                style={{ backgroundSize: "cover" }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/fallback.jpg";
                }}
                priority
              />
              <div
                className={isMobile ? "layout_hover-image-mobile" : "overlay"}
              >
                <OverlayImage
                  photo={photo}
                  isLikeInArrayIdPhotos={isLikeInArrayIdPhotos}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </li>
        ))}
      </MasonryLayout>
      <div ref={srollTrigger} style={{ height: "50px" }}>
        {loading && (
          <div>
            <SpinnerItem />
          </div>
        )}
      </div>
      <PhotoPageUnsplash />
      <ScrollToTopButton />
    </div>
  );
}
