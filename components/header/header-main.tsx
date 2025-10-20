"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  NavbarMenu,
  NavbarMenuItem,
  Link as HeroLink,
  NavbarMenuToggle,
} from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
import NavLink from "./nav-link";
import { menuItems } from "@/lib/features/links";
import { TiShoppingCart } from "react-icons/ti";
import { useAppSelector } from "@/lib/hooks";
import { isCartItemsSelector } from "@/lib/selectors/cartSelectors";

import "./header-main.scss";

export default function HeaderMain() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const isCartItems = useAppSelector(isCartItemsSelector);
  const router = useRouter();

  return (
    <header>
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
                style={{ maxWidth: "30px !important" }}
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
              <HeroLink
                href={item.href}
                className="w-full link-underline"
                color={item.label === "Sign Up" ? "primary" : "foreground"}
                size="lg"
                as={Link}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </HeroLink>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
    </header>
  );
}
