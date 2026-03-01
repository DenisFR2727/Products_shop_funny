"use client";
import { menuItems } from "@/lib/features/links";
import { Link } from "@heroui/react";
import { NavbarMenuItem } from "@heroui/react";
import { NavbarMenu } from "@heroui/react";
import { useRouter } from "next/navigation";


import { signOut, useSession } from "next-auth/react";
import { Button } from "@heroui/react";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
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

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isMenuOpen, setIsMenuOpen]);

  if (!isMenuOpen) return null;

  const menuContent = (
    <div
      className="navbar-backdrop"
      onClick={() => setIsMenuOpen(false)}
      role="presentation"
    >
      <NavbarMenu
        className="z-30 menuOpen"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        >
          <LanguageSelect />
        </NavbarMenuItem>
      </NavbarMenu>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(menuContent, document.body)
    : null;
});
export default NavBarMobile;
