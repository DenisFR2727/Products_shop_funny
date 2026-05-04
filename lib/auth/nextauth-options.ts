import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getEmailUser } from "@/lib/api/auth";
import { verifyPassword } from "@/components/auth/util/verify-password";

function profileImageFromUser(user: Record<string, unknown>) {
  const raw = user.image ?? user.avatar ?? user.logo;
  return typeof raw === "string" && raw.length > 0 ? raw : undefined;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const users = await getEmailUser(credentials.email);

          if (!users || users.length === 0) {
            return null;
          }

          const user = users[0];

          const isValid = await verifyPassword(
            credentials.password,
            user.password,
          );

          if (!isValid) {
            return null;
          }

          const u = user as Record<string, unknown>;

          return {
            id: user.id || user.userId,
            email: user.email,
            name: user.username,
            image: profileImageFromUser(u),
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        const img =
          typeof user.image === "string" && user.image.trim().length > 0
            ? user.image.trim()
            : null;
        token.picture = img;
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name;
        if (session.email) token.email = session.email;
        if (session.image !== undefined) {
          const next =
            typeof session.image === "string" && session.image.trim().length > 0
              ? session.image.trim()
              : null;
          token.picture = next;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      if (session.user) {
        const pic = token.picture;
        session.user.image =
          typeof pic === "string" && pic.length > 0 ? pic : null;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key-change-in-production",
};
