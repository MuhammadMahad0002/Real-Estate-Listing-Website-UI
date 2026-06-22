import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { HomePage } from "./HomePage";

export default function HomePageWrapper() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <div data-aos="fade-in">
      <HomePage
        onExplore={() => navigate("/properties")}
        onSignup={() => navigate("/auth")}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
}
