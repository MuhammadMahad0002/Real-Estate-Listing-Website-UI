import { useState, useCallback } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Navbar } from "./Navbar";
import { useAuth } from "../../hooks/useAuth";
import { CustomerAuthModal } from "../components/modals/CustomerAuthModal";
import { ChangePasswordModal } from "../components/ChangePasswordModal";

export default function NavbarLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "signup">("login");

  const handleLoginClick = useCallback(() => {
    setAuthTab("login");
    setShowAuthModal(true);
  }, []);

  const handleSignupClick = useCallback(() => {
    setAuthTab("signup");
    setShowAuthModal(true);
  }, []);

  const handleAuthSuccess = useCallback((name: string, email: string) => {
    login(name, email);
    setShowAuthModal(false);
  }, [login]);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  const handleChangePassword = useCallback(() => {
    setShowChangePassword(true);
  }, []);

  const handleNavigate = useCallback((page: string) => {
    const routeMap: Record<string, string> = {
      home: "/home",
      listings: "/properties",
      about: "/about",
      contact: "/contact",
    };
    navigate(routeMap[page] || "/");
  }, [navigate]);

  const path = location.pathname;
  const currentPage = path === "/" ? "home" :
    path.startsWith("/home") ? "home" :
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
          onChangePassword={handleChangePassword}
          onLogoClick={() => navigate("/")}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
        <div className="pt-16">
          <Outlet />
        </div>
      </div>
      {showAuthModal && (
        <CustomerAuthModal
          initialTab={authTab}
          onLogin={handleAuthSuccess}
          onClose={() => setShowAuthModal(false)}
        />
      )}
      {showChangePassword && (
        <ChangePasswordModal
          email={user?.email ?? ""}
          onClose={() => setShowChangePassword(false)}
        />
      )}
    </>
  );
}
