import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { BookingWithSlot } from "../types";

export function useBookings() {
  const [bookings, setBookings] = useState<BookingWithSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          `
          *,
          available_slots (
            date,
            start_time,
            end_time
          )
        `,
        )
        .order("created_at", { ascending: false });

      if (error) {
        setError(error.message);
      } else {
        setBookings((data as BookingWithSlot[]) ?? []);
      }
      setLoading(false);
    }

    fetchBookings();
  }, []);

  return { bookings, loading, error };
}
