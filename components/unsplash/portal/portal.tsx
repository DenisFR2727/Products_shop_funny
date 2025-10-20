"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function Portal({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    setModalRoot(document.getElementById("overlay-modal"));
  }, []);

  if (!mounted || !modalRoot) return null;

  return createPortal(children, modalRoot);
}
