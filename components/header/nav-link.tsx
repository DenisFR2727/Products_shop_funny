"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavLinkProps } from "./type";
import classes from "./nav-link.module.scss";

export default function NavLink({ href, children }: NavLinkProps) {
  const pathName = usePathname();
  const isActive = href === "/" ? pathName === href : pathName.startsWith(href);

  return (
    <Link
      className={isActive ? `${classes.link} ${classes.active}` : classes.link}
      href={href}
    >
      {children}
    </Link>
  );
}
