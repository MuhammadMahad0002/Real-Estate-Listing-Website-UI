import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SplitLanding } from "./SplitLanding";

export default function SplitLandingWrapper() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const [initialized, setInitialized] = useState(false);

  // On mount, restore session
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      if (isLoggedIn && user) {
        if (user.role === "admin") {
          navigate("/admin", { replace: true });
        } else if (user.role === "visitAgent") {
          navigate("/visit-agent", { replace: true });
        } else {
          navigate("/properties", { replace: true });
        }
      }
    }
  }, [initialized, isLoggedIn, user, navigate]);

  if (isLoggedIn && initialized) {
    return null;
  }

  return (
    <SplitLanding
      onExplore={() => navigate("/home")}
      onSignIn={() => navigate("/auth?tab=login")}
      onSignUp={() => navigate("/auth?tab=signup")}
    />
  );
}
