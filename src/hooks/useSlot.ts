import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { Slot } from "../types";

export function useSlot(id: string) {
  const [slot, setSlot] = useState<Slot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSlot() {
      const { data, error } = await supabase
        .from("available_slots")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        setError(error.message);
      } else {
        setSlot(data);
      }
      setLoading(false);
    }

    if (id) fetchSlot();
  }, [id]);

  return { slot, loading, error };
}
