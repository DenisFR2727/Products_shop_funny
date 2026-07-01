import { Metadata } from "next";
import { getServerSession } from "next-auth";

import ProfileComponent from "@/components/profile/profile";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getEmailUser } from "@/lib/api/auth";
import { SavedValues } from "@/components/profile/types";

export const metadata: Metadata = {
  title: "Profile | Funny Shop",
  description: "Manage your Funny Shop profile settings",
};

async function loadInitialValues(
  email: string | null | undefined,
): Promise<SavedValues | null> {
  if (!email) return null;

  try {
    const users = await getEmailUser(email);
    const user = users[0];
    if (!user) return null;

    return {
      username: user.username ?? "",
      email: user.email ?? "",
      phone: user.phone ?? "",
      image: user.image || user.avatar || user.logo || undefined,
    };
  } catch (error) {
    console.error("Failed to load profile data:", error);
    return null;
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const initialValues = await loadInitialValues(session?.user?.email);

  return <ProfileComponent initialValues={initialValues} />;
}
