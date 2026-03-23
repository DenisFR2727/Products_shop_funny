import { Metadata } from "next";

// export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "profile user funny page",
  description: "Changes user profile funny page",
};

export default async function ProfilePage() {
  return <>Prifile changes</>;
}
