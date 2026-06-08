import { useState } from "react";
import { supabase } from "../lib/supabase";
import styles from "./BookingForm.module.css";

interface Props {
  slotId: string;
  onSuccess: (name: string, email: string, phone: string) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

function BookingForm({ slotId, onSuccess }: Props) {
  const [form, setForm] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function validate(): boolean {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Full name is required";
    if (!form.email.trim()) {
      next.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address";
    }
    if (!form.phone.trim()) next.phone = "Phone number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleChange(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setSubmitError(null);

    const { error: bookingError } = await supabase.from("bookings").insert({
      slot_id: slotId,
      customer_name: form.name.trim(),
      customer_email: form.email.trim(),
      customer_phone: form.phone.trim(),
    });

    if (bookingError) {
      setSubmitError("Could not save your booking. Please try again.");
      setSubmitting(false);
      return;
    }

    const { error: slotError } = await supabase
      .from("available_slots")
      .update({ is_available: false })
      .eq("id", slotId);

    if (slotError) {
      setSubmitError("Booking saved but an error occurred. Please contact us.");
      setSubmitting(false);
      return;
    }

    onSuccess(form.name.trim(), form.email.trim(), form.phone.trim());
  }

  return (
    <form onSubmit={handleSubmit} className={styles.form} noValidate>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>
          Full Name
        </label>
        <input
          id="name"
          type="text"
          className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
          value={form.name}
          onChange={handleChange("name")}
          disabled={submitting}
          placeholder="Michael Jordan"
        />
        {errors.name && <p className={styles.errorText}>{errors.name}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email Address
        </label>
        <input
          id="email"
          type="email"
          className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
          value={form.email}
          onChange={handleChange("email")}
          disabled={submitting}
          placeholder="michael@jordan.com"
        />
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone" className={styles.label}>
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          className={`${styles.input} ${errors.phone ? styles.inputError : ""}`}
          value={form.phone}
          onChange={handleChange("phone")}
          disabled={submitting}
          placeholder="+46 70 123 45 67"
        />
        {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
      </div>

      {submitError && <p className={styles.submitError}>{submitError}</p>}

      <button type="submit" className={styles.button} disabled={submitting}>
        {submitting ? "Confirming..." : "Confirm Booking"}
      </button>
    </form>
  );
}

export default BookingForm;
