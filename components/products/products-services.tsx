"use client";

import DinamicPanel from "./dinamic-panel/dinamic-panel";
import FilterPanel from "./filter/filter-panel";
import PaginationList from "./pagination/pagination ";
import { ProductListProps } from "./products-list";
import { useFilterProducts } from "./filter/hooks";
import { useContext, useEffect, useRef } from "react";
import { useAppSelector } from "@/lib/hooks";
import { pageSelector } from "@/lib/selectors/paginationSelectors";
import { ThemeContext } from "@/context/themeContext";

import "@/styles/globals.css";

export default function ProductsServices({
  products,
}: Omit<ProductListProps, "listRef">) {
  const { filteredProducts } = useFilterProducts(products);
  const page = useAppSelector(pageSelector);
  const { theme } = useContext(ThemeContext);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div ref={listRef} className={`products_list ${theme}`}>
      <FilterPanel products={products} />
      <DinamicPanel ref={listRef} lengItems={filteredProducts} />
      <PaginationList products={filteredProducts} />
    </div>
  );
}
