import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { AdminPanel } from "./AdminPanel";

export default function AdminPanelWrapper() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  return (
    <AdminPanel
      userName={user?.name ?? null}
      onLogout={() => {
        logout();
        navigate("/");
      }}
      onBack={() => navigate("/")}
    />
  );
}
