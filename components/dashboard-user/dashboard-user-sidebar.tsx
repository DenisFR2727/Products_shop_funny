import { HiOutlineHome } from "react-icons/hi2";
import { LuHeart, LuList, LuShoppingCart, LuUserRound } from "react-icons/lu";

import styles from "./dashboard-user-sidebar.module.scss";

export const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: HiOutlineHome },
  { id: "wishlist", label: "Wishlist", icon: LuHeart },
  { id: "cart", label: "Cart", icon: LuShoppingCart },
  { id: "profile", label: "Profile", icon: LuUserRound },
  { id: "todo", label: "Todo", icon: LuList },
] as const;

type DashboardSidebarItemId = (typeof sidebarItems)[number]["id"];

type DashboardUserSidebarProps = {
  activeItem: DashboardSidebarItemId;
  onSelectItem: (itemId: DashboardSidebarItemId) => void;
};

const DashboardUserSidebar = ({
  activeItem,
  onSelectItem,
}: DashboardUserSidebarProps) => {
  return (
    <aside className={styles.sidebar} aria-label="Dashboard sidebar">
      <ul className={styles.menu}>
        {sidebarItems.map(({ id, label, icon: Icon }) => (
          <li key={id}>
            <button
              type="button"
              className={`${styles.item} ${
                activeItem === id ? styles.itemActive : ""
              }`}
              aria-current={activeItem === id ? "page" : undefined}
              onClick={() => onSelectItem(id)}
            >
              <Icon className={styles.icon} aria-hidden />
              <span>{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default DashboardUserSidebar;
