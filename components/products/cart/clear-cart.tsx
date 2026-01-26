"use client";
import { clearCart } from "@/lib/features/products/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useEffect } from "react";

export default function CleaningAfterOrdering() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, []);

  return null;
}
