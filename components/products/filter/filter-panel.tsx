"use client";
import { ProductListProps } from "../products-list";
import { useFilterForm } from "./hooks";
import "./filter-panel.scss";

export default function FilterPanel({
  products,
}: Omit<ProductListProps, "listRef">) {
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

  const categories = products.map((p) => p.category);
  const uniqCategories = [...new Set(categories)];

  return (
    <div className="filter_panel">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="search_product">
          <label htmlFor="">Serch Product</label>
          <input
            className="search_item-input"
            type="text"
            value={searchTitle}
            onChange={changeSearch}
          />
        </div>
        <div className="select_category">
          <label>Select category</label>
          <select
            className="select_item-category"
            value={selectedCategoryCurrent}
            onChange={(e) => setSelectedCategoriesCurrent(e.target.value)}
          >
            <option value="All">All</option>
            {uniqCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="select_price">
          <div className="select_price-value">
            <label htmlFor="">Select price</label>
            <p>${defaultRange}</p>
          </div>
          <input
            className="range_price"
            type="range"
            max={3000}
            value={defaultRange}
            onChange={(e) => setDefaultRange(+e.target.value)}
          />
        </div>
        <div className="filter_buttons">
          <button className="search_btn-filter" onClick={submitSearch}>
            SEARCH
          </button>
          <button className="reset_btn-filter" onClick={resetValuesForm}>
            RESET
          </button>
        </div>
      </form>
    </div>
  );
}
