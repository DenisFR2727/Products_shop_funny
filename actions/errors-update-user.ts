import { UpdateUserErrors } from "./types";

interface UpdateUserFields {
  username: string;
  email: string;
  phone: string;
  password: string;
}

export default function errorsUpdateUser(
  data: UpdateUserFields,
): UpdateUserErrors | null {
  const errors: UpdateUserErrors = {};

  // username — required
  if (!data.username || data.username.trim().length === 0) {
    errors.username = "Username is required";
  } else if (data.username.trim().length < 2) {
    errors.username = "Username must be at least 2 characters";
  } else if (!/^[a-zA-Zа-яА-ЯёЁіІїЇєЄ\s]+$/.test(data.username.trim())) {
    errors.username = "Username must contain only letters";
  }

  // email — required + format
  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    errors.email = "Email is not valid";
  }

  // phone — optional, but if provided must be valid
  if (data.phone && data.phone.trim().length > 0) {
    if (!/^\+\d{7,15}$/.test(data.phone.trim())) {
      errors.phone = "Phone must start with + and contain 7–15 digits";
    }
  }

  // password — optional, but if provided must meet requirements
  if (data.password && data.password.trim().length > 0) {
    if (/\s/.test(data.password)) {
      errors.password = "Password must not contain spaces";
    } else if (data.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[a-zA-Z]/.test(data.password)) {
      errors.password = "Password must contain at least one letter";
    } else if (!/\d/.test(data.password)) {
      errors.password = "Password must contain at least one number";
    } else if (/[^a-zA-Z0-9]/.test(data.password)) {
      errors.password = "Password must not contain special characters";
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
