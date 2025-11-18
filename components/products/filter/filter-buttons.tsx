interface FilterButtonsProps {
  theme: string;
  submitSearchFilter: () => void;
  resetValuesFormFilter: () => void;
}

export default function FilterButtons({
  theme,
  submitSearchFilter,
  resetValuesFormFilter,
}: FilterButtonsProps) {
  return (
    <div className="filter_buttons">
      <button
        className={`${theme} search_btn-filter`}
        onClick={submitSearchFilter}
      >
        SEARCH
      </button>
      <button
        className={`${theme} reset_btn-filter`}
        onClick={resetValuesFormFilter}
      >
        RESET
      </button>
    </div>
  );
}
