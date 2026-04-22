import { useEffect, useRef, useState } from "react";

interface UseModalBehaviorProps  {
  onClose: () => void;
  targetId: string;
}


export default function useModalBehavior({onClose, targetId}: UseModalBehaviorProps) {
   const [target, setTarget] = useState<HTMLElement | null>(null);
   const dialogRef = useRef<HTMLDivElement | null>(null);
   
 
   useEffect(() => {
    setTarget(document.getElementById(targetId) ?? document.body);
   }, [targetId]);
 
   useEffect(() => {
     dialogRef.current?.focus();
 
     function handleEscape(event: KeyboardEvent): void {
       if (event.key === "Escape") {
         onClose();
       }
     }
 
     window.addEventListener("keydown", handleEscape);
     return () => {
       window.removeEventListener("keydown", handleEscape);
     };
   }, [onClose]);

   function handleModalClick(e: React.MouseEvent<HTMLDivElement>): void {
      e.stopPropagation();
    }

   return {target, dialogRef, handleModalClick}
}