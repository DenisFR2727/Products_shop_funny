"use client";
import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";
import { ProgressModalProps } from "./types";

import "./progress.scss";

export default function ProgressModal({ open, children }: ProgressModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const overlay = document.getElementById("dialog-overlay");

  if (!overlay) return null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return createPortal(
    <dialog className="dialog_modal" ref={dialogRef}>
      {children}
    </dialog>,
    overlay
  );
}
