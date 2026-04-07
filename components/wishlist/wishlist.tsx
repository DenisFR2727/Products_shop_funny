"use client";

import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import PaginationList from "../products/pagination/pagination ";

import classes from "./wishlist.module.scss";

import "@/styles/globals.css";
import { useEffect, useState } from "react";


export default function WishListPage() {
  const favorites = useAppSelector(favoriteSelector);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
 
  const isEmpty = favorites.length === 0;
 
  useEffect(() => {
   setIsOpen(isEmpty); // пусто -> open, не пусто -> close
 }, [isEmpty]);

   function onClose() {
      setIsOpen(false)
   }
   
  return (
    <div className={classes.wishlist}>
     {isEmpty && isOpen && <ModalWishlist onClose={onClose} />}
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

export function ModalWishlist({ onClose }: { onClose: () => void }) {
   const router = useRouter();
   const target = document.getElementById("dialog-wishlist");
   if (!target) return null;
  
   function handleClickProducts() {
      router.push("/products");
      onClose();
   }

  return createPortal(
    <div className={classes.modal_backdrop} onClick={onClose}>
      <div
        className={classes.modal_wishlist}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>No favorite products! Please add favorite product!</h2>
        <button className={classes.modal_wishlist_button} onClick={handleClickProducts}>Go to home</button>
      </div>
    </div>,
    target,
  );
}
