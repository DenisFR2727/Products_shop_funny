"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FC } from "react";
import {  MouseEvent } from "react";
import { t } from "i18next";

import PaginationList from "../products/pagination/pagination ";

import classes from "./wishlist.module.scss";

import "@/styles/globals.css";


const WishListPage: FC = () => {
  const favorites = useAppSelector(favoriteSelector);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();

  const isEmpty: boolean = favorites.length === 0;

  useEffect(() => {
    setIsOpen(isEmpty);
  }, [isEmpty]);

  function onClose(): void {
    setIsOpen(false);
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
};

export default WishListPage;



interface ModalWishlistProps {
  onClose: () => void;
}

export const ModalWishlist: FC<ModalWishlistProps> = ({ onClose }) => {
  const router = useRouter();
  const target = document.getElementById("dialog-wishlist");
  if (!target) return null;

  function handleClickProducts(): void {
    router.push("/products");
    onClose();
  }

  function handleModalClick(e: MouseEvent<HTMLDivElement>): void {
    e.stopPropagation();
  }

  return createPortal(
    <div className={classes.modal_backdrop} onClick={onClose}>
      <div
        className={classes.modal_wishlist}
        onClick={handleModalClick}
      >
        <h2>{t("No favorite products! Please add favorite product!")}</h2>
        <button
          className={classes.modal_wishlist_button}
          onClick={handleClickProducts}
        >
          {t("Go to home")}
        </button>
      </div>
    </div>,
    target
  );
};
