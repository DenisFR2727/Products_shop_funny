"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import WishListPage from "@/components/wishlist/wishlist";
import CartProducts from "@/components/products/cart/cart";
import ProfileComponent from "@/components/profile/profile";
import DashboardUserOverview from "./dashboard-user-overview";
import styles from "./dashboard-user-page.module.scss";
import DashboardUserSidebar, { sidebarItems } from "./dashboard-user-sidebar";
import TodoList from "../todo/todo-list";

type DashboardSidebarItemId = (typeof sidebarItems)[number]["id"];

const DEFAULT_ACTIVE_ITEM: DashboardSidebarItemId = "dashboard";

const dashboardContentByItem: Record<DashboardSidebarItemId, ReactNode> = {
  dashboard: <DashboardUserOverview />,
  wishlist: <WishListPage />,
  cart: <CartProducts />,
  profile: <ProfileComponent />,
  todo: <TodoList />,
};

const getActiveItemFromSection = (
  section: string | null,
): DashboardSidebarItemId => {
  const isKnownSection = sidebarItems.some(({ id }) => id === section);

  return isKnownSection ? (section as DashboardSidebarItemId) : DEFAULT_ACTIVE_ITEM;
};

const DashboardUserPage = () => {
  const searchParams = useSearchParams();
  const section = searchParams.get("section");
  const [activeItem, setActiveItem] = useState<DashboardSidebarItemId>(() =>
    getActiveItemFromSection(section),
  );

  useEffect(() => {
    setActiveItem(getActiveItemFromSection(section));
  }, [section]);

  const contentNode = useMemo(
    () =>
      dashboardContentByItem[activeItem] ?? dashboardContentByItem.dashboard,
    [activeItem],
  );

  return (
    <div className={styles.page}>
      <DashboardUserSidebar
        activeItem={activeItem}
        onSelectItem={setActiveItem}
      />
      <div className={styles.content}>{contentNode}</div>
    </div>
  );
};

export default DashboardUserPage;
