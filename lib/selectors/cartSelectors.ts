import { RootState } from "@/lib/store";

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
