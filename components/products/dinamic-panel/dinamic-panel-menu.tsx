"use client";
import { TfiViewList } from "react-icons/tfi";
import { PiBoundingBoxLight } from "react-icons/pi";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { togglePanel } from "@/lib/features/products/cartSlice";

export default function DinamicPanelMenu() {
  const dispatch = useAppDispatch();
  const isToggle = useAppSelector((state) => state.cartReducer.togglePanel);

  return (
    <div className="dinamic-panel-menu">
      <div
        className={!isToggle ? "card-panel-active" : "card-panel"}
        onClick={() => dispatch(togglePanel(false))}
      >
        <PiBoundingBoxLight className="list-panel-boxlight" />
      </div>
      <div
        className={isToggle ? "card-panel-active" : "list-panel"}
        onClick={() => dispatch(togglePanel(true))}
      >
        <TfiViewList className="list-panel-listview" />
      </div>
    </div>
  );
}
