"use client";

import { useAppDispatch } from "@/lib/hooks";
import Portal from "../portal/portal";
import { setSelectedPhoto } from "@/lib/features/unsplash/unsplashSlice";

import "./modal-unsplash.scss";

export default function ModalPortalUnspalsh({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();

  return (
    <Portal>
      <div
        className="modal-backdrop"
        onClick={() => dispatch(setSelectedPhoto(null))}
      >
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </div>
    </Portal>
  );
}
