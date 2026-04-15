"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { favoriteSelector } from "@/lib/selectors/cartSelectors";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
      <AnimatePresence>
        {isEmpty && isOpen && <ModalWishlist onClose={onClose} />}
      </AnimatePresence>
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
  const { target, dialogRef, handleModalClick } = useModalBehavior({
    targetId: "dialog-wishlist",
    onClose,
  });
  const router = useRouter();

  function handleNavigateToProducts(): void {
    router.push("/products");
    onClose();
  }

  if (!target) return null;

  return createPortal(
    <motion.div
      className={classes.modal_backdrop}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div
        ref={dialogRef}
        className={classes.modal_wishlist}
        onClick={handleModalClick}
        role="dialog"
        aria-modal="true"
        tabIndex={-1}
        initial={{ opacity: 0, y: -24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.96 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <h2>{t("No favorite products! Please add favorite product!")}</h2>
        <button
          className={classes.modal_wishlist_button}
          onClick={handleNavigateToProducts}
        >
          {t("Go to home")}
        </button>
      </motion.div>
    </motion.div>,
    target,
  );
};
