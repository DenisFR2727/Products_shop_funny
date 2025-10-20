"use client";

import { useEffect, useMemo } from "react";
import ProductList, { ProductListProps } from "../products-list";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setPage } from "@/lib/features/products/paginationSlice";
import { pageSelector } from "@/lib/selectors/paginationSelectors";

import "./pagination.scss";

export default function PaginationList({
  products,
}: Omit<ProductListProps, "listRef">) {
  const dispatch = useAppDispatch();
  const page = useAppSelector(pageSelector);

  const itemsPerPage = 8;

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  const currentProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return products.slice(start, end);
  }, [page, products]);

  useEffect(() => {
    if (page > totalPages) {
      dispatch(setPage(1));
    }
  }, [products, totalPages, page]);

  return (
    <div>
      <ProductList products={currentProducts} />
      <div className="pagination_btn-list">
        <button
          disabled={page === 1}
          onClick={() => dispatch(setPage(page - 1))}
          className="pagination_prev-btn"
        >
          Prev
        </button>
        <span className="pagination_pages-current">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => dispatch(setPage(page + 1))}
          className="pagination_next-btn"
        >
          Next
        </button>
      </div>
    </div>
  );
}
