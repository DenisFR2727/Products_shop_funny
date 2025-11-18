import { log } from "@/lib/log";
import { IProducts } from "@/lib/types";

interface CategorySelectProps {
  valueSelected: string;
  onChangeSelected: (value: string) => void;
  products: IProducts[];
}

export default function CategorySelect({
  valueSelected,
  onChangeSelected,
  products,
}: CategorySelectProps) {
  log("CategotySelect", 1);
  const categories = products.map((p) => p.category);
  const uniqCategories = [...new Set(categories)];

  return (
    <div className="select_category">
      <label htmlFor="select_category">Select category</label>
      <select
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
      </select>
    </div>
  );
}
