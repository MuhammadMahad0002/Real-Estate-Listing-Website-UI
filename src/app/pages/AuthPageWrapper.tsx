import { useSearchParams } from "react-router-dom";
import { AuthPage } from "./AuthPage";

export default function AuthPageWrapper() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") as "login" | "signup" | null;

  return <AuthPage activeTab={tab ?? "login"} />;
}
