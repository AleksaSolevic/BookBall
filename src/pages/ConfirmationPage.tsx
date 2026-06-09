import { useLocation, Link, Navigate } from "react-router-dom";
import styles from "./ConfirmationPage.module.css";

interface LocationState {
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
}

function ConfirmationPage() {
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (!state) return <Navigate to="/" replace />;

  return (
    <main className={styles.page}>
      <div className={styles.icon}>✓</div>
      <h1 className={styles.title}>Booking Confirmed!</h1>
      <p className={styles.subtitle}>
        Your training session has been booked successfully.
      </p>

      <div className={styles.details}>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Date</span>
          <span className={styles.rowValue}>{state.date}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Time</span>
          <span className={styles.rowValue}>{state.time}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Name</span>
          <span className={styles.rowValue}>{state.name}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Email</span>
          <span className={styles.rowValue}>{state.email}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.rowLabel}>Phone</span>
          <span className={styles.rowValue}>{state.phone}</span>
        </div>
      </div>

      <Link to="/" className={styles.button}>
        Back to Home
      </Link>
    </main>
  );
}

export default ConfirmationPage;
