import type { Slot } from "../types";
import SlotCard from "./SlotCard";
import styles from "./SlotList.module.css";

interface Props {
  slots: Slot[];
  loading: boolean;
  error: string | null;
}

function SlotList({ slots, loading, error }: Props) {
  if (loading)
    return <p className={styles.message}>Loading available slots...</p>;
  if (error)
    return (
      <p className={styles.message}>Something went wrong. Please try again.</p>
    );
  if (slots.length === 0)
    return <p className={styles.message}>No available slots at the moment.</p>;

  return (
    <ul className={styles.list}>
      {slots.map((slot) => (
        <li key={slot.id}>
          <SlotCard slot={slot} />
        </li>
      ))}
    </ul>
  );
}

export default SlotList;
