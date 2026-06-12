import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import type { Slot } from "../../types/index";
import styles from "./SlotManager.module.css";

export function SlotManager() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [coachId, setCoachId] = useState<string | null>(null);

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const [{ data: coachData }, { data: slotData }] = await Promise.all([
      supabase.from("coaches").select("id").single(),
      supabase
        .from("available_slots")
        .select("*")
        .order("date", { ascending: true })
        .order("start_time", { ascending: true }),
    ]);
    if (coachData) setCoachId(coachData.id);
    setSlots(slotData ?? []);
    setLoading(false);
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);

    if (!date || !startTime || !endTime) {
      setFormError("All fields are required.");
      return;
    }
    if (endTime <= startTime) {
      setFormError("End time must be after start time.");
      return;
    }
    if (!coachId) {
      setFormError("Coach not found in database.");
      return;
    }

    setAdding(true);

    const { error } = await supabase.from("available_slots").insert({
      coach_id: coachId,
      date,
      start_time: startTime,
      end_time: endTime,
    });

    if (error) {
      setFormError(
        "Could not add slot. It may already exist for that date and time.",
      );
      setAdding(false);
      return;
    }

    setDate("");
    setStartTime("");
    setEndTime("");
    setAdding(false);
    loadData();
  }

  async function handleDelete(slotId: string) {
    setDeletingId(slotId);
    await supabase.from("available_slots").delete().eq("id", slotId);
    setDeletingId(null);
    loadData();
  }

  const today = new Date().toISOString().split("T")[0];
  const formatDate = (d: string) =>
    new Date(d + "T00:00:00").toLocaleDateString("en-GB", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  const formatTime = (t: string) => t.slice(0, 5);

  return (
    <div>
      <form onSubmit={handleAdd} className={styles.form}>
        <div className={styles.fields}>
          <div className={styles.field}>
            <label htmlFor="date" className={styles.label}>
              Date
            </label>
            <input
              id="date"
              type="date"
              className={styles.input}
              value={date}
              min={today}
              onChange={(e) => setDate(e.target.value)}
              disabled={adding}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="startTime" className={styles.label}>
              Start time
            </label>
            <input
              id="startTime"
              type="time"
              className={styles.input}
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              disabled={adding}
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="endTime" className={styles.label}>
              End time
            </label>
            <input
              id="endTime"
              type="time"
              className={styles.input}
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              disabled={adding}
            />
          </div>
          <button type="submit" className={styles.addButton} disabled={adding}>
            {adding ? "Adding..." : "+ Add slot"}
          </button>
        </div>
        {formError && <p className={styles.formError}>{formError}</p>}
      </form>

      {loading ? (
        <p className={styles.message}>Loading slots...</p>
      ) : slots.length === 0 ? (
        <p className={styles.message}>No slots yet. Add one above.</p>
      ) : (
        <ul className={styles.list}>
          {slots.map((slot) => (
            <li key={slot.id} className={styles.slotRow}>
              <span className={styles.slotDate}>{formatDate(slot.date)}</span>
              <span className={styles.slotTime}>
                {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
              </span>
              <span
                className={`${styles.badge} ${slot.is_available ? styles.available : styles.booked}`}
              >
                {slot.is_available ? "Available" : "Booked"}
              </span>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(slot.id)}
                disabled={!slot.is_available || deletingId === slot.id}
                title={
                  !slot.is_available
                    ? "Cannot delete a booked slot"
                    : "Delete slot"
                }
              >
                {deletingId === slot.id ? "..." : "Delete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
