"use server";

import { authorizeUser } from "@/app/api/auth/[...nextauth]/route";
import { getEmailUser } from "@/lib/api/auth";

export interface LoginState {
  success?: boolean;
  errors?: {
    email?: string;
    password?: string;
  };
}

export default async function isLogin(
  _prevState: any,
  formData: FormData
): Promise<LoginState | null> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");

  // Валідація email
  if (!email || !email.includes("@")) {
    return { errors: { email: "Please enter a valid email address!" } };
  }

  // Валідація password
  if (!password || password.trim().length < 6) {
    return {
      errors: {
        password: "The correct number of digits in the password is required!",
      },
    };
  }

  try {
    // Перевірка чи користувач існує (для більш детального повідомлення про помилку)
    const users = await getEmailUser(email);
    if (!users || users.length === 0) {
      return { errors: { email: "User does not exist" } };
    }

    // Використання NextAuth authorize для перевірки credentials
    const authUser = await authorizeUser(email, password);

    if (!authUser) {
      // Якщо користувач існує, але authorizeUser повернув null - невірний пароль
      return { errors: { password: "Incorrect password" } };
    }

    // Якщо все ОК, повертаємо success
    // NextAuth signIn буде викликано на клієнті
    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { errors: { email: "An error occurred. Please try again." } };
  }
}
