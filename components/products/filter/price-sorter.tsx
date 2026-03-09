"use client";
import { setSelectPriceSorter } from "@/lib/features/products/filterProductsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useTranslation } from "react-i18next";
import { priceSortSelector } from "@/lib/selectors/filterSelectors";
import Field from "./field/field";

import classes from "./price-sorter.module.scss";

export default function PriceSorter() {
  const dispatch = useAppDispatch();
  const priceSort = useAppSelector(priceSortSelector);
  const { t } = useTranslation();

  function handleMinPrice() {
    dispatch(setSelectPriceSorter(priceSort === "min" ? null : "min"));
  }
  function handleMaxPrice() {
    dispatch(setSelectPriceSorter(priceSort === "max" ? null : "max"));
  }

  return (
    <div className={classes.min_max_price}>
      <Field
        label={t("Min price")}
        id="min_price"
        type="checkbox"
        onChange={handleMinPrice}
        checked={priceSort === "min"}
      />
      <Field
        label={t("Max price")}
        id="max_price"
        type="checkbox"
        onChange={handleMaxPrice}
        checked={priceSort === "max"}
      />
    </div>
  );
}
