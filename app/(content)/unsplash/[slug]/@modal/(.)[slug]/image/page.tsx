"use client";
import Image from "next/image";
import ModalPortalUnspalsh from "@/components/unsplash/modal/modal-unsplash";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectedPhoto } from "@/lib/features/unsplash/unsplashSlice";
import { selectedPhotoSelector } from "@/lib/selectors/unsplashSelectors";
import { DownloadImage } from "@/components/unsplash/overlay/download-image";

import "@/styles/globals.css";
import "./fullscreen-image.scss";

export default function PhotoPageUnsplash() {
  const dispatch = useAppDispatch();
  const selectedPhoto = useAppSelector(selectedPhotoSelector);

  if (!selectedPhoto) {
    return null;
  }

  return (
    <ModalPortalUnspalsh>
      <button
        type="button"
        className="close-btn"
        onClick={() => dispatch(setSelectedPhoto(null))}
      >
        ✖
      </button>
      <div className="fullscreen-image">
        <Image
          src={selectedPhoto.urls.full}
          alt={selectedPhoto.alt_description || "photo"}
          width={500}
          height={500}
          unoptimized
          style={{
            objectFit: "contain",
            transition: "opacity 0.4s ease",
          }}
        />

        <DownloadImage
          url={selectedPhoto?.links.download ?? ""}
          fileName={`${selectedPhoto?.id}.jpg`}
        >
          <div
            onClick={(e) => {
              e.preventDefault();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") e.preventDefault();
            }}
          >
            <p className="user_profile-unspalsh">
              <span className="user_profile-text">
                {selectedPhoto.user.social.instagram_username}
              </span>
              <img
                width={20}
                height={20}
                src={selectedPhoto.user.profile_image.small}
                alt={selectedPhoto.alt_description || "Profile image"}
              />
            </p>
          </div>
          <button
            type="button"
            className="fullscreen-image_download"
            aria-label="Download image"
          >
            Download
          </button>
        </DownloadImage>
      </div>
    </ModalPortalUnspalsh>
  );
}
