import DinamicPanelMenu from "./dinamic-panel-menu";
import "./dinamic-panel.scss";

interface LengItemsProps {
  lengItems: unknown[];
  t: (value: string) => string;
}

export default function DinamicPanel({ lengItems, t }: LengItemsProps) {
  return (
    <div className="dinamic-panel">
      <p className="leng-products">
        {lengItems.length} <span>products</span>
      </p>
      <DinamicPanelMenu />
    </div>
  );
}
