import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AuthPage } from "./AuthPage";

export default function AuthPageWrapper() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = (name: string) => {
    login(name, `${name}@email.com`);
    navigate("/home");
  };

  return (
    <div className="relative min-h-screen">
      <AuthPage onLogin={handleLogin} />
      <div className="absolute top-6 right-8 z-20">
        <button
          onClick={() => navigate("/")}
          className="text-white/60 hover:text-white text-sm transition-colors flex items-center gap-1.5"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
