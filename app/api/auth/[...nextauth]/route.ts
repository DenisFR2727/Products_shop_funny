import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getEmailUser } from "@/lib/api/auth";
import { verifyPassword } from "@/components/auth/util/verify-password";

// Винесена функція для авторизації (використовується в server action)
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

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        return authorizeUser(credentials.email, credentials.password);
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
