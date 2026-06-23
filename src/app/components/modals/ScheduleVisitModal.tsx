import { useState } from "react";
import { X, Calendar, Clock, MapPin, MessageSquare, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import api from "../../api/axios";

interface ScheduleVisitModalProps {
  propertyId: string;
  propertyTitle: string;
  propertyLocation: string;
  propertyImage?: string;
  userName: string | null;
  userPhone?: string;
  onClose: () => void;
}

const TIME_SLOTS = ["Morning", "Afternoon", "Evening"];

export function ScheduleVisitModal({
  propertyId,
  propertyTitle,
  propertyLocation,
  propertyImage,
  userName,
  userPhone,
  onClose,
}: ScheduleVisitModalProps) {
  const [name, setName] = useState(userName || "");
  const [phone, setPhone] = useState(userPhone || "");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!phone.trim()) e.phone = "Phone is required.";
    else if (!/^(\+92|0)[0-9]{10}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Pakistani mobile number.";
    if (!date) e.date = "Please select a date.";
    else {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected < today) e.date = "Date must be today or in the future.";
    }
    if (!timeSlot) e.time = "Please select a time slot.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    try {
      setSubmitting(true);
      await api.post("/customer/schedule-visit", {
        propertyId,
        propertyTitle,
        propertyAddress: propertyLocation,
        propertyImage: propertyImage || "",
        preferredDate: date,
        timeSlot,
        notes,
      });
      setSubmitted(true);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to schedule visit. Please try again.";
      setApiError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0A1628]/70 backdrop-blur-sm"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          <div className="bg-[#0A1628] px-6 py-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-white text-lg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                  Schedule a Visit
                </h3>
                <div className="flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#D4A853]" />
                  <p className="text-white/60 text-sm">{propertyLocation}</p>
                </div>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white transition-colors mt-0.5">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-3 px-3 py-2 bg-white/10 rounded-lg">
              <p className="text-white/90 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                {propertyTitle}
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4A853]/20 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#D4A853]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl text-[#0A1628] mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
                Visit Scheduled!
              </h3>
              <p className="text-gray-500 text-sm mb-1">
                Your visit has been confirmed for{" "}
                <span className="text-[#0A1628]" style={{ fontWeight: 600 }}>
                  {new Date(date).toLocaleDateString("en-PK", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                </span>
              </p>
              <p className="text-gray-500 text-sm mb-6">
                Time: <span className="text-[#0A1628]" style={{ fontWeight: 600 }}>{timeSlot}</span>
              </p>
              <p className="text-xs text-gray-400">
                Our agent will contact you at <strong>{phone}</strong> to confirm.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-8 py-2.5 rounded-lg text-[#0A1628] text-sm"
                style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
              {apiError && (
                <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">{apiError}</div>
              )}

              <ModalField
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                label="Your Name"
                error={errors.name}
              >
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="Muhammad Ali Khan"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }} />
              </ModalField>

              <ModalField
                icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>}
                label="Phone Number"
                error={errors.phone}
              >
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }} />
              </ModalField>

              <ModalField
                icon={<Calendar className="w-4 h-4" />}
                label="Preferred Date"
                error={errors.date}
              >
                <input type="date" value={date} min={today} onChange={(e) => setDate(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800"
                  style={{ fontFamily: "'Inter', sans-serif" }} />
              </ModalField>

              <div>
                <label className="block text-xs text-[#0A1628] mb-2"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                  <Clock className="w-3.5 h-3.5 inline mr-1 mb-0.5" />
                  Preferred Time
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TIME_SLOTS.map((slot) => (
                    <button key={slot} type="button" onClick={() => setTimeSlot(slot)}
                      className={`py-2.5 px-2 rounded-lg text-xs border transition-all duration-200 ${
                        timeSlot === slot
                          ? "bg-[#D4A853] border-[#D4A853] text-[#0A1628]"
                          : "border-gray-200 text-gray-600 hover:border-[#D4A853]"
                      }`}
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      {slot}
                    </button>
                  ))}
                </div>
                {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
              </div>

              <div>
                <label className="block text-xs text-[#0A1628] mb-1.5"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                  <MessageSquare className="w-3.5 h-3.5 inline mr-1 mb-0.5" />
                  Message / Notes (optional)
                </label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  placeholder="Any special requirements or questions for the agent..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg bg-[#F5F7FA] text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#D4A853] transition-colors resize-none"
                  style={{ fontFamily: "'Inter', sans-serif" }} />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-3 rounded-lg text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 py-3 rounded-lg text-sm text-[#0A1628] transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}>
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {submitting ? "Scheduling..." : "Confirm Visit"}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

function ModalField({
  icon, label, error, children,
}: {
  icon: React.ReactNode;
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs text-[#0A1628] mb-1.5"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
        {label}
      </label>
      <div className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 transition-colors ${
        error ? "border-red-400 bg-red-50" : "border-gray-200 bg-[#F5F7FA] focus-within:border-[#D4A853]"
      }`}>
        <span className="text-gray-400 flex-shrink-0">{icon}</span>
        {children}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
