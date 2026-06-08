import { useNavigate, useParams, Link } from "react-router-dom";
import { useSlot } from "../hooks/useSlot";
import BookingForm from "../components/BookingForm";
import styles from "./BookingPage.module.css";

export function BookingPage() {
  const { slotId } = useParams<{ slotId: string }>();
  const navigate = useNavigate();
  const { slot, loading, error } = useSlot(slotId ?? "");

  const formattedDate = slot
    ? new Date(slot.date + "T00:00:00").toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  const formatTime = (t: string) => t.slice(0, 5);

  function handleSuccess() {
    navigate("/");
  }

  if (loading) return <p className={styles.message}>Loading slot details...</p>;
  if (error || !slot)
    return (
      <p className={styles.message}>
        Slot not found. <Link to="/">Go back</Link>
      </p>
    );
  if (!slot.is_available)
    return (
      <p className={styles.message}>
        This slot is no longer available. <Link to="/">See other slots</Link>
      </p>
    );

  return (
    <main className={styles.page}>
      <Link to="/" className={styles.back}>
        ← Back to all slots
      </Link>

      <div className={styles.slotSummary}>
        <p className={styles.slotDate}>{formattedDate}</p>
        <p className={styles.slotTime}>
          {formatTime(slot.start_time)} – {formatTime(slot.end_time)}
        </p>
      </div>

      <h1 className={styles.title}>Enter your details</h1>
      <BookingForm slotId={slot.id} onSuccess={handleSuccess} />
    </main>
  );
}
