import React, { createContext, useContext, useEffect, useState } from "react";

export type CampusScope = "national" | "university" | "campus";

export interface CampusState {
  scope: CampusScope;
  universitySlug?: string;
  campusSlug?: string;
  universityName?: string;
  campusName?: string;
}

interface CampusContextValue extends CampusState {
  setCampusContext: (state: CampusState) => void;
  resetToNational: () => void;
}

const CampusContext = createContext<CampusContextValue | undefined>(undefined);

const STORAGE_KEY = "weave:campus_context";

export function CampusProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<CampusState>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      }
    } catch (err) {
      console.warn("Failed to parse campus context from storage", err);
    }
    return { scope: "national" };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn("Failed to save campus context to storage", err);
    }
  }, [state]);

  const setCampusContext = (newState: CampusState) => setState(newState);
  const resetToNational = () => setState({ scope: "national" });

  return (
    <CampusContext.Provider value={{ ...state, setCampusContext, resetToNational }}>
      {children}
    </CampusContext.Provider>
  );
}

export function useCampus() {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error("useCampus must be used within a CampusProvider");
  }
  return context;
}
