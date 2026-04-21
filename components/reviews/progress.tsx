"use client";

import { useEffect, useState } from "react";
import classes from "./create-reviews.module.scss";

interface ProgressProps {
   duration?: number;
   onComplete: () => void;
}

export default function Progress({duration = 3000, onComplete }: ProgressProps) {
   const [progress, setProgress] = useState<number>(100);

 useEffect(() => {
   const tickMs = 50;
   const decrement = 100 / (duration / tickMs);

    const interval = setInterval(() => {
         setProgress((prevProgress) => {
            const next = Math.max(prevProgress - decrement, 0);
         return next;
         })
     }, tickMs)

     return () => clearInterval(interval)
 },[duration])

 useEffect(() => {
   if (progress <= 0) {
    onComplete()
   }
 },[progress, onComplete])

  return (
    <div>
      <progress value={progress} max={100} className={classes.progress}  />
    </div>
  )
}