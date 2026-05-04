"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import WishListPage from "@/components/wishlist/wishlist";
import CartProducts from "@/components/products/cart/cart";
import ProfileComponent from "@/components/profile/profile";
import DashboardUserOverview from "./dashboard-user-overview";
import styles from "./dashboard-user-page.module.scss";
import DashboardUserSidebar, { sidebarItems } from "./dashboard-user-sidebar";
import TodoList from "../todo/todo-list";

type DashboardSidebarItemId = (typeof sidebarItems)[number]["id"];

const dashboardContentByItem: Record<DashboardSidebarItemId, ReactNode> = {
  dashboard: <DashboardUserOverview />,
  wishlist: <WishListPage />,
  cart: <CartProducts />,
  profile: <ProfileComponent />,
  todo: <TodoList />,
};

const DashboardUserPage = () => {
  const [activeItem, setActiveItem] =
    useState<DashboardSidebarItemId>("dashboard");

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
