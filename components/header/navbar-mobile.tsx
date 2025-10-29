"use client";
import { menuItems } from "@/lib/features/links";
import { Link } from "@heroui/react";
import { NavbarMenuItem } from "@heroui/react";
import { NavbarMenu } from "@heroui/react";
import { useRouter } from "next/navigation";

import "./header-main.scss";

interface NavBarMobileProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

export default function NavBarMobile({
  isMenuOpen,
  setIsMenuOpen,
}: NavBarMobileProps) {
  const router = useRouter();

  return (
    <div className="navbar-backdrop" onClick={() => setIsMenuOpen(false)}>
      <NavbarMenu
        className={`z-30 ${isMenuOpen ? "menuOpen" : "menuClose"}`}
        onClick={router.refresh}
      >
        {menuItems.map((item, index) => (
          <NavbarMenuItem
            key={index}
            onClick={() => {
              setIsMenuOpen(false);
              router.push(item.href);
            }}
          >
            <Link
              href={item.href}
              className="w-full link-underline"
              color={item.label === "Sign Up" ? "primary" : "foreground"}
              size="lg"
              as={Link}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </div>
  );
}
