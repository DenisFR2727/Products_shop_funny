"use client";
import { IProducts } from "@/lib/types";
import { MdFavoriteBorder } from "react-icons/md";
import { MdFavorite } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { toggleFavoriteProduct } from "@/lib/features/products/cartSlice";

import classes from "./wishlist.module.scss";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";

type FavoriteButtonProps = {
  product: IProducts;
};

export default function FavoriteButton({ product }: FavoriteButtonProps) {
  const dispatch = useAppDispatch();
  const favorite = useAppSelector(favoriteSelector);
  const isFavoriteProduct = favorite.some((item) => item?.id === product.id);

  function handleFavorite() {
    dispatch(toggleFavoriteProduct(product));
  }

  return (
    <button
      type="button"
      className={classes.favorite_btn}
      onClick={handleFavorite}
    >
      {isFavoriteProduct ? <MdFavorite /> : <MdFavoriteBorder />}
    </button>
  );
}
