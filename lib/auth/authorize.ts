import { getEmailUser } from "@/lib/api/auth";
import { verifyPassword } from "@/components/auth/util/verify-password";

// Функція для авторизації користувача (використовується в server action та NextAuth)
export async function authorizeUser(email: string, password: string) {
  if (!email || !password) {
    return null;
  }

  try {
    const users = await getEmailUser(email);

    if (!users || users.length === 0) {
      return null;
    }

    const user = users[0];

    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return null;
    }

    return {
      id: user.id || user.userId,
      email: user.email,
      name: user.username,
    };
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
