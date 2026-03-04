"use client";
import { clearCart } from "@/lib/features/products/cartSlice";
import { useAppDispatch } from "@/lib/hooks";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TimerForReturn() {
  const dispatch = useAppDispatch();
  const [timerChange, setTimerChange] = useState<number>(10);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimerChange((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (timerChange <= 0) {
        dispatch(clearCart());
        router.push("/products");
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timerChange, dispatch, router]);

  return <div>Redirect in...{timerChange} seconds...</div>;
}
