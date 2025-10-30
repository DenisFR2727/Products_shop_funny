"use client";
import { useEffect, useState } from "react";
import { ComfirmationProgressProps } from "./types";

const TIMER = 3000;

export default function DeleteComfirmationProgress({
  onCancel,
}: ComfirmationProgressProps) {
  const [remaningTime, setRemaningTime] = useState(TIMER);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaningTime((prevTime) => prevTime - 250);
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      onCancel();
    }, TIMER);

    return () => {
      clearTimeout(timer);
    };
  }, [onCancel]);

  return (
    <div className="delete_confirmation">
      <h2>Add product in Cart</h2>
      <progress
        className="progress_confirmed"
        value={remaningTime}
        max={TIMER}
      ></progress>
    </div>
  );
}
