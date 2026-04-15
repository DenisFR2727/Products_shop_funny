"use client";

import { useCallback, useEffect,  useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FC, } from "react";
import PaginationList from "../products/pagination/pagination ";
import useModalBehavior from "./hooks/useModalBehavior";

import classes from "./wishlist.module.scss";

interface ModalWishlistProps {
  onClose: () => void;
}

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

export const ModalWishlist: FC<ModalWishlistProps> = ({ onClose }) => {
  const { t } = useTranslation();
  const {target, dialogRef, handleModalClick } = useModalBehavior({ targetId: "dialog-wishlist",
   onClose,});
   const router = useRouter();


  const handleNavigateToProducts = useCallback((): void => {
    router.push("/products");
    onClose();
  }, [onClose, router]);

  if (!target) return null;


  return createPortal(
    <div className={classes.modal_backdrop} onClick={onClose}>
      <div
        ref={dialogRef}
        className={classes.modal_wishlist}
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
      >
        <h2>{t("No favorite products! Please add favorite product!")}</h2>
        <button
          className={classes.modal_wishlist_button}
          onClick={handleNavigateToProducts}
        >
          {t("Go to home")}
        </button>
      </div>
    </div>,
    target,
  );
};
