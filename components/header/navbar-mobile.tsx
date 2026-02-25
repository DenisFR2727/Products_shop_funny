"use client";
import { menuItems } from "@/lib/features/links";
import { Link } from "@heroui/react";
import { NavbarMenuItem } from "@heroui/react";
import { NavbarMenu } from "@heroui/react";
import { useRouter } from "next/navigation";

import "./header-main.scss";
import { signOut, useSession } from "next-auth/react";
import { Button } from "@heroui/react";
import React from "react";
import LanguageSelect from "../language-select/language-select";

import "./header-main.scss";

interface NavBarMobileProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
}

const NavBarMobile = React.memo(function NavBarMobile({
  isMenuOpen,
  setIsMenuOpen,
}: NavBarMobileProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const closeAndGo = (href: string) => {
    setIsMenuOpen(false);
    router.push(href);
  };

  return (
    <div className="navbar-backdrop" onClick={() => setIsMenuOpen(false)}>
      <NavbarMenu
        className={`z-30 ${isMenuOpen ? "menuOpen" : "menuClose"}`}
        onClick={router.refresh}
      >
        {/* NAV LINKS */}
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              href={item.href}
              className="w-full link-underline"
              color={item.label === "Sign Up" ? "primary" : "foreground"}
              size="lg"
              onClick={() => closeAndGo(item.href)}
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}

        {/* AUTH BLOCK */}
        <NavbarMenuItem className="mt-4">
          {status === "authenticated" ? (
            <div className="mobile-user">
              <span className="mobile-user-name">
                {session.user?.name || session.user?.email}
              </span>

              <Button
                color="danger"
                variant="flat"
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className="mobile-auth-buttons">
              <Link
                color="primary"
                variant="flat"
                onClick={() => closeAndGo("/login")}
              >
                Login
              </Link>

              <Link color="primary" onClick={() => closeAndGo("/signup")}>
                Sign Up
              </Link>
            </div>
          )}
        </NavbarMenuItem>
        <NavbarMenuItem
          className="mobile_language"
          onClick={(e: any) => {
            e.stopPropagation();
          }}
        >
          <LanguageSelect />
        </NavbarMenuItem>
      </NavbarMenu>
    </div>
  );
});
export default NavBarMobile;
