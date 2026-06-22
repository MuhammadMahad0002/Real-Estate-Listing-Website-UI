import { useState, useCallback, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ListingPage } from "./ListingPage";
import { CustomerAuthModal } from "./CustomerAuthModal";
import { ScheduleVisitModal } from "./ScheduleVisitModal";
import type { Property } from "./data";

export default function ListingPageWrapper() {
  const { user, login } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [scheduleProperty, setScheduleProperty] = useState<Property | null>(null);
  // Store the property that triggered auth so we can schedule after login
  const pendingPropertyRef = useRef<Property | null>(null);

  const handleLoginRequired = useCallback((property: Property) => {
    pendingPropertyRef.current = property;
    setShowAuthModal(true);
  }, []);

  const handleAuthSuccess = useCallback((name: string, email: string) => {
    login(name, email);
    setShowAuthModal(false);
    // After successful auth, immediately open the schedule modal for the pending property
    if (pendingPropertyRef.current) {
      setScheduleProperty(pendingPropertyRef.current);
      pendingPropertyRef.current = null;
    }
  }, [login]);

  const handleScheduleClose = useCallback(() => {
    setScheduleProperty(null);
  }, []);

  return (
    <>
      <ListingPage
        userName={user?.name ?? null}
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
          propertyTitle={scheduleProperty.title}
          propertyLocation={scheduleProperty.location}
          userName={user?.name ?? null}
          onClose={handleScheduleClose}
        />
      )}
    </>
  );
}
