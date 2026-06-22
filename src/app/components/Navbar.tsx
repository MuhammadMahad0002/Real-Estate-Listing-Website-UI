import { useState, useEffect } from "react";
import { Home, User, LogOut, Menu, X } from "lucide-react";

interface NavbarProps {
  userName: string | null;
  onLoginClick: () => void;
  onSignupClick: () => void;
  onLogout: () => void;
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({
  userName,
  onLoginClick,
  onSignupClick,
  onLogout,
  currentPage,
  onNavigate,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenu, setUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { id: "home",       label: "Home",       navigateTo: "home"     },
    { id: "properties", label: "Properties", navigateTo: "listings" },
    { id: "about",      label: "About",      navigateTo: "about"    },
    { id: "contact",    label: "Contact",    navigateTo: "contact"  },
  ];

  // "listings" screen should light up the "Properties" nav item
  const activeLink =
    currentPage === "listings" ? "properties" : currentPage;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-[#0A1628] shadow-lg" : "bg-[#0A1628]/95"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[#D4A853] flex items-center justify-center">
              <Home className="w-4 h-4 text-[#0A1628]" />
            </div>
            <span
              className="text-white text-lg"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700 }}
            >
              PropPakistan
            </span>
          </button>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const isActive = activeLink === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onNavigate(link.navigateTo)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all duration-200 ${
                    isActive
                      ? "text-[#D4A853]"
                      : "text-white/80 hover:text-white hover:bg-white/10"
                  }`}
                  style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: isActive ? 700 : 500,
                  }}
                >
                  {link.label}
                  {isActive && (
                    <div className="mx-auto mt-0.5 w-1 h-1 rounded-full bg-[#D4A853]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {userName ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
                >
                  <div className="w-7 h-7 rounded-full bg-[#D4A853] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#0A1628]" />
                  </div>
                  <span
                    className="text-white text-sm"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                  >
                    {userName}
                  </span>
                </button>
                {userMenu && (
                  <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                    <button
                      onClick={() => { setUserMenu(false); onLogout(); }}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 500 }}
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={onLoginClick}
                  className="px-4 py-2 rounded-lg text-white text-sm border border-white/30 hover:border-white/60 hover:bg-white/10 transition-all"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                >
                  Login
                </button>
                <button
                  onClick={onSignupClick}
                  className="px-4 py-2 rounded-lg text-[#0A1628] text-sm transition-all hover:brightness-110"
                  style={{
                    background: "#D4A853",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#0A1628] border-t border-white/10 px-4 py-4 space-y-2">
          {links.map((link) => {
            const isActive = activeLink === link.id;
            return (
            <button
              key={link.id}
              onClick={() => { onNavigate(link.navigateTo); setMobileOpen(false); }}
              className={`block w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-[#D4A853]/20 text-[#D4A853]"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: isActive ? 700 : 500 }}
            >
              {link.label}
            </button>
            );
          })}
          <div className="pt-2 flex gap-3">
            {userName ? (
              <button
                onClick={() => { onLogout(); setMobileOpen(false); }}
                className="flex-1 py-2.5 rounded-lg text-red-400 border border-red-400/30 text-sm"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
              >
                Sign Out
              </button>
            ) : (
              <>
                <button
                  onClick={() => { onLoginClick(); setMobileOpen(false); }}
                  className="flex-1 py-2.5 rounded-lg text-white border border-white/30 text-sm"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600 }}
                >
                  Login
                </button>
                <button
                  onClick={() => { onSignupClick(); setMobileOpen(false); }}
                  className="flex-1 py-2.5 rounded-lg text-[#0A1628] text-sm"
                  style={{
                    background: "#D4A853",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700,
                  }}
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
