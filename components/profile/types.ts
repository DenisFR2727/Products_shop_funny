import { UpdatedUserData, UpdateUserState } from "@/actions/types";
import { Session } from "next-auth";
import { FormEvent } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type SavedValues = UpdatedUserData;

export interface ProfileFormValues {
  username: string;
  email: string;
  phone: string;
  password: string;
  image: string;
}

export interface FieldConfig {
  name: keyof ProfileFormValues;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ReactNode;
}

export interface UseProfileFormParams {
  userId: string;
  session: Session | null;
  updateSession: (data: {
    name?: string;
    email?: string;
    image?: string | null;
  }) => Promise<Session | null>;
}

export interface UseProfileFormReturn {
  state: UpdateUserState;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  isEditing: boolean;
  savedValues: SavedValues;
  noChanges: boolean;
  formKey: number;
  handleEdit: () => void;
  handleCancel: () => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}
