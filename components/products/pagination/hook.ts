import { useEffect, useMemo, useRef, useState } from "react";
import { ProductListProps } from "../products-list";

export default function usePagination({ products }: any) {
  const listRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 8;

  const totalPages = Math.max(1, Math.ceil(products.length / itemsPerPage));

  const currentProducts = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return products?.slice(start, end);
  }, [page, products]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [products, totalPages, page]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [page]);
  return { page, setPage, currentProducts, listRef, totalPages };
}
