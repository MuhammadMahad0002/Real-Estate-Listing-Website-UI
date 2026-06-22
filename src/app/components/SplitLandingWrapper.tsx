import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { SplitLanding } from "./SplitLanding";

export default function SplitLandingWrapper() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <SplitLanding
      onExplore={() => navigate("/home")}
      onAdmin={() => {
        if (isLoggedIn) {
          navigate("/admin");
        } else {
          navigate("/auth");
        }
      }}
    />
  );
}
