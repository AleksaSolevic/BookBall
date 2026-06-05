import { useNavigate } from "react-router-dom";
import type { Slot } from "../types";
import styles from "./SlotCard.module.css";

interface Props {
  slot: Slot;
}
function SlotCard({ slot }: Props) {
  const navigate = useNavigate();

  const formattedDate = new Date(slot.date + "T00:00:00").toLocaleDateString(
    "en-GB",
    {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  );

  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div className={styles.card}>
      <p className={styles.date}>{formattedDate}</p>
      <p className={styles.time}>
        {formatTime(slot.start_time)} -{formatTime(slot.end_time)}
      </p>
      <button
        className={styles.button}
        onClick={() => navigate(`/book/${slot.id}`)}
      >
        Book this slot
      </button>
    </div>
  );
}
export default SlotCard;
