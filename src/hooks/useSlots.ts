import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Slot } from "../types";

function useSlots() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSlots() {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("available_slots")
        .select("*")
        .eq("is_available", true)
        .gte("date", today)
        .order("date", { ascending: true })
        .order("start_time", { ascending: true });

      if (error) {
        setError(error.message);
      } else {
        setSlots(data ?? []);
      }
      setLoading(false);
    }

    fetchSlots();
  }, []);

  return { slots, loading, error };
}

export { useSlots };
