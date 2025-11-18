interface SelectPriceProps {
  defaultRangePrice: number;
  setDefaultRangePrice: (value: number) => void;
}
export default function SelectPrice({
  defaultRangePrice,
  setDefaultRangePrice,
}: SelectPriceProps) {
  return (
    <div className="select_price">
      <div className="select_price-value">
        <label htmlFor="range_price">Select price</label>
        <p>${defaultRangePrice}</p>
      </div>
      <input
        id="range_price"
        className="range_price"
        type="range"
        max={3000}
        value={defaultRangePrice}
        onChange={(e) => setDefaultRangePrice(+e.target.value)}
      />
    </div>
  );
}
