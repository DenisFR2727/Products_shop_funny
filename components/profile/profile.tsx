"use client";

import { useSession } from "next-auth/react";
import { useRef, useState, useCallback, ChangeEvent } from "react";
import { FaEnvelope } from "react-icons/fa";
import s from "./profile.module.scss";
import ProfileHeader from "./profile-header";
import ProfileField from "./profile-field";
import { FIELDS } from "./profile-config";
import { ProfileFormValues } from "./types";

const DEFAULT_FORM: ProfileFormValues = {
  username: "",
  email: "",
  phone: "",
  password: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileComponent() {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<ProfileFormValues>({
    ...DEFAULT_FORM,
    username: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
  });

  const sessionDefaults: ProfileFormValues = {
    ...DEFAULT_FORM,
    username: session?.user?.name ?? "",
    email: session?.user?.email ?? "",
    //  phone: session?.user?. ?? "",
  };

  const handleAvatarClick = useCallback(() => {
    if (isEditing) fileInputRef.current?.click();
  }, [isEditing]);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setAvatarPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFieldChange = useCallback(
    (field: keyof ProfileFormValues) => (e: ChangeEvent<HTMLInputElement>) => {
      setFormValues((prev) => ({ ...prev, [field]: e.target.value }));
    },
    [],
  );

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setIsSaved(false);
  }, []);

  const handleSave = useCallback(() => {
    setIsEditing(false);
    setIsSaved(true);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFormValues(sessionDefaults);
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  const avatarSrc = avatarPreview ?? session?.user?.image ?? null;
  const displayName = formValues.username || "User";
  const displayEmail = formValues.email || "No email";

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.banner} />

        <ProfileHeader
          avatarSrc={avatarSrc}
          displayName={displayName}
          displayEmail={displayEmail}
          isEditing={isEditing}
          onAvatarClick={handleAvatarClick}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className={s.fileInput}
          onChange={handleFileChange}
        />

        {isSaved && !isEditing && (
          <div className={s.success}>
            <span>✓</span>
            <span>Profile updated successfully</span>
          </div>
        )}

        <hr className={s.divider} />

        <div className={s.fields}>
          {FIELDS.map((field) => (
            <ProfileField
              key={field.name}
              field={field}
              value={formValues[field.name]}
              isEditing={isEditing}
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword((v) => !v)}
              onChange={handleFieldChange(field.name)}
            />
          ))}
        </div>

        <div className={s.emailSection}>
          <p className={s.emailTitle}>My email Address</p>
          <div className={s.emailRow}>
            <div className={s.emailIcon}>
              <FaEnvelope />
            </div>
            <div>
              <p className={s.emailAddress}>{displayEmail}</p>
              <p className={s.emailStatus}>
                {session ? "Active account" : "Not logged in"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
