import { useState } from "react";
import { X, Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { setCustomerPassword, getCustomerPassword } from "../../utils/passwordUtils";

interface CustomerAuthModalProps {
  onLogin: (name: string, email: string) => void;
  onClose: () => void;
  initialTab?: "login" | "signup";
}

export function CustomerAuthModal({ onLogin, onClose, initialTab }: CustomerAuthModalProps) {
  const [tab, setTab] = useState<"login" | "signup">(initialTab ?? "login");

  // Login fields
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Signup fields
  const [fullName, setFullName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!loginEmail.trim()) {
      setLoginError("Email is required.");
      return;
    }
    if (!loginPassword.trim()) {
      setLoginError("Password is required.");
      return;
    }

    // Verify stored password
    const storedPassword = getCustomerPassword(loginEmail.trim());
    if (!storedPassword) {
      setLoginError("No account found with this email. Please sign up first.");
      return;
    }
    if (loginPassword !== storedPassword) {
      setLoginError("Incorrect password. Try again.");
      return;
    }

    onLogin(loginEmail.split("@")[0], loginEmail.trim());
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    if (!fullName.trim()) {
      setLoginError("Full name is required.");
      return;
    }
    if (!signupEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)) {
      setLoginError("Enter a valid email address.");
      return;
    }
    if (!signupPassword || signupPassword.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }
    if (signupPassword !== confirmPassword) {
      setLoginError("Passwords do not match.");
      return;
    }

    // Store password for future login verification
    setCustomerPassword(signupEmail.trim(), signupPassword);
    onLogin(fullName.trim(), signupEmail.trim());
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
            <h3
              className="text-white text-lg"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
            >
              {tab === "login" ? "Sign In" : "Create Account"}
            </h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setLoginError(""); }}
                className="flex-1 py-3.5 text-sm transition-all duration-200 relative"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  color: tab === t ? "#0A1628" : "#9CA3AF",
                }}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
                {tab === t && (
                  <motion.div
                    layoutId="customer-tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A853]"
                  />
                )}
              </button>
            ))}
          </div>

          {/* Body */}
          <div className="p-6">
            {loginError && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm mb-4">
                <span style={{ fontFamily: "'Inter', sans-serif" }}>{loginError}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleLogin}
                  noValidate
                >
                  <p className="text-sm text-gray-500 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Sign in to schedule a property visit
                  </p>

                  <div className="mb-4">
                    <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="email"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      Password
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-[#0A1628] text-sm transition-all hover:brightness-110 active:scale-[0.98]"
                    style={{ background: "#D4A853", fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
                  >
                    Sign In
                  </button>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.18 }}
                  onSubmit={handleSignup}
                  noValidate
                >
                  <p className="text-sm text-gray-500 mb-5" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Create an account to schedule property visits
                  </p>

                  <div className="mb-4">
                    <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      Full Name
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                      <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Muhammad Ali Khan"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      Email Address
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                      <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      Phone Number
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                      <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+92 300 1234567"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      Password
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
                        style={{ fontFamily: "'Inter', sans-serif" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignupPassword(!showSignupPassword)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="block text-xs text-[#0A1628] mb-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}>
                      Confirm Password
                    </label>
                    <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 bg-[#F5F7FA] focus-within:border-[#D4A853] transition-colors">
                      <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <input
                        type={showSignupPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Re-enter your password"
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
                    Create Account
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
