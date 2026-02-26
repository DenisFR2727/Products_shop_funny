"use client";
import classes from "./sorted-alphabet.module.scss";
import { useAppDispatch } from "@/lib/hooks";
import { setSelectAlphabet } from "@/lib/features/products/filterProductsSlice";

export default function AlphabetSortedProducts() {
  const dispatch = useAppDispatch();

  function handleAlphabet(e: React.ChangeEvent<HTMLInputElement>) {
    dispatch(setSelectAlphabet(e.target.checked));
  }

  return (
    <div className={classes.alphabet_products}>
      <label htmlFor="A-Z">A-Z</label>
      <input type="checkbox" onChange={handleAlphabet} />
    </div>
  );
}
