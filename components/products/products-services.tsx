"use client";

import DinamicPanel from "./dinamic-panel/dinamic-panel";
import FilterPanel from "./filter/filter-panel";
import PaginationList from "./pagination/pagination ";
import { ProductListProps } from "./products-list";
import { useFilterProducts } from "./filter/hooks";
import { useContext, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { pageSelector } from "@/lib/selectors/paginationSelectors";
import { ThemeContext } from "@/context/themeContext";

import "@/styles/globals.css";
import ProgressModal from "./modal/progress/modal-progress";
import DeleteComfirmationProgress from "./modal/progress/progress-timer";
import { setShowProgress } from "@/lib/features/products/cartSlice";

export default function ProductsServices({
  products,
}: Omit<ProductListProps, "listRef">) {
  const { filteredProducts } = useFilterProducts(products);
  const { theme } = useContext(ThemeContext);
  const dispatch = useAppDispatch();
  const page = useAppSelector(pageSelector);
  const isShowProgress = useAppSelector(
    (state) => state.cartReducer.showProgressModal
  );

  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [page]);

  return (
    <div ref={listRef} className={`products_list ${theme}`}>
      <div id="dialog-overlay"></div>
      {isShowProgress && (
        <ProgressModal open={isShowProgress}>
          <DeleteComfirmationProgress
            onCancel={() => dispatch(setShowProgress(false))}
          />
        </ProgressModal>
      )}
      <FilterPanel products={products} />
      <DinamicPanel ref={listRef} lengItems={filteredProducts} />
      <PaginationList products={filteredProducts} />
    </div>
  );
}
