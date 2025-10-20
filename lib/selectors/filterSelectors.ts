import { RootState } from "@/lib/store";

export const serchProductsSelector = (state: RootState) =>
  state.filterReducer.serchProducts;

export const selectedCategorySelector = (state: RootState) =>
  state.filterReducer.selectedCategory;

export const selectedRangeSelector = (state: RootState) =>
  state.filterReducer.rangePrice;
