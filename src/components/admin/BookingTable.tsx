import type { BookingWithSlot } from "../../types";
import styles from "./BookingTable.module.css";

interface Props {
  bookings: BookingWithSlot[];
  loading: boolean;
  error: string | null;
}

export function BookingTable({ bookings, loading, error }: Props) {
  if (loading) return <p className={styles.message}>Loading bookings...</p>;
  if (error) return <p className={styles.message}>Failed to load bookings.</p>;
  if (bookings.length === 0)
    return <p className={styles.message}>No bookings yet.</p>;

  const formatDate = (date: string) =>
    new Date(date + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  const formatTime = (t: string) => t.slice(0, 5);

  const formatCreatedAt = (ts: string) =>
    new Date(ts).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Time</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Booked at</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{formatDate(booking.available_slots.date)}</td>
              <td>
                {formatTime(booking.available_slots.start_time)} -{" "}
                {formatTime(booking.available_slots.end_time)}
              </td>
              <td>{booking.customer_name}</td>
              <td>{booking.customer_email}</td>
              <td>{booking.customer_phone}</td>
              <td>
                <span className={`${styles.badge} ${styles[booking.status]}`}>
                  {booking.status}
                </span>
              </td>
              <td>{formatCreatedAt(booking.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
