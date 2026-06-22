import { useEffect, useState, ComponentType } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader } from "lucide-react";

export function withAuthGuard<P extends object>(WrappedComponent: ComponentType<P>) {
  return function AuthGuard(props: P) {
    const { isLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (!isLoggedIn) {
        const timer = setTimeout(() => {
          navigate("/auth");
        }, 500);
        return () => clearTimeout(timer);
      } else {
        setLoading(false);
      }
    }, [isLoggedIn, navigate]);

    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
          <div className="flex flex-col items-center gap-3">
            <Loader className="w-8 h-8 text-[#D4A853] animate-spin" />
            <p
              className="text-gray-500 text-sm"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Checking authentication...
            </p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
