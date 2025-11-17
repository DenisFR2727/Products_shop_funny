"use client";

import DinamicPanel from "./dinamic-panel/dinamic-panel";
import FilterPanel from "./filter/filter-panel";
import PaginationList from "./pagination/pagination ";
import { ProductListProps } from "./products-list";
import { useFilterProducts } from "./filter/hooks";
import { memo, useContext, useEffect, useRef } from "react";
import { useAppSelector } from "@/lib/hooks";
import { pageSelector } from "@/lib/selectors/paginationSelectors";
import { ThemeContext } from "@/context/themeContext";

import "@/styles/globals.css";
import { log } from "@/lib/log";
import ProgressHandler from "./modal/progress/ProgressHandler";

const ProductsServices = memo(function ({
  products,
}: Omit<ProductListProps, "listRef">) {
  log("<ProductsServices /> rendered", 1);
  const { filteredProducts } = useFilterProducts(products);
  const { theme } = useContext(ThemeContext);

  const page = useAppSelector(pageSelector);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div ref={listRef} className={`products_list ${theme}`}>
      <ProgressHandler />
      <FilterPanel products={products} />
      <DinamicPanel ref={listRef} lengItems={filteredProducts} />
      <PaginationList products={filteredProducts} />
    </div>
  );
});
export default ProductsServices;
