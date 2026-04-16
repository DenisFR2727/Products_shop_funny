"use client";

import DinamicPanel from "./dinamic-panel/dinamic-panel";
import FilterPanel from "./filter/filter-panel";
import PaginationList from "./pagination/pagination ";
import { ProductListProps } from "./products-list";
import { useFilterProducts } from "./filter/hooks";
import { memo, useContext, useEffect, useRef, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { pageSelector } from "@/lib/selectors/paginationSelectors";
import { ThemeContext } from "@/context/themeContext";
import ProgressHandler from "./modal/progress/ProgressHandler";
import { useTranslation } from "react-i18next";
import { HiArrowUp } from "react-icons/hi";
import FilterBtn from "./filter/filter-btn/filter-button";

import classes from "./filter/filter-btn/filter-button.module.scss";
import "@/styles/globals.css";



const ProductsServices = memo(function ({
  products: allProducts,
}: Omit<ProductListProps, "listRef">) {
  const { filteredProducts } = useFilterProducts(allProducts);
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const page = useAppSelector(pageSelector);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div ref={listRef} className={`products_list ${theme}`}>
      <ProgressHandler />
      <FilterBtn  type="button"  ariaExpanded={isFilterOpen} icon={<HiArrowUp />}
  ariaControls="filter-panel-products" onClick={() => setIsFilterOpen((prev) => !prev)} />
       <div id="filter-panel-products"
      className={`${classes.filterPanelWrapper} ${
         isFilterOpen ? classes.open : classes.closed
       }`}
        aria-hidden={!isFilterOpen}
        >
         <div className={classes.filterPanelInner}>
    <FilterPanel products={allProducts} />
  </div>
      </div>  
      <DinamicPanel ref={listRef} lengItems={filteredProducts} t={t} />
      <PaginationList products={filteredProducts} />
    </div>
  );
});
export default ProductsServices;
