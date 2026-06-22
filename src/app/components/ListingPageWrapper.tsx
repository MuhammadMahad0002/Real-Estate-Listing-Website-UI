import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { ListingPage } from "./ListingPage";

export default function ListingPageWrapper() {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();

  return (
    <ListingPage
      userName={isLoggedIn ? "User" : null}
      onLoginRequired={() => navigate("/auth")}
    />
  );
}
