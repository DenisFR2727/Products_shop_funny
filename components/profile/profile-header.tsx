"use client";

import Image from "next/image";
import { useFormStatus } from "react-dom";
import { FaCamera, FaUser } from "react-icons/fa";
import { isDataImageAvatarSrc } from "@/components/profile/resolve-avatar-src";
import s from "./profile.module.scss";

interface ProfileHeaderProps {
  avatarSrc: string | null;
  displayName: string;
  displayEmail: string;
  isEditing: boolean;
  isPending: boolean;
  onAvatarClick: () => void;
  onEdit: () => void;
  onCancel: () => void;
}

export default function ProfileHeader({
  avatarSrc,
  displayName,
  displayEmail,
  isEditing,
  isPending,
  onAvatarClick,
  onEdit,
  onCancel,
}: ProfileHeaderProps) {
  return (
    <div className={s.header}>
      <div className={s.headerLeft}>
        <div className={s.avatarWrapper}>
          <div
            className={`${s.avatar} ${isEditing ? s.clickable : ""}`}
            onClick={onAvatarClick}
          >
            {avatarSrc ? (
              isDataImageAvatarSrc(avatarSrc) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt=""
                  className={s.avatarNativeImg}
                />
              ) : (
                <Image
                  src={avatarSrc}
                  alt=""
                  fill
                  sizes="80px"
                  style={{ objectFit: "cover" }}
                />
              )
            ) : (
              <div className={s.avatarFallback}>
                <FaUser />
              </div>
            )}
            {isEditing && (
              <div className={s.avatarOverlay}>
                <FaCamera />
              </div>
            )}
          </div>

          {isEditing && (
            <button
              type="button"
              onClick={onAvatarClick}
              className={s.uploadBtn}
              aria-label="Upload photo"
            >
              <FaCamera />
            </button>
          )}
        </div>

        <div className={s.userInfo}>
          <p className={s.userName}>{displayName}</p>
          <p className={s.userEmail}>{displayEmail}</p>
        </div>
      </div>

      <div className={s.actions}>
        {isEditing ? (
          <>
            <button
              type="button"
              onClick={onCancel}
              disabled={isPending}
              className={s.btnCancel}
            >
              Cancel
            </button>
            <SaveButton />
          </>
        ) : (
          <button type="button" onClick={onEdit} className={s.btnEdit}>
            Edit
          </button>
        )}
      </div>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={s.btnSave}>
      {pending ? "Saving..." : "Save"}
    </button>
  );
}
