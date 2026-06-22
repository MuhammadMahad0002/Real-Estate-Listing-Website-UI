import { useState } from "react";
import { X, Lock, Mail, Eye, EyeOff, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getStoredAdminPassword } from "../../utils/passwordUtils";

interface AdminLoginModalProps {
  onLogin: (name: string) => void;
  onClose: () => void;
}

const ADMIN_EMAIL = "admin@realty.com";

export function AdminLoginModal({ onLogin, onClose }: AdminLoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }
    if (!password.trim()) {
      setError("Password is required.");
      return;
    }
    if (email.trim() !== ADMIN_EMAIL || password !== getStoredAdminPassword()) {
      setError("Invalid email or password. Please try again.");
      return;
    }

    onLogin("Admin");
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0A1628]/70 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 20 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-[#0A1628] px-6 py-5 flex items-center justify-between">
            <div>
              <h3
                className="text-white text-lg"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
              >
                Admin Sign In
              </h3>
              <p className="text-white/50 text-sm mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
                Agent & Owner portal
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4" noValidate>
            {error && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                <span style={{ fontFamily: "'Inter', sans-serif" }}>{error}</span>
              </div>
            )}

            {/* Email */}
            <div>
              <label
                className="block text-xs text-[#0A1628] mb-1.5"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              >
                Email Address
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@realty.com"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                className="block text-xs text-[#0A1628] mb-1.5"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              >
                Password
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg text-[#0A1628] text-sm transition-all hover:brightness-110 active:scale-[0.98]"
              style={{
                background: "#D4A853",
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700,
              }}
            >
              Sign In to Dashboard
            </button>

            {/* Note: NO sign-up link, NO register button, NO "create account" option */}
            <p className="text-center text-xs text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
              Authorized agents & owners only
            </p>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
