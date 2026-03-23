import { FaEye, FaEyeSlash } from "react-icons/fa";
import s from "./profile.module.scss";
import { FieldConfig } from "./types";

interface ProfileFieldProps {
  field: FieldConfig;
  defaultValue: string;
  isEditing: boolean;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export default function ProfileField({
  field,
  defaultValue,
  isEditing,
  showPassword,
  onTogglePassword,
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
          name={field.name}
          type={inputType}
          placeholder={field.placeholder}
          defaultValue={defaultValue}
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
