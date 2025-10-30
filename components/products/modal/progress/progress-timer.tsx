"use client";
import { useEffect, useState } from "react";

const TIMER = 3000;

export default function DeleteComfirmationProgress({ onCancel }: any) {
  const [remaningTime, setRemaningTime] = useState(TIMER);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("INTERVAL");
      setRemaningTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      console.log("Timer SET");
      onCancel();
    }, TIMER);

    return () => {
      clearTimeout(timer);
    };
  }, [onCancel]);

  return (
    <div className="delete_confirmation">
      <h2>Add product in Cart :'</h2>
      <progress value={remaningTime} max={TIMER}></progress>
    </div>
  );
}
