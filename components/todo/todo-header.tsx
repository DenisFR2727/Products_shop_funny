import Image from "next/image";
import Link from "next/link";

import styles from "./todo-header.module.scss";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard-user" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Cart", href: "/cart" },
  { label: "Profile", href: "/profile" },
  { label: "Todo", href: "/dashboard-user?section=todo" },
];

export default function TodoHeader() {
  return (
    <header className={styles.header}>
      <Link className={styles.logoLink} href="/" aria-label="Funny Shop home">
        <Image
          className={styles.logoImage}
          src="/favicon.png"
          alt="logo funny shop!"
          width={30}
          height={30}
          priority
        />
      </Link>
      <nav className={styles.navigation} aria-label="Main navigation">
        {NAV_ITEMS.map(({ label, href }) => (
          <Link key={label} className={styles.navLink} href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
