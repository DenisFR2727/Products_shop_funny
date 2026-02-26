import { IProducts } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartProduct extends IProducts {
  amount: number;
}

interface FilterProducts {
  serchProducts: string;
  selectedCategory: string;
  rangePrice: number | null;
  selectAlphabet: boolean;
}

const initialState: FilterProducts = {
  serchProducts: "",
  selectedCategory: "",
  rangePrice: null,
  selectAlphabet: false,
};
const filterProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchProducts(state, action: PayloadAction<string>) {
      state.serchProducts = action.payload;
    },
    resetAllValueFilter(state, action: PayloadAction<string>) {
      state.serchProducts = action.payload;
      state.selectedCategory = action.payload;
      state.rangePrice = null;
    },
    setRangePrice(state, action: PayloadAction<number>) {
      state.rangePrice = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSelectAlphabet(state, action: PayloadAction<boolean>) {
      state.selectAlphabet = action.payload;
    },
  },
});
export const {
  setSearchProducts,
  resetAllValueFilter,
  setRangePrice,
  setSelectedCategory,
  setSelectAlphabet,
} = filterProductsSlice.actions;
export default filterProductsSlice.reducer;
