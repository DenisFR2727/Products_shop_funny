interface FilterButtonsProps {
  theme: string;
  submitSearchFilter: () => void;
  resetValuesFormFilter: () => void;
  t: (value: string) => string;
}

export default function FilterButtons({
  theme,
  submitSearchFilter,
  resetValuesFormFilter,
  t,
}: FilterButtonsProps) {
  return (
    <div className="filter_buttons">
      <button
        className={`${theme} search_btn-filter`}
        onClick={submitSearchFilter}
      >
        {t("search")}
      </button>
      <button
        className={`${theme} reset_btn-filter`}
        onClick={resetValuesFormFilter}
      >
        {t("reset")}
      </button>
    </div>
  );
}
