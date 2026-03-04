"use client";

import React, { createContext, useContext } from "react";
import { useAuth } from "@/components/providers/AuthProvider";

export type Role = "user" | "mentor" | "tl" | "admin";

interface RoleContextType {
  role: Role;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useAuth();
  const role: Role = profile?.role || "user";

  return (
    <RoleContext.Provider value={{ role }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
