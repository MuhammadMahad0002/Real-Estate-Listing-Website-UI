import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAuth } from "../../hooks/useAuth";

export default function NavbarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const handleLoginClick = () => {
    navigate("/auth");
  };

  const handleSignupClick = () => {
    navigate("/auth");
  };

  const handleNavigate = (page: string) => {
    const routeMap: Record<string, string> = {
      home: "/home",
      listings: "/properties",
      about: "/about",
      contact: "/contact",
    };
    navigate(routeMap[page] || "/home");
  };

  const path = location.pathname;
  const currentPage = path === "/home" ? "home" :
    path.startsWith("/properties") ? "listings" :
    path.startsWith("/about") ? "about" :
    path.startsWith("/contact") ? "contact" : "home";

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <Navbar
        userName={user?.name ?? null}
        onLoginClick={handleLoginClick}
        onSignupClick={handleSignupClick}
        onLogout={() => {
          logout();
          navigate("/");
        }}
        currentPage={currentPage}
        onNavigate={handleNavigate}
      />
      <div className="pt-16">
        <Outlet />
      </div>
    </div>
  );
}
