import Field from "./field/field";

interface SelectPriceProps {
  defaultRangePrice: number;
  setDefaultRangePrice: (value: number) => void;
  t: (value: string) => string;
}
export default function SelectPrice({
  defaultRangePrice,
  setDefaultRangePrice,
  t,
}: SelectPriceProps) {
  return (
    <div className="select_price">
      <div className="select_price-value">
        <p>${defaultRangePrice}</p>
      </div>
      <Field
        id="range_price"
        label={t("Select price")}
        className="range_price"
        type="range"
        max={3000}
        value={defaultRangePrice}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDefaultRangePrice(+e.target.value)
        }
      />
    </div>
  );
}
