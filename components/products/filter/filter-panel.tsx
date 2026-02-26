"use client";
import { ProductListProps } from "../products-list";
import { useFilterForm } from "./hooks";
import { memo, useContext } from "react";
import { ThemeContext } from "@/context/themeContext";

import "./filter-panel.scss";
import { log } from "@/lib/log";
import CategorySelect from "./select-category";
import SelectPrice from "./select-price";
import SearchProduct from "./search-product";
import FilterButtons from "./filter-buttons";
import { useTranslation } from "react-i18next";
import AlphabetSortedProducts from "./sorted-alphabet";

const FilterPanel = memo(function ({
  products,
}: Omit<ProductListProps, "listRef">) {
  log("FilterPanel", 1);
  const {
    searchTitle,
    selectedCategoryCurrent,
    setSelectedCategoriesCurrent,
    defaultRange,
    setDefaultRange,
    changeSearch,
    submitSearch,
    resetValuesForm,
  } = useFilterForm();
  const { themeFilterBtn } = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <div className="filter_panel">
      <form onSubmit={(e) => e.preventDefault()}>
        <SearchProduct
          searchTitleProducts={searchTitle}
          changeSearchProducts={changeSearch}
          t={t}
        />
        <CategorySelect
          valueSelected={selectedCategoryCurrent}
          onChangeSelected={setSelectedCategoriesCurrent}
          products={products}
          t={t}
        />
        <SelectPrice
          defaultRangePrice={defaultRange}
          setDefaultRangePrice={setDefaultRange}
          t={t}
        />
        <AlphabetSortedProducts />
        <FilterButtons
          theme={themeFilterBtn}
          submitSearchFilter={submitSearch}
          resetValuesFormFilter={resetValuesForm}
          t={t}
        />
      </form>
    </div>
  );
});
export default FilterPanel;
