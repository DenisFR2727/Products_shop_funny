import { UserFields } from "./types";

export default function errorsLoginForm(data: UserFields) {
  let errors = {
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPass: "",
  };

  if (!data.username || data.username.trim().length === 0) {
    errors.username = "Username is required";
  } else if (!/[a-zA-Zа-яА-Я]+$/g.test(data.username.trim())) {
    errors.username = "Username must only words!";
  }
  //   pass
  if (!data.password || data.password.trim().length === 0) {
    errors.password = "Password is required";
  } else if (/\s/.test(data.password)) {
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

  if (data.password !== data.confirmPass)
    errors.confirmPass = "Passwords do not match";

  if (!data.email || data.email.trim().length === 0) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/g.test(data.email.trim())) {
    errors.email = "Email not valid!";
  }

  if (!data.phone || data.phone.trim().length === 0) {
    errors.phone = "Phone is required";
  } else if (!/^\+\d{7,15}$/.test(data.phone.trim())) {
    errors.phone = "Phone not valid!";
  }

  const hasErrors = Object.values(errors).some((err) => err !== "");

  return hasErrors ? errors : null;
}
