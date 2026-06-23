import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useAppDispatch } from "../../store/hooks";
import { logoutUser } from "../../store/authSlice";
import { VisitAgentPanel } from "./VisitAgentPanel";

export default function VisitAgentPanelWrapper() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const handleLogout = useCallback(() => {
    dispatch(logoutUser());
    navigate("/");
  }, [dispatch, navigate]);

  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const handleNavigateHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  return (
    <VisitAgentPanel
      userName={user?.fullName ?? null}
      userEmail={user?.email ?? ""}
      userPhone={user?.phone ?? ""}
      onLogout={handleLogout}
      onBack={handleBack}
      onNavigateHome={handleNavigateHome}
    />
  );
}
