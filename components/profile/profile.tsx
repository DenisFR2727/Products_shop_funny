"use client";

import {
  useRef,
  useState,
  useCallback,
  ChangeEvent,
} from "react";
import { useSession } from "next-auth/react";
import { FaEnvelope } from "react-icons/fa";
import s from "./profile.module.scss";
import ProfileHeader from "./profile-header";
import ProfileField from "./profile-field";
import { FIELDS } from "./profile-config";
import { SavedValues } from "./types";
import { useProfileForm } from "./hooks";
import { UpdateUserErrors } from "@/actions/types";


// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileComponent() {
   const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const {
   state,
   formAction,
   isPending,
   isEditing,
   savedValues,
   noChanges,
   formKey,
   handleEdit,
   handleCancel,
   handleSubmit,
 } = useProfileForm({
   userId: session?.user?.id ?? "",
   session,
   updateSession,
 });

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



  // ─── Derived values ────────────────────────────────────────────────────────

  const avatarSrc = avatarPreview ?? session?.user?.image ?? null;
  const displayName = savedValues.username || session?.user?.name || "User";
  const displayEmail = savedValues.email || session?.user?.email || "No email";

  const getFieldDefault = (fieldName: string): string => {
    if (fieldName === "password") return "";
    return savedValues[fieldName as keyof SavedValues] ?? "";
  };

  return (
    <div className={s.page}>
      <div className={s.card}>
        <div className={s.banner} />

        <form key={formKey} action={formAction} onSubmit={handleSubmit}>
          <ProfileHeader
            avatarSrc={avatarSrc}
            displayName={displayName}
            displayEmail={displayEmail}
            isEditing={isEditing}
            isPending={isPending}
            onAvatarClick={handleAvatarClick}
            onEdit={handleEdit}
            onCancel={handleCancel}
          />

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className={s.fileInput}
            onChange={handleFileChange}
          />

          {state.success && !isEditing && (
            <div className={s.success}>
              <span>✓</span>
              <span>Profile updated successfully</span>
            </div>
          )}

          {noChanges && (
            <div className={s.noChanges}>
              <span>ℹ</span>
              <span>No changes to save</span>
            </div>
          )}

          {state.error && (
            <div className={s.error}>
              <span>✕</span>
              <span>{state.error}</span>
            </div>
          )}

          <hr className={s.divider} />

          <div className={s.fields}>
            {FIELDS.map((field) => (
              <ProfileField
                key={field.name}
                field={field}
                defaultValue={getFieldDefault(field.name)}
                isEditing={isEditing}
                showPassword={showPassword}
                error={state.errors?.[field.name as keyof UpdateUserErrors]}
                onTogglePassword={() => setShowPassword((v) => !v)}
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
        </form>
      </div>
    </div>
  );
}
