import { useState } from "react";
import { X, Lock, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredAdminPassword, setStoredAdminPassword } from "../../utils/passwordUtils";

interface AdminChangePasswordModalProps {
  onClose: () => void;
}

export function AdminChangePasswordModal({ onClose }: AdminChangePasswordModalProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const stored = getStoredAdminPassword();
    if (currentPassword !== stored) {
      setError("Current password is incorrect.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    setStoredAdminPassword(newPassword);
    setSuccess(true);
    setTimeout(() => onClose(), 1500);
  };

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
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <h3
              className="text-white text-lg"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              Change Admin Password
            </h3>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            {success && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
                <span>Password changed successfully!</span>
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span style={{ fontFamily: "'Inter', sans-serif" }}>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                Current Password
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="text-gray-400 hover:text-gray-600">
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                New Password
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="text-gray-400 hover:text-gray-600">
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                Confirm New Password
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-[#0A1628] text-sm transition-all hover:brightness-110 active:scale-[0.98]"
              style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              Update Password
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
