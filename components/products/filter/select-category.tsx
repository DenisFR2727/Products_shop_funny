import { log } from "@/lib/log";
import { IProducts } from "@/lib/types";
import Field from "./field/field";

interface CategorySelectProps {
  valueSelected: string;
  onChangeSelected: (value: string) => void;
  products: IProducts[];
  t: (value: string) => string;
}

export default function CategorySelect({
  valueSelected,
  onChangeSelected,
  products,
  t,
}: CategorySelectProps) {
  log("CategotySelect", 1);
  const categories = products.map((p) => p.category);
  const uniqCategories = [...new Set(categories)];

  return (
    <div className="select_category">
      <Field
        as="select"
        label={t("Select category")}
        id="select_category"
        className="select_item-category"
        value={valueSelected}
        onChange={(e) => onChangeSelected(e.target.value)}
      >
        <option value="All">All</option>
        {uniqCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Field>
      {/* <label htmlFor="select_category">{t("Select category")}</label>
      <select>
        <option value="All">All</option>
        {uniqCategories.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select> */}
    </div>
  );
}
