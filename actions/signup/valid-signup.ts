import type { SignUpData } from "@/actions/types";
import type { SignUpFieldErrors } from "./signup-errors";

export type SignUpValidation =
  | { ok: false; errors: SignUpFieldErrors }
  | { ok: true; data: SignUpData };

function readField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value : "";
}

export function extractSignUpData(formData: FormData): SignUpData {
  return {
    username: readField(formData, "username"),
    email: readField(formData, "email"),
    phone: readField(formData, "phone"),
    password: readField(formData, "password"),
    confirmPass: readField(formData, "confirmPass"),
  };
}

function validateUsername(username: string): string | undefined {
  if (!username) {
    return "Username is required";
  }
  if (!/^[\p{L} ]+$/u.test(username)) {
    return "Username must contain letters only";
  }
  return undefined;
}

function validatePassword(password: string): string | undefined {
  if (!password || password.trim().length === 0) {
    return "Password is required";
  }
  if (/\s/.test(password)) {
    return "Password must not contain spaces";
  }
  if (password.length < 8) {
    return "Password must be at least 8 characters";
  }
  if (!/[a-zA-Z]/.test(password)) {
    return "Password must contain at least one letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  if (/[^a-zA-Z0-9]/.test(password)) {
    return "Password must not contain special characters";
  }
  return undefined;
}

function validateEmail(email: string): string | undefined {
  if (!email) {
    return "Email is required";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Email not valid!";
  }
  return undefined;
}

function validatePhone(phone: string): string | undefined {
  if (!phone) {
    return "Phone is required";
  }
  if (!/^\+\d{7,15}$/.test(phone)) {
    return "Phone not valid!";
  }
  return undefined;
}

export function validateSignUpForm(rawData: SignUpData): SignUpValidation {
  const data: SignUpData = {
    username: rawData.username.trim(),
    email: rawData.email.trim(),
    phone: rawData.phone.trim(),
    password: rawData.password,
    confirmPass: rawData.confirmPass,
  };

  const errors: SignUpFieldErrors = {};

  const username = validateUsername(data.username);
  if (username) errors.username = username;

  const password = validatePassword(data.password);
  if (password) errors.password = password;

  if (data.password !== data.confirmPass) {
    errors.confirmPass = "Passwords do not match";
  }

  const email = validateEmail(data.email);
  if (email) errors.email = email;

  const phone = validatePhone(data.phone);
  if (phone) errors.phone = phone;

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  return { ok: true, data };
}
