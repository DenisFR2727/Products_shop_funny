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

  return (
    <div className="filter_panel">
      <form onSubmit={(e) => e.preventDefault()}>
        <SearchProduct
          searchTitleProducts={searchTitle}
          changeSearchProducts={changeSearch}
        />
        <CategorySelect
          valueSelected={selectedCategoryCurrent}
          onChangeSelected={setSelectedCategoriesCurrent}
          products={products}
        />
        <SelectPrice
          defaultRangePrice={defaultRange}
          setDefaultRangePrice={setDefaultRange}
        />
        <FilterButtons
          theme={themeFilterBtn}
          submitSearchFilter={submitSearch}
          resetValuesFormFilter={resetValuesForm}
        />
      </form>
    </div>
  );
});
export default FilterPanel;
