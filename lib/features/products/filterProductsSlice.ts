import { IProducts } from "@/lib/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartProduct extends IProducts {
  amount: number;
}

interface FilterProducts {
  serchProducts: string;
  selectedCategory: string;
  rangePrice: number | null;
  selectAlphabet: "alphabet" | null;
  selectPriceMinOrMax: "min" | "max" | null;
}

const initialState: FilterProducts = {
  serchProducts: "",
  selectedCategory: "",
  rangePrice: null,
  selectAlphabet: null,
  selectPriceMinOrMax: null,
};
const filterProductsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setSearchProducts(state, action: PayloadAction<string>) {
      state.serchProducts = action.payload;
    },
    resetAllValueFilter(state) {
      state.serchProducts = "";
      state.selectedCategory = "All";
      state.rangePrice = null;
      state.selectAlphabet = null;
      state.selectPriceMinOrMax = null;
    },
    setRangePrice(state, action: PayloadAction<number>) {
      state.rangePrice = action.payload;
    },
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSelectAlphabet(state, action: PayloadAction<"alphabet" | null>) {
      state.selectAlphabet = action.payload;
    },
    setSelectPriceSorter(state, action: PayloadAction<"min" | "max" | null>) {
      state.selectPriceMinOrMax = action.payload;
    },
  },
});
export const {
  setSearchProducts,
  resetAllValueFilter,
  setRangePrice,
  setSelectedCategory,
  setSelectAlphabet,
  setSelectPriceSorter,
} = filterProductsSlice.actions;
export default filterProductsSlice.reducer;
