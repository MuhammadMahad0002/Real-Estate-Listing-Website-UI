import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Loader } from "./components/Loader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { useModal } from "../context/ModalContext";
import { ScheduleVisitModal } from "./components/ScheduleVisitModal";

const SplitLanding = lazy(() => import("./components/SplitLandingWrapper"));
const HomePage = lazy(() => import("./components/HomePageWrapper"));
const ListingPage = lazy(() => import("./components/ListingPageWrapper"));
const AdminPanel = lazy(() => import("./components/AdminPanelWrapper"));
const NavbarLayout = lazy(() => import("./components/NavbarLayout"));
const SimplePage = lazy(() => import("./components/SimplePage"));

export default function App() {
  const { scheduleProperty, closeModal } = useModal();

  return (
    <>
      <ErrorBoundary>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<SplitLanding />} />
            <Route path="/home" element={<NavbarLayout />}>
              <Route index element={<HomePage />} />
            </Route>
            <Route path="/properties" element={<NavbarLayout />}>
              <Route index element={
                <ErrorBoundary>
                  <ListingPage />
                </ErrorBoundary>
              } />
            </Route>
            <Route path="/about" element={<NavbarLayout />}>
              <Route index element={<SimplePage />} />
            </Route>
            <Route path="/contact" element={<NavbarLayout />}>
              <Route index element={<SimplePage />} />
            </Route>
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      {/* ScheduleVisitModal rendered at App level via ModalContext */}
      {scheduleProperty && (
        <ScheduleVisitModal
          propertyTitle={scheduleProperty.title}
          propertyLocation={scheduleProperty.location}
          userName={null}
          onClose={closeModal}
        />
      )}
    </>
  );
}
