import { useFormStatus } from "react-dom";
import { SpinnerCircularSplit } from "spinners-react";

import styles from "./shipping-details.module.scss";

export default function SubmitForm() {
  const status = useFormStatus();

  if (status.pending) {
    return (
      <p className={styles.loading}>
        <span>Loading orders</span>
        <SpinnerCircularSplit className={styles.diamond} />
      </p>
    );
  }
  return (
    <button className={styles.confirm} disabled={status.pending}>
      Confirm order
    </button>
  );
}
