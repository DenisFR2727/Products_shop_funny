"use client";

import DinamicPanel from "./dinamic-panel/dinamic-panel";
import FilterPanel from "./filter/filter-panel";
import PaginationList from "./pagination/pagination ";
import { ProductListProps } from "./products-list";
import { useFilterProducts } from "./filter/hooks";
import { useCallback, useContext, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { pageSelector } from "@/lib/selectors/paginationSelectors";
import { ThemeContext } from "@/context/themeContext";
import { setShowProgress } from "@/lib/features/products/cartSlice";
import ProgressModal from "./modal/progress/modal-progress";
import DeleteComfirmationProgress from "./modal/progress/progress-timer";

import "@/styles/globals.css";

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

  const onCancelProgress = useCallback(() => {
    dispatch(setShowProgress(false));
  }, []);

  return (
    <div ref={listRef} className={`products_list ${theme}`}>
      <div id="dialog-overlay"></div>
      <ProgressModal open={isShowProgress}>
        {isShowProgress && (
          <DeleteComfirmationProgress onCancel={onCancelProgress} />
        )}
      </ProgressModal>
      <FilterPanel products={products} />
      <DinamicPanel ref={listRef} lengItems={filteredProducts} />
      <PaginationList products={filteredProducts} />
    </div>
  );
}
