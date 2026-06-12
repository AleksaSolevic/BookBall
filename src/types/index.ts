export interface Coach {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

export interface Slot {
  id: string;
  coach_id: string;
  date: string;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
}

export interface Booking {
  id: string;
  slot_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  status: "confirmed" | "cancelled";
  created_at: string;
}

export interface BookingWithSlot extends Booking {
  available_slots: {
    date: string;
    start_time: string;
    end_time: string;
  };
}
