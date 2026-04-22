"use client";
import { useContext, useState } from "react";
import dynamic from "next/dynamic";
import { Suspense } from "react";
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
import { FaUser } from "react-icons/fa";
import { useAppSelector } from "@/lib/hooks";
import { isCartItemsSelector } from "@/lib/selectors/cartSelectors";
import { ThemeContext } from "@/context/themeContext";
import { signOut, useSession } from "next-auth/react";
import { useTranslation } from "react-i18next";

const NavBarMobile = dynamic(() => import("./navbar-mobile"), { ssr: false });

import dark from "../../public/theme/themes-black.png";
import light from "../../public/theme/themes-light.png";

import LanguageSelect from "../language-select/language-select";
import { normalizeAvatarSrc } from "@/components/profile/resolve-avatar-src";

import "./header-main.scss";

interface ImageLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

function imageLoader(config: ImageLoaderProps) {
  const urlStart = config.src.split("upload/")[0];
  const urlEnd = config.src.split("upload/")[1];
  const trasformations = `w_30,h_30,q_${config.quality}`;

  return `${urlStart}upload/${trasformations}/${urlEnd}`;
}

export default function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { data: session, status } = useSession();
  const isCartItems = useAppSelector(isCartItemsSelector);
  const isFavorite = useAppSelector((state) => state.cartReducer.favorite);
  const { t } = useTranslation();
  const headerAvatarSrc =
    status === "authenticated"
      ? normalizeAvatarSrc(session?.user?.image)
      : null;

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
          {session?.user && (
            <NavbarItem className="nav_header">
              <NavLink href="/reviews">{t("Reviews")}</NavLink>
            </NavbarItem>
          )}
          {session?.user && (
            <NavbarItem className="nav_header">
              <NavLink href="/dashboard-user">{t("Dashboard")}</NavLink>
            </NavbarItem>
          )}
          <NavbarItem className="nav_header nav_header-wishlist">
            <NavLink href="/wishlist">
              {t("Wishlist")}
              {isFavorite.length === 0 ? (
                ""
              ) : (
                <span className="is_favorite">{isFavorite.length}</span>
              )}
            </NavLink>
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
          <NavbarItem className="theme-toggle-nav">
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
                <div className="user-avatar">
                  <Link href="/profile" className="user-avatar-link">
                    {headerAvatarSrc ? (
                      <Image
                        className="user-avatar-img"
                        src={headerAvatarSrc}
                        loader={imageLoader}
                        width={30}
                        height={30}
                        alt={session?.user.name || ""}
                        sizes="30px"
                        quality={30}
                      />
                    ) : (
                      <span className="user-avatar-fallback" aria-hidden>
                        <FaUser />
                      </span>
                    )}
                    <span className="user-name">
                      {(session.user?.name || session.user?.email)?.slice(0, 3)}
                    </span>
                  </Link>
                </div>

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
        <Suspense fallback={null}>
          <NavBarMobile isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
        </Suspense>
      </Navbar>
    </header>
  );
}
