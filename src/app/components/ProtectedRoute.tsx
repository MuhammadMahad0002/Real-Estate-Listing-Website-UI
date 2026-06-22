import { Navigate } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAdminLoggedIn } = useAdminAuth();

  if (!isAdminLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
