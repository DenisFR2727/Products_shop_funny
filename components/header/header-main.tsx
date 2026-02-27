"use client";
import { useContext, useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenuToggle,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";
import { TiShoppingCart } from "react-icons/ti";
import { useAppSelector } from "@/lib/hooks";
import { isCartItemsSelector } from "@/lib/selectors/cartSelectors";
import { ThemeContext } from "@/context/themeContext";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";
import NavBarMobile from "./navbar-mobile";

import dark from "../../public/theme/themes-black.png";
import light from "../../public/theme/themes-light.png";

import LanguageSelect from "../language-select/language-select";

import "./header-main.scss";

export default function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { data: session, status } = useSession();
  const isCartItems = useAppSelector(isCartItemsSelector);
  const { t } = useTranslation();

  return (
    <header className={`${theme}`}>
      <Navbar
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
        isBordered
      >
        <NavbarContent className="sm:hidden" justify="start">
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>
        <NavbarContent
          className="sm:hidden justify-center pr-3"
          justify="center"
        >
          <NavbarBrand>
            <Link
              href="/"
              className="font-bold text-inherit"
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="logo-nav">Funny Shop</span>
            </Link>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="hidden sm:flex gap-4 " justify="start">
          <NavbarBrand>
            <Link href="/" className="font-bold text-inherit">
              <Image
                className="logo_funny-shop"
                src="/favicon.png"
                alt="logo funny shop!"
                width={30}
                height={30}
                priority
              />
            </Link>
          </NavbarBrand>
          <NavbarItem className="lg:flex nav_header">
            <NavLink href="/">{t("home")}</NavLink>
          </NavbarItem>
          <NavbarItem className="nav_header">
            <NavLink href="/products">{t("products")}</NavLink>
          </NavbarItem>
          <NavbarItem className="nav_header">
            <NavLink href="/unsplash">{t("Unsplash")}</NavLink>
          </NavbarItem>
          <NavbarItem className="nav_header">
            <NavLink href="/cart">{t("cart")}</NavLink>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            <Link href={`/cart`}>
              <div className="header-cart">
                <TiShoppingCart className="nav-cart-icon" />
                {isCartItems.length ? (
                  <div className="nav-cart-count">
                    <span>{isCartItems.length}</span>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Link>
          </NavbarItem>
          <NavbarItem>
            <LanguageSelect />
          </NavbarItem>
          <NavbarItem className="lg:flex">
            <span className="header_login-nav" onClick={toggleTheme}>
              {theme === "light_theme" ? (
                <Image
                  style={{ maxWidth: "30px" }}
                  src={light}
                  alt="theme-light"
                  width={30}
                  height={30}
                />
              ) : (
                <Image
                  style={{ maxWidth: "30px" }}
                  src={dark}
                  alt="theme-black"
                  width={30}
                  height={30}
                />
              )}
            </span>
          </NavbarItem>
          <NavbarItem className="lg:flex login-nav">
            {status === "authenticated" ? (
              <div className="user-nav">
                <span className="user-name">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  className="logout-btn"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login">
                <span className="header_login-nav">{t("Login")}</span>
              </Link>
            )}
          </NavbarItem>

          {status !== "authenticated" && (
            <NavbarItem className="signup_nav">
              <Button as={Link} href="/signup" color="primary" variant="flat">
                {t("signup")}
              </Button>
            </NavbarItem>
          )}
        </NavbarContent>
        {/* Mobile menu */}
        <NavBarMobile isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </Navbar>
    </header>
  );
}
