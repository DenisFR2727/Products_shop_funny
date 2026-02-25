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
      <label htmlFor="search_product">{t("Serch Product")}</label>
      <input
        id="search_product"
        className="search_item-input"
        type="text"
        value={searchTitleProducts}
        onChange={changeSearchProducts}
      />
    </div>
  );
}
