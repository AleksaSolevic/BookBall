import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useBookings } from "../hooks/useBookings";
import { BookingTable } from "../components/admin/BookingTable";
import { SlotManager } from "../components/admin/SlotManager";
import styles from "./AdminPage.module.css";

function AdminPage() {
  const navigate = useNavigate();
  const { bookings, loading, error } = useBookings();

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/login");
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Coach Dashboard</h1>
          <p className={styles.subtitle}>
            {bookings.length} booking{bookings.length !== 1 ? "s" : ""} total
          </p>
        </div>
        <button className={styles.logout} onClick={handleLogout}>
          Log out
        </button>
      </header>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Manage Slots</h2>
        <SlotManager />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Bookings</h2>
        <BookingTable bookings={bookings} loading={loading} error={error} />
      </section>
    </main>
  );
}

export default AdminPage;
