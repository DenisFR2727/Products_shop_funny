"use server";
import DashboardUserPage from "@/components/dashboard-user/dashboard-user-page";
import { authOptions } from "@/lib/auth/nextauth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const DashboardUserRoutePage = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }
  return <DashboardUserPage />;
};

export default DashboardUserRoutePage;
