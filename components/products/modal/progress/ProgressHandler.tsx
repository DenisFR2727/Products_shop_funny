"use client";
import { setShowProgress } from "@/lib/features/products/cartSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useCallback } from "react";
import ProgressModal from "./modal-progress";
import DeleteComfirmationProgress from "./progress-timer";

export default function ProgressHandler() {
  const dispatch = useAppDispatch();
  const isShowProgress = useAppSelector(
    (state) => state.cartReducer.showProgressModal
  );

  const onCancelProgress = useCallback(() => {
    dispatch(setShowProgress(false));
  }, []);

  if (!isShowProgress) return null;

  return (
    <ProgressModal open={isShowProgress} overlayId="dialog-overlay">
      <DeleteComfirmationProgress onCancel={onCancelProgress} />
    </ProgressModal>
  );
}
