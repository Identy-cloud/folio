"use client";

import { createContext, useContext, useState, useCallback } from "react";

interface WorkspaceContextValue {
  activeWorkspaceId: string | null;
  setActiveWorkspaceId: (id: string | null) => void;
}

const WorkspaceContext = createContext<WorkspaceContextValue>({
  activeWorkspaceId: null,
  setActiveWorkspaceId: () => {},
});

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkspaceId, setRaw] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("folio-active-workspace") ?? null;
  });

  const setActiveWorkspaceId = useCallback((id: string | null) => {
    setRaw(id);
    if (id) {
      localStorage.setItem("folio-active-workspace", id);
    } else {
      localStorage.removeItem("folio-active-workspace");
    }
  }, []);

  return (
    <WorkspaceContext.Provider value={{ activeWorkspaceId, setActiveWorkspaceId }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  return useContext(WorkspaceContext);
}
