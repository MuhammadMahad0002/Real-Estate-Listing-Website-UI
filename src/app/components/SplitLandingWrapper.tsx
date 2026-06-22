import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { useAuth } from "../../hooks/useAuth";
import { SplitLanding } from "./SplitLanding";
import { AdminLoginModal } from "./AdminLoginModal";

export default function SplitLandingWrapper() {
  const navigate = useNavigate();
  const { isAdminLoggedIn, loginAdmin } = useAdminAuth();
  const { isLoggedIn } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // On mount, restore session: admin → dashboard, customer → listings
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      if (isAdminLoggedIn) {
        navigate("/admin", { replace: true });
      } else if (isLoggedIn) {
        navigate("/properties", { replace: true });
      }
    }
  }, [initialized, isAdminLoggedIn, isLoggedIn, navigate]);

  // If sessions are restored by the time we check, show the split screen
  if ((isAdminLoggedIn || isLoggedIn) && initialized) {
    // Sessions exist but we don't redirect — the useEffect above already did
    // This prevents flash of split screen before redirect
    return null;
  }

  return (
    <>
      <SplitLanding
        onExplore={() => navigate("/properties")}
        onAdmin={() => {
          if (isAdminLoggedIn) {
            navigate("/admin");
          } else {
            setShowAdminLogin(true);
          }
        }}
      />
      {showAdminLogin && (
        <AdminLoginModal
          onLogin={(name) => {
            loginAdmin(name);
            setShowAdminLogin(false);
            navigate("/admin");
          }}
          onClose={() => setShowAdminLogin(false)}
        />
      )}
    </>
  );
}
