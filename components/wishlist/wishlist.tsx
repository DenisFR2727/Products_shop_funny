"use client";

import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import PaginationList from "../products/pagination/pagination ";

import classes from "./wishlist.module.scss";

export default function WishListPage() {
  const favorites = useAppSelector(favoriteSelector);

  return (
    <div className={classes.wishlist}>
      <h1 className={classes.wishlist_title}>Favorite products</h1>
      <span className={classes.wishlist_line}></span>
      <PaginationList products={favorites} />
    </div>
  );
}
