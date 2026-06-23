import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn || !user) {
    return <Navigate to="/auth?tab=login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to their correct panel
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "visitAgent") return <Navigate to="/visit-agent" replace />;
    return <Navigate to="/properties" replace />;
  }

  return <>{children}</>;
}
