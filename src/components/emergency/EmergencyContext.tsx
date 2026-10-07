import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

interface EmergencyContextValue {
  isOpen: boolean;
  openEmergency: () => void;
  closeEmergency: () => void;
}

const EmergencyContext = createContext<EmergencyContextValue | null>(null);

/**
 * Single source of truth for the emergency dialog so every surface
 * (header button, bottom nav, safety alerts) opens the same content.
 */
export function EmergencyProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openEmergency = useCallback(() => setIsOpen(true), []);
  const closeEmergency = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ isOpen, openEmergency, closeEmergency }),
    [isOpen, openEmergency, closeEmergency],
  );

  return (
    <EmergencyContext.Provider value={value}>{children}</EmergencyContext.Provider>
  );
}

export function useEmergency(): EmergencyContextValue {
  const context = useContext(EmergencyContext);
  if (!context) {
    throw new Error("useEmergency must be used within an EmergencyProvider");
  }
  return context;
}
