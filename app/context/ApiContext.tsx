"use client";
import React, { createContext, useContext, ReactNode } from "react";
import api from "../utils/api";

const ApiContext = createContext(api);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};