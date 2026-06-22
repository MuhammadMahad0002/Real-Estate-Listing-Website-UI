import { useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import { CustomerAuthModal } from "./CustomerAuthModal";

export default function NavbarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Auth modal is NEVER triggered from nav buttons (RULE 3)
  // It is ONLY triggered by "Schedule a Visit" in ListingPage
  const handleLoginClick = useCallback(() => {
    // No-op: auth is only triggered by "Schedule a Visit" (RULE 3)
  }, []);

  const handleSignupClick = useCallback(() => {
    // No-op: auth is only triggered by "Schedule a Visit" (RULE 3)
  }, []);

  const handleAuthSuccess = useCallback((name: string, email: string) => {
    login(name, email);
    setShowAuthModal(false);
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const handleNavigate = useCallback((page: string) => {
    const routeMap: Record<string, string> = {
      home: "/",
      listings: "/properties",
      about: "/about",
      contact: "/contact",
    };
    navigate(routeMap[page] || "/");
  }, [navigate]);

  const path = location.pathname;
  const currentPage = path === "/" ? "home" :
    path.startsWith("/properties") ? "listings" :
    path.startsWith("/about") ? "about" :
    path.startsWith("/contact") ? "contact" : "home";

  return (
    <>
      <div className="min-h-screen bg-[#F5F7FA]">
        <Navbar
          userName={user?.name ?? null}
          onLoginClick={handleLoginClick}
          onSignupClick={handleSignupClick}
          onLogout={handleLogout}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        <div className="pt-16">
          <Outlet />
        </div>
      </div>
      {showAuthModal && (
        <CustomerAuthModal
          onLogin={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
