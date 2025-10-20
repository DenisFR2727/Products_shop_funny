"use client";

import { useRouter } from "next/navigation";
import "./nav-link-backdrop.scss";

interface BackDrop {
  children: React.ReactNode;
}

export default function BackDropNav({ children }: BackDrop) {
  const router = useRouter();

  return (
    <div className="nav-backdrop" onClick={router.back}>
      {children}
    </div>
  );
}
