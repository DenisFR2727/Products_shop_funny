import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ChangeEvent } from "react";

import s from "./profile.module.scss";
import { FieldConfig } from "./types";

interface ProfileFieldProps {
  field: FieldConfig;
  value: string;
  isEditing: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileField({
  field,
  value,
  isEditing,
  showPassword,
  onTogglePassword,
  onChange,
}: ProfileFieldProps) {
  const isPassword = field.name === "password";
  const inputType = isPassword
    ? showPassword
      ? "text"
      : "password"
    : field.type;
  const inputClass = [
    s.fieldInput,
    isEditing ? s.active : "",
    isPassword && isEditing ? s.hasToggle : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={s.field}>
      <label htmlFor={`profile-${field.name}`} className={s.fieldLabel}>
        {field.label}
      </label>
      <div className={s.fieldInputWrapper}>
        <span className={s.fieldIcon}>{field.icon}</span>
        <input
          id={`profile-${field.name}`}
          type={inputType}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          disabled={!isEditing}
          className={inputClass}
        />
        {isPassword && isEditing && (
          <button
            type="button"
            onClick={onTogglePassword}
            className={s.togglePassBtn}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}
      </div>
    </div>
  );
}
