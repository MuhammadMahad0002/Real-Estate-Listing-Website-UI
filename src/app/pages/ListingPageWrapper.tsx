import { useState, useCallback, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ListingPage } from "./ListingPage";
import { CustomerAuthModal } from "../components/modals/CustomerAuthModal";
import { ScheduleVisitModal } from "../components/modals/ScheduleVisitModal";
import type { Property } from "../data/data";

export default function ListingPageWrapper() {
  const { user, isLoggedIn } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scheduleProperty, setScheduleProperty] = useState<Property | null>(null);
  // Store the property that triggered auth so we can schedule after login
  const pendingPropertyRef = useRef<Property | null>(null);

  const handleLoginRequired = useCallback((property: Property) => {
    pendingPropertyRef.current = property;
    setShowAuthModal(true);
  }, []);

  const handleAuthSuccess = useCallback((_role: string) => {
    setShowAuthModal(false);
    // After successful auth, immediately open the schedule modal for the pending property
    if (pendingPropertyRef.current) {
      setScheduleProperty(pendingPropertyRef.current);
      pendingPropertyRef.current = null;
    }
  }, []);

  const handleScheduleClose = useCallback(() => {
    setScheduleProperty(null);
  }, []);

  return (
    <>
      <ListingPage
        userName={user?.fullName ?? null}
        onLoginRequired={handleLoginRequired}
      />
      {showAuthModal && (
        <CustomerAuthModal
          onLogin={handleAuthSuccess}
          onClose={() => {
            setShowAuthModal(false);
            pendingPropertyRef.current = null;
          }}
        />
      )}
      {scheduleProperty && (
        <ScheduleVisitModal
          propertyId={scheduleProperty.id?.toString() || ""}
          propertyTitle={scheduleProperty.title}
          propertyLocation={scheduleProperty.location}
          propertyImage={scheduleProperty.image}
          userName={user?.fullName ?? null}
          onClose={handleScheduleClose}
        />
      )}
    </>
  );
}
