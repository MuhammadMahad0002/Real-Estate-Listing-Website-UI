import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { AdminPanel } from "./AdminPanel";

export default function AdminPanelWrapper() {
  const navigate = useNavigate();
  const { adminName, logoutAdmin } = useAdminAuth();

  return (
    <AdminPanel
      userName={adminName ?? null}
      onLogout={() => {
        logoutAdmin();
        navigate("/");
      }}
      onBack={() => navigate("/")}
    />
  );
}
