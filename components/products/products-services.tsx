"use client";

import DinamicPanel from "./dinamic-panel/dinamic-panel";
import FilterPanel from "./filter/filter-panel";
import PaginationList from "./pagination/pagination ";
import { ProductListProps } from "./products-list";
import { useFilterProducts } from "./filter/hooks";
import { useEffect, useRef } from "react";
import { useAppSelector } from "@/lib/hooks";
import { pageSelector } from "@/lib/selectors/paginationSelectors";

export default function ProductsServices({
  products,
}: Omit<ProductListProps, "listRef">) {
  const { filteredProducts } = useFilterProducts(products);
  const page = useAppSelector(pageSelector);

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div ref={listRef} className="products_list">
      <FilterPanel products={products} />
      <DinamicPanel ref={listRef} lengItems={filteredProducts} />
      <PaginationList products={filteredProducts} />
    </div>
  );
}
