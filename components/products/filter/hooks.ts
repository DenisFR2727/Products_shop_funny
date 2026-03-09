"use client";
import {
  resetAllValueFilter,
  setRangePrice,
  setSearchProducts,
  setSelectAlphabet,
  setSelectedCategory,
  setSelectPriceSorter,
} from "@/lib/features/products/filterProductsSlice";
import {
  selectedCategorySelector,
  selectedRangeSelector,
  serchProductsSelector,
} from "@/lib/selectors/filterSelectors";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useMemo, useState } from "react";
import { IProducts } from "@/lib/types";

export function useFilterProducts(products: IProducts[]) {
  const serchProducts = useAppSelector(serchProductsSelector);
  const selectedCategory = useAppSelector(selectedCategorySelector);
  const selectedRange = useAppSelector(selectedRangeSelector);
  const selectedAlphabet = useAppSelector(
    (state) => state.filterReducer.selectAlphabet,
  );
  const minMaxPriceSelect = useAppSelector(
    (state) => state.filterReducer.selectPriceMinOrMax,
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (serchProducts) {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(serchProducts.toLowerCase()),
      );
    }
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (selectedRange) {
      result = result.filter((p) => p.price <= selectedRange);
    }
    result.sort((a, b) => {
      if (minMaxPriceSelect === "min") return a.price - b.price;
      if (minMaxPriceSelect === "max") return b.price - a.price;

      if (selectedAlphabet === "alphabet") {
        const titleCompare = a.title.localeCompare(b.title);
        if (titleCompare !== 0) return titleCompare;
      }

      return 0;
    });

    return result;
  }, [
    products,
    serchProducts,
    selectedRange,
    selectedCategory,
    selectedAlphabet,
    minMaxPriceSelect,
  ]);

  return { filteredProducts };
}

export function useFilterForm() {
  const dispatch = useAppDispatch();
  const [searchTitle, setSearchTitle] = useState<string>("");
  const [selectedCategoryCurrent, setSelectedCategoriesCurrent] =
    useState<string>("All");
  const [defaultRange, setDefaultRange] = useState<number>(3000);

  const changeSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let searchText = e.target.value;
    if (/[^a-zA-Zа-яА-ЯґҐєЄіІїЇ]/g.test(searchText)) {
      return;
    }
    setSearchTitle(e.target.value);
  };

  const submitSearch = (): void => {
    dispatch(setSearchProducts(searchTitle));
    dispatch(setSelectedCategory(selectedCategoryCurrent));
    dispatch(setRangePrice(defaultRange));
  };
  const resetValuesForm = (): void => {
    setSearchTitle("");
    setSelectedCategoriesCurrent("All");
    setDefaultRange(3000);
    dispatch(resetAllValueFilter());
  };

  return {
    searchTitle,
    selectedCategoryCurrent,
    setSelectedCategoriesCurrent,
    defaultRange,
    setDefaultRange,
    changeSearch,
    submitSearch,
    resetValuesForm,
  };
}
