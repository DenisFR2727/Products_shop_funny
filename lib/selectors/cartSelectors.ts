import { RootState } from "@/lib/store";
import { createSelector } from "@reduxjs/toolkit";

export const selectOrders = (state: RootState) => state.cartReducer.cart;
export const selectShipping = (state: RootState) => state.cartReducer.shipping;
export const selectDiscountedTotalPrice = (state: RootState) =>
  state.cartReducer.discountedTotalPrice;
export const selectDiscountedSubtotal = (state: RootState) =>
  state.cartReducer.discountedSubtotal;
export const selectSubtotal = (state: RootState) => state.cartReducer.subtotal;

export const isToggleSelector = (state: RootState) =>
  state.cartReducer.togglePanel;

export const isCartItemsSelector = (state: RootState) => state.cartReducer.cart;

const cartState = (state: RootState) => state.cartReducer;
export const isShowProgressSelector = createSelector(
  [cartState],
  (cart) => cart.showProgressModal
);
