import { IProducts } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartProduct extends IProducts {
  amount: number;
}

interface CartState {
  cart: CartProduct[];
  subtotal: number;
  discountedSubtotal: number;
  totalPrice: number;
  discountedTotalPrice: number;
  shipping: number;
  shippingPriceTotal: number;
  togglePanel: boolean;
  showProgressModal: boolean;
}

const initialState: CartState = {
  cart: [],
  subtotal: 0,
  discountedSubtotal: 0,
  totalPrice: 0,
  discountedTotalPrice: 0,
  shipping: 10,
  shippingPriceTotal: 0,
  togglePanel: false,
  showProgressModal: false,
};
const calculateTotals = (state: CartState): void => {
  state.subtotal = state.cart.reduce(
    (acc, item) => acc + item.price * item.amount,
    0,
  );

  state.discountedSubtotal = state.cart.reduce((acc, item) => {
    const discountedPrice =
      item.price * (1 - item.discountPercentage / 100) * item.amount;
    return acc + discountedPrice;
  }, 0);

  const shipping = state.cart.length > 0 ? state.shipping : 0;

  state.totalPrice = state.subtotal + shipping;
  state.discountedTotalPrice = state.discountedSubtotal + shipping;
};
const cartSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProductToCart(state, action: PayloadAction<IProducts>) {
      const isAddProduct = state.cart.find(
        (product) => product.id === action.payload.id,
      );
      if (!isAddProduct) {
        state.cart.push({ ...action.payload, amount: 1 });
        calculateTotals(state);
      }
    },
    amountToPriceProduct(
      state,
      action: PayloadAction<{ id: number; amount: number }>,
    ) {
      const existingProduct = state.cart.find(
        (product) => product.id === action.payload.id,
      );
      if (existingProduct) {
        existingProduct.amount = action.payload.amount;
      }
      calculateTotals(state);
    },
    removeOrder(state, action: PayloadAction<number>) {
      state.cart = state.cart.filter(
        (product) => product.id !== action.payload,
      );
      calculateTotals(state);
    },
    togglePanel(state, action: PayloadAction<boolean>) {
      state.togglePanel = action.payload;
    },
    setShowProgress(state, action: PayloadAction<boolean>) {
      state.showProgressModal = action.payload;
    },
    clearCart(state, action: PayloadAction) {
      state.cart = [];
    },
  },
});
export const {
  addProductToCart,
  amountToPriceProduct,
  removeOrder,
  togglePanel,
  setShowProgress,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
