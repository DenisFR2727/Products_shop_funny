// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileFormValues {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export interface FieldConfig {
  name: keyof ProfileFormValues;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
}
