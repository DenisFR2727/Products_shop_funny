import classes from "./filter-button.module.scss"

interface FilterBtnProps {
   type: "button" | "submit" | "reset";
   ariaExpanded: boolean;
   ariaControls: string;
   onClick: () => void;
   icon: React.ReactNode;
}

export default function FilterBtn ({ type, icon, ariaExpanded, ariaControls, onClick }: FilterBtnProps) {

   return <button className={classes.filter_button} 
   type={type} 
   aria-expanded={ariaExpanded} 
   aria-controls={ariaControls} 
   onClick={onClick}>
      <span className={classes.filter_button_text}>Filter    <span
          className={`${classes.filter_button_icon} ${
            ariaExpanded ? classes.icon_open : classes.icon_closed
          }`}
        >
          {icon}
        </span></span>
   </button>
}