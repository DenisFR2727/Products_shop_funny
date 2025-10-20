"use client";
import { useRouter } from "next/navigation";

import "@/styles/globals.css";

export interface ModalBackDropsProps {
  children: React.ReactNode;
}

export default function ModalBackdrop({ children }: ModalBackDropsProps) {
  const router = useRouter();
  return (
    <div className="modal-backdrop" onClick={router.back}>
      {children}
    </div>
  );
}
