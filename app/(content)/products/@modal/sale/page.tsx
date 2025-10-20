"use client";
import { useRouter } from "next/navigation";

import "./sale.scss";

export default function SaleModalPage() {
  const router = useRouter();

  return (
    <div className="sale_modal" onClick={() => router.back()}>
      <div className="sale_modal-content" onClick={(e) => e.stopPropagation()}>
        <img
          className="sale_modal-img"
          src="/sale-modal-image.jpg"
          alt="image"
        />
        <button className="sale_modal-close" onClick={() => router.back()}>
          Close
        </button>
      </div>
    </div>
  );
}
