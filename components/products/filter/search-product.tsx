import Field from "./field/field";

interface SearchProductsProps {
  searchTitleProducts: string;
  changeSearchProducts: (e: React.ChangeEvent<HTMLInputElement>) => void;
  t: (value: string) => string;
}
export default function SearchProduct({
  searchTitleProducts,
  changeSearchProducts,
  t,
}: SearchProductsProps) {
  return (
    <div className="search_product">
      <Field
        id="search_product"
        label={t("Serch Product")}
        className="search_item-input"
        type="text"
        value={searchTitleProducts}
        onChange={changeSearchProducts}
      />
    </div>
  );
}
