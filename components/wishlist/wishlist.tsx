"use client";

import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import PaginationList from "../products/pagination/pagination ";
import { useTranslation } from "react-i18next";

import classes from "./wishlist.module.scss";

export default function WishListPage() {
  const favorites = useAppSelector(favoriteSelector);
  const { t } = useTranslation();
  const isEmpty = favorites.length === 0;

  return (
    <div className={classes.wishlist}>
   
    <div className={classes.wishlist_content}>
    <h1 className={classes.wishlist_title}>
        {t(isEmpty ? "No favorite products" : "Favorite products")}
      </h1>
      <span className={classes.wishlist_line}></span>
      {!isEmpty && <PaginationList products={favorites} />}
    </div>
    </div>
  );
}
