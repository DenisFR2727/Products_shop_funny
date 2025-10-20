"use client";
import { setIdPhotoToggle } from "@/lib/features/unsplash/unsplashSlice";
import { useAppDispatch } from "@/lib/hooks";
import { UnsPlash } from "@/lib/types";
import { DownloadImage } from "./download-image";
import LikeButton from "../like/like-icon";

export interface OverlayImageProps {
  isLikeInArrayIdPhotos?: (id: string) => boolean;
  photo?: UnsPlash;
  isMobile?: boolean;
}

export default function OverlayImage({
  isLikeInArrayIdPhotos = () => false,
  photo,
  isMobile = false,
}: OverlayImageProps) {
  const dispatch = useAppDispatch();

  if (!photo) return null;

  return (
    <div className="overlay overlay-mobile">
      <div
        className={`form_like-image form_like-image-mobile ${isLikeInArrayIdPhotos(photo.id) ? "liked" : ""}`}
        onClick={(e) => {
          dispatch(setIdPhotoToggle(photo.id));
          e.preventDefault(), e.stopPropagation();
        }}
      >
        <LikeButton />
      </div>
      <span className="author author-mobile">{photo.created_at}</span>
      <DownloadImage
        url={photo?.links.download ?? ""}
        fileName={`${photo?.id}.jpg`}
      >
        <button rel="noopener noreferrer" className="download-btn">
          {isMobile ? (
            <span className="download-btn-mobile">
              <span className="download-btn-text">Download</span>
              <img
                className="download-btn-arrow"
                src="/arrow-down-svgrepo-com.svg"
                alt="arrow-down-svgrepo"
              />
            </span>
          ) : (
            <img src="/arrow-down-svgrepo-com.svg" alt="arrow-down-svgrepo" />
          )}
        </button>
      </DownloadImage>
    </div>
  );
}
