"use client";

import {
  useRef,
  useState,
  useCallback,
  useEffect,
  useActionState,
  ChangeEvent,
  FormEvent,
} from "react";
import { useSession } from "next-auth/react";
import { FaEnvelope } from "react-icons/fa";
import s from "./profile.module.scss";
import ProfileHeader from "./profile-header";
import ProfileField from "./profile-field";
import { FIELDS } from "./profile-config";
import { updateUserAction, UpdateUserState, UpdatedUserData } from "@/actions/updateUser";

// ─── Types ────────────────────────────────────────────────────────────────────

type SavedValues = UpdatedUserData;

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_STATE: UpdateUserState = { success: false, error: null, updatedData: null };
const EMPTY_SAVED: SavedValues = { username: "", email: "", phone: "" };

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfileComponent() {
  const { data: session, update: updateSession } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [formKey, setFormKey] = useState(0);
  const [noChanges, setNoChanges] = useState(false);

  // Source of truth for displayed values and field defaults
  const [savedValues, setSavedValues] = useState<SavedValues>(EMPTY_SAVED);

  // Sync session data → savedValues on initial load
  useEffect(() => {
    if (!session?.user) return;
    setSavedValues((prev) => ({
      username: prev.username || (session.user.name ?? ""),
      email: prev.email || (session.user.email ?? ""),
      phone: prev.phone,
    }));
  }, [session?.user?.name, session?.user?.email]); // eslint-disable-line react-hooks/exhaustive-deps

  const boundAction = updateUserAction.bind(null, session?.user?.id ?? "");
  const [state, formAction, isPending] = useActionState(boundAction, INITIAL_STATE);

  // Sync updatedData → savedValues + JWT session after successful save
  useEffect(() => {
    if (state.success && state.updatedData) {
      setSavedValues(state.updatedData);
      setIsEditing(false);
      updateSession({
        name: state.updatedData.username,
        email: state.updatedData.email,
      });
    }
  }, [state.success, state.updatedData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ──────────────────────────────────────────────────────────────

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

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setNoChanges(false);
  }, []);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setFormKey((k) => k + 1);
    setNoChanges(false);
  }, []);

  // Prevent submit if nothing changed
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      const data = new FormData(e.currentTarget);
      const hasChanges =
        (data.get("username") as string) !== savedValues.username ||
        (data.get("email") as string) !== savedValues.email ||
        (data.get("phone") as string) !== savedValues.phone ||
        !!(data.get("password") as string);

      if (!hasChanges) {
        e.preventDefault();
        setIsEditing(false);
        setNoChanges(true);
      }
    },
    [savedValues],
  );

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
