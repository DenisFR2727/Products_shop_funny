import Image from "next/image";
import { FaCamera, FaUser } from "react-icons/fa";
import s from "./profile.module.scss";

interface ProfileHeaderProps {
  avatarSrc: string | null;
  displayName: string;
  displayEmail: string;
  isEditing: boolean;
  onAvatarClick: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}

export default function ProfileHeader({
  avatarSrc,
  displayName,
  displayEmail,
  isEditing,
  onAvatarClick,
  onEdit,
  onSave,
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
              <Image
                src={avatarSrc}
                alt="avatar"
                fill
                sizes="80px"
                style={{ objectFit: "cover" }}
              />
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
            <button type="button" onClick={onCancel} className={s.btnCancel}>
              Cancel
            </button>
            <button type="button" onClick={onSave} className={s.btnSave}>
              Save
            </button>
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
