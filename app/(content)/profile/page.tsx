import { Metadata } from "next";
import ProfileComponent from "@/components/profile/profile";

export const metadata: Metadata = {
  title: "Profile | Funny Shop",
  description: "Manage your Funny Shop profile settings",
};

export default function ProfilePage() {
  return <ProfileComponent />;
}
