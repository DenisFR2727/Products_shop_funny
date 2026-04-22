import type { ReactNode } from "react";

type DashboardUserLayoutProps = {
  children: ReactNode;
};

const DashboardUserLayout = ({ children }: DashboardUserLayoutProps) => {
  return <>{children}</>;
};

export default DashboardUserLayout;
