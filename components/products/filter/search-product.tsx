interface SearchProductsProps {
  searchTitleProducts: string;
  changeSearchProducts: (e: React.ChangeEvent<HTMLInputElement>) => void;
}
export default function SearchProduct({
  searchTitleProducts,
  changeSearchProducts,
}: SearchProductsProps) {
  return (
    <div className="search_product">
      <label htmlFor="search_product">Serch Product</label>
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
