import DinamicPanelMenu from "./dinamic-panel-menu";
import "./dinamic-panel.scss";

export default function DinamicPanel({ lengItems }: any) {
  return (
    <div className="dinamic-panel">
      <p className="leng-products">
        {lengItems.length} <span>products</span>
      </p>
      <DinamicPanelMenu />
    </div>
  );
}
