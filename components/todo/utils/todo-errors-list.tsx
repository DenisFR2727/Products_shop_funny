"use client";

import { TodoErrorsListProps } from "../types";
import styles from "../todo-list.module.scss";

export default function TodoErrorsList({ errors }: TodoErrorsListProps) {
  if (!errors?.length) return null;

  return (
    <ul className={styles.errorList} role="alert">
      {errors.map((message, index) => (
        <li key={`${message}-${index}`}>{message}</li>
      ))}
    </ul>
  );
}
