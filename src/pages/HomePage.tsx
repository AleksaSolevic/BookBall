import { useSlots } from "../hooks/useSlots";
import SlotList from "../components/SlotList";
import styles from "./HomePage.module.css";

function HomePage() {
  const { slots, loading, error } = useSlots();

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>Book 🏀</h1>
      <p className={styles.subtitle}>
        Select an available slot to book your session.
      </p>
      <SlotList slots={slots} loading={loading} error={error} />
    </main>
  );
}

export default HomePage;
