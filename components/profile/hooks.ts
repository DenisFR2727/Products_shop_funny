// hooks/useProfileForm.ts

import {
  FormEvent,
  useActionState,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  SavedValues,
  UseProfileFormParams,
  UseProfileFormReturn,
} from "./types";
import { updateUserAction } from "@/actions/updateUser";
import { UpdateUserState } from "@/actions/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_STATE: UpdateUserState = {
  success: false,
  error: null,
  errors: null,
  updatedData: null,
};
const EMPTY_SAVED: SavedValues = {
  username: "",
  email: "",
  phone: "",
};

export function useProfileForm({
  userId,
  session,
  updateSession,
}: UseProfileFormParams): UseProfileFormReturn {
  const boundAction = useMemo(
    () => updateUserAction.bind(null, userId),
    [userId],
  );
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [savedValues, setSavedValues] = useState<SavedValues>(EMPTY_SAVED);
  const [noChanges, setNoChanges] = useState<boolean>(false);
  const [formKey, setFormKey] = useState<number>(0);
  const [state, formAction, isPending] = useActionState(
    boundAction,
    INITIAL_STATE,
  );

  // Sync session data → savedValues on initial load
  useEffect(() => {
    if (!session?.user) return;

    setSavedValues({
      username: session.user.name ?? "",
      email: session.user.email ?? "",
      phone: "",
      image: session.user.image ?? undefined,
    });
  }, [session?.user]);

  // Sync updatedData → savedValues + JWT session after successful save
  useEffect(() => {
    if (state.success && state.updatedData) {
      setSavedValues((prev) => ({
        username: state.updatedData!.username,
        email: state.updatedData!.email,
        phone: state.updatedData!.phone,
        image:
          state.updatedData!.image !== undefined
            ? state.updatedData!.image
            : prev.image,
      }));
      setIsEditing(false);
      updateSession({
        name: state.updatedData.username,
        email: state.updatedData.email,
        ...(state.updatedData.image !== undefined
          ? { image: state.updatedData.image }
          : {}),
      });
    }
  }, [state.success, state.updatedData]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Handlers ──────────────────────────────────────────────────────────────

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
      const avatar = data.get("avatar");
      const hasNewAvatar = avatar instanceof File && avatar.size > 0;
      const hasChanges =
        (data.get("username") as string) !== savedValues.username ||
        (data.get("email") as string) !== savedValues.email ||
        (data.get("phone") as string) !== savedValues.phone ||
        !!(data.get("password") as string) ||
        hasNewAvatar;

      if (!hasChanges) {
        e.preventDefault();
        setIsEditing(false);
        setNoChanges(true);
      }
    },
    [savedValues],
  );

  return {
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
  };
}
