import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const auth = await cookies();
  auth.get("auth");

  if (!auth) {
    redirect("/login");
  }

  return <h1>Welcome, you are logged in ✅</h1>;
}
