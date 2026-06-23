import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { HomePage } from "./HomePage";
import { CustomerAuthModal } from "../components/modals/CustomerAuthModal";

export default function HomePageWrapper() {
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <div data-aos="fade-in">
        <HomePage
          onExplore={() => navigate("/properties")}
          onSignup={() => setShowAuthModal(true)}
          isLoggedIn={isLoggedIn}
        />
      </div>
      {showAuthModal && (
        <CustomerAuthModal
          onLogin={(name, email) => {
            login(name, email);
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </>
  );
}
