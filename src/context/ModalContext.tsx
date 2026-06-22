import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import type { Property } from "../app/components/data";

interface ModalContextValue {
  scheduleProperty: Property | null;
  openScheduleModal: (property: Property) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [scheduleProperty, setScheduleProperty] = useState<Property | null>(null);

  const openScheduleModal = useCallback((property: Property) => {
    setScheduleProperty(property);
  }, []);

  const closeModal = useCallback(() => {
    setScheduleProperty(null);
  }, []);

  return (
    <ModalContext.Provider value={{ scheduleProperty, openScheduleModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within ModalProvider");
  return ctx;
}
