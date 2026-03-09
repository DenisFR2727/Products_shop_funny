import { RootState } from "@/lib/store";

export const serchProductsSelector = (state: RootState) =>
  state.filterReducer.serchProducts;

export const selectedCategorySelector = (state: RootState) =>
  state.filterReducer.selectedCategory;

export const selectedRangeSelector = (state: RootState) =>
  state.filterReducer.rangePrice;

export const selectAlphabetSelector = (state: RootState) =>
  state.filterReducer.selectAlphabet;

export const priceSortSelector = (state: RootState) =>
  state.filterReducer.selectPriceMinOrMax;
