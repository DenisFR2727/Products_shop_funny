"use client";
import classes from "./sorted-alphabet.module.scss";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setSelectAlphabet } from "@/lib/features/products/filterProductsSlice";
import { selectAlphabetSelector } from "@/lib/selectors/filterSelectors";

import Field from "./field/field";

export default function AlphabetSortedProducts() {
  const dispatch = useAppDispatch();
  const selectAlphabet = useAppSelector(selectAlphabetSelector);

  function handleAlphabet(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSelectAlphabet(e.target.checked ? "alphabet" : null));
  }

  return (
    <div className={classes.alphabet_products}>
      <Field
        id="A-Z"
        label="A-Z"
        type="checkbox"
        onChange={handleAlphabet}
        checked={selectAlphabet === "alphabet"}
      />
    </div>
  );
}
