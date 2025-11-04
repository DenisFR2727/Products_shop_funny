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
import NavBarMobile from "./navbar-mobile";

import dark from "../../public/theme/themes-black.png";
import light from "../../public/theme/themes-light.png";
import "./header-main.scss";

export default function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const { theme, toggleTheme } = useContext(ThemeContext);

  const isCartItems = useAppSelector(isCartItemsSelector);

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
        <NavbarContent className="hidden sm:flex gap-4" justify="start">
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
          <NavbarItem className="lg:flex ">
            <NavLink href="/">Home</NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink href="/products">Products</NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink href="/unsplash">Unsplash</NavLink>
          </NavbarItem>
          <NavbarItem>
            <NavLink href="/cart">Cart</NavLink>
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
            <Link href="#">
              <span className="header_login-nav">Login</span>
            </Link>
          </NavbarItem>
          <NavbarItem className="sign-up-nav">
            <Button
              as={Link}
              color="primary"
              href="#"
              variant="flat"
              onPaste={() => setIsMenuOpen(false)}
            >
              Sign Up
            </Button>
          </NavbarItem>
        </NavbarContent>
        {/* Mobile menu */}
        <NavBarMobile isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      </Navbar>
    </header>
  );
}
