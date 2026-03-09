"use client";
import { memo, useCallback, useMemo, useState } from "react";
import Field from "./field/field";
import { IProducts } from "@/lib/types";

import "./filter-panel.scss";

interface SearchProductsProps {
  searchTitleProducts: string;
  changeSearchProducts: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (value: string) => string;
  products: IProducts[];
}

function SearchProduct({
  searchTitleProducts,
  changeSearchProducts,
  t,
  products,
}: SearchProductsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!searchTitleProducts.trim()) {
      return [];
    }
    const lowerQueryTitle = searchTitleProducts.toLowerCase();
    return products
      .filter((p) => p.title.toLowerCase().includes(lowerQueryTitle))
      .slice(0, 5);
  }, [searchTitleProducts, products]);

  const handleFocus = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleBlur = useCallback(() => {
    setTimeout(() => setIsOpen(false), 100);
  }, []);

  const handleSelectTitle = useCallback(
    (title: string) => {
      changeSearchProducts({
        target: { value: title },
      } as React.ChangeEvent<HTMLInputElement>);
      setIsOpen(false);
    },
    [changeSearchProducts],
  );

  const handleItemMouseDown = useCallback(
    (e: React.MouseEvent<HTMLLIElement>) => {
      e.preventDefault();
      const title = e.currentTarget.dataset.title;
      if (title) {
        handleSelectTitle(title);
      }
    },
    [handleSelectTitle],
  );

  return (
    <div className="search_product">
      <Field
        id="search_product"
        label={t("Serch Product")}
        className="search_item-input"
        type="text"
        value={searchTitleProducts}
        onChange={changeSearchProducts}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {isOpen && filteredProducts.length > 0 && (
        <ul className="search_item-list">
          {filteredProducts?.map((product) => (
            <li
              key={product.id}
              data-title={product.title}
              onMouseDown={handleItemMouseDown}
            >
              {product.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default memo(SearchProduct);
