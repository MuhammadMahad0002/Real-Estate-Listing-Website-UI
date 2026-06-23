import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { AdminPanel } from "./AdminPanel";
import { AdminChangePasswordModal } from "../components/AdminChangePasswordModal";

export default function AdminPanelWrapper() {
  const navigate = useNavigate();
  const { adminName, logoutAdmin } = useAdminAuth();
  const [showChangePassword, setShowChangePassword] = useState(false);

  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <>
      <AdminPanel
        userName={adminName ?? null}
        onLogout={() => {
          logoutAdmin();
          navigate("/");
        }}
        onBack={() => navigate("/")}
        onNavigateHome={handleNavigateHome}
        onChangePassword={() => setShowChangePassword(true)}
      />
      {showChangePassword && (
        <AdminChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </>
  );
}
