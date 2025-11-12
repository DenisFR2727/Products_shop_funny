"use client";
import { useRouter } from "next/navigation";

interface ModalBackDropsProps {
  children: React.ReactNode;
}

export default function ModalSaleBackdrop({ children }: ModalBackDropsProps) {
  const router = useRouter();

  return (
    <div className="sale-backdrop" onClick={router.back}>
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}
