"use client";

import { createContext, useContext, useState } from "react";

type MobileSidebarContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const MobileSidebarContext = createContext<MobileSidebarContextValue | null>(null);

export function useMobileSidebar() {
  const context = useContext(MobileSidebarContext);

  if (!context) {
    throw new Error("useMobileSidebar must be used within MobileSidebarProvider");
  }

  return context;
}

export default function MobileSidebarProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <MobileSidebarContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </MobileSidebarContext.Provider>
  );
}
