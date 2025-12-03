import { useFormStatus } from "react-dom";
import styles from "./shipping-details.module.scss";

export default function SubmitForm() {
  const status = useFormStatus();

  if (status.pending) {
    return <p>Loading address...</p>;
  }
  return (
    <button className={styles.confirm} disabled={status.pending}>
      Confirm order
    </button>
  );
}
