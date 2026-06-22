import { useState } from "react";
import { Eye, EyeOff, Home, Mail, Lock, User, Phone } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface AuthPageProps {
  onLogin: (name: string) => void;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  phone?: string;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<FormErrors>({});

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [signupErrors, setSignupErrors] = useState<FormErrors>({});

  const validateEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "" : "Enter a valid email address.";

  const validateLogin = () => {
    const e: FormErrors = {};
    if (!loginEmail) e.email = "Email is required.";
    else if (validateEmail(loginEmail)) e.email = validateEmail(loginEmail);
    if (!loginPassword) e.password = "Password is required.";
    else if (loginPassword.length < 6) e.password = "Minimum 6 characters.";
    setLoginErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateSignup = () => {
    const e: FormErrors = {};
    if (!fullName.trim()) e.fullName = "Full name is required.";
    if (!email) e.email = "Email is required.";
    else if (validateEmail(email)) e.email = validateEmail(email);
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "Minimum 8 characters.";
    if (!confirmPassword) e.confirmPassword = "Please confirm your password.";
    else if (confirmPassword !== password)
      e.confirmPassword = "Passwords do not match.";
    if (!phone.trim()) e.phone = "Phone number is required.";
    else if (!/^(\+92|0)[0-9]{10}$/.test(phone.replace(/\s/g, "")))
      e.phone = "Enter a valid Pakistani mobile number.";
    setSignupErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      onLogin(loginEmail.split("@")[0]);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignup()) {
      onLogin(fullName);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&h=1000&fit=crop&auto=format)",
        }}
      />
      <div className="absolute inset-0 bg-[#0A1628]/80 backdrop-blur-[2px]" />

      {/* Logo top left */}
      <div className="absolute top-6 left-8 flex items-center gap-2 z-10">
        <div className="w-9 h-9 rounded-lg bg-[#D4A853] flex items-center justify-center">
          <Home className="w-5 h-5 text-[#0A1628]" />
        </div>
        <span
          className="text-white text-xl"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
        >
          PropPakistan
        </span>
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md mx-4"
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-4 text-sm transition-all duration-200 relative"
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700,
                  color: tab === t ? "#0A1628" : "#9CA3AF",
                }}
              >
                {t === "login" ? "Login" : "Sign Up"}
                {tab === t && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4A853]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            <AnimatePresence mode="wait">
              {tab === "login" ? (
                <motion.form
                  key="login"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 16 }}
                  transition={{ duration: 0.22 }}
                  onSubmit={handleLogin}
                  noValidate
                >
                  <h2
                    className="text-2xl text-[#0A1628] mb-1"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                  >
                    Welcome back
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Login to access your PropPakistan account
                  </p>

                  <Field
                    icon={<Mail className="w-4 h-4" />}
                    label="Email Address"
                    type="email"
                    value={loginEmail}
                    onChange={setLoginEmail}
                    placeholder="you@example.com"
                    error={loginErrors.email}
                  />
                  <PasswordField
                    label="Password"
                    value={loginPassword}
                    onChange={setLoginPassword}
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    placeholder="Enter your password"
                    error={loginErrors.password}
                  />

                  <div className="flex justify-end mb-6">
                    <button
                      type="button"
                      className="text-sm text-[#D4A853] hover:text-[#B8893A] transition-colors"
                      style={{ fontFamily: "'Inter', sans-serif", fontWeight: 500 }}
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-[#0A1628] transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
                    style={{
                      background: "#D4A853",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    Login to Account
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-5">
                    Don't have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("signup")}
                      className="text-[#D4A853] hover:underline"
                      style={{ fontWeight: 600 }}
                    >
                      Sign Up
                    </button>
                  </p>
                </motion.form>
              ) : (
                <motion.form
                  key="signup"
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -16 }}
                  transition={{ duration: 0.22 }}
                  onSubmit={handleSignup}
                  noValidate
                >
                  <h2
                    className="text-2xl text-[#0A1628] mb-1"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
                  >
                    Create account
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Join thousands of property seekers across Pakistan
                  </p>

                  <Field
                    icon={<User className="w-4 h-4" />}
                    label="Full Name"
                    type="text"
                    value={fullName}
                    onChange={setFullName}
                    placeholder="Muhammad Ali Khan"
                    error={signupErrors.fullName}
                  />
                  <Field
                    icon={<Mail className="w-4 h-4" />}
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="you@example.com"
                    error={signupErrors.email}
                  />
                  <PasswordField
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    show={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                    placeholder="Minimum 8 characters"
                    error={signupErrors.password}
                  />
                  <PasswordField
                    label="Confirm Password"
                    value={confirmPassword}
                    onChange={setConfirmPassword}
                    show={showConfirm}
                    onToggle={() => setShowConfirm(!showConfirm)}
                    placeholder="Re-enter your password"
                    error={signupErrors.confirmPassword}
                  />
                  <Field
                    icon={<Phone className="w-4 h-4" />}
                    label="Phone Number"
                    type="tel"
                    value={phone}
                    onChange={setPhone}
                    placeholder="+92 300 1234567"
                    error={signupErrors.phone}
                  />

                  <button
                    type="submit"
                    className="w-full py-3 rounded-lg text-[#0A1628] transition-all duration-200 hover:brightness-110 active:scale-[0.98] mt-2"
                    style={{
                      background: "#D4A853",
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    Create Account
                  </button>

                  <p className="text-center text-sm text-gray-500 mt-5">
                    Already have an account?{" "}
                    <button
                      type="button"
                      onClick={() => setTab("login")}
                      className="text-[#D4A853] hover:underline"
                      style={{ fontWeight: 600 }}
                    >
                      Login
                    </button>
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Field({
  icon,
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="mb-4">
      <label
        className="block text-xs text-[#0A1628] mb-1.5"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 transition-colors ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 bg-[#F5F7FA] focus-within:border-[#D4A853]"
        }`}
      >
        <span className="text-gray-400 flex-shrink-0">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  onToggle,
  placeholder,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggle: () => void;
  placeholder: string;
  error?: string;
}) {
  return (
    <div className="mb-4">
      <label
        className="block text-xs text-[#0A1628] mb-1.5"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
      >
        {label}
      </label>
      <div
        className={`flex items-center gap-2 border rounded-lg px-3 py-2.5 transition-colors ${
          error ? "border-red-400 bg-red-50" : "border-gray-200 bg-[#F5F7FA] focus-within:border-[#D4A853]"
        }`}
      >
        <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400"
          style={{ fontFamily: "'Inter', sans-serif" }}
        />
        <button
          type="button"
          onClick={onToggle}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      {error && (
        <p className="text-red-500 text-xs mt-1" style={{ fontFamily: "'Inter', sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
