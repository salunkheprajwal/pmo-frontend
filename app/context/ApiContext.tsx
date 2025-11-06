"use client";
import React, { createContext, useContext, ReactNode, useEffect } from "react";
import api from "../utils/api";
import { ApiClient } from "../utils/api/apiClient";
import { useToken } from "./TokenContext";

const apiClient = new ApiClient();
const ApiContext = createContext(api);

export const useApi = () => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
};

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { token } = useToken();

  useEffect(() => {
    apiClient.setToken(token);
  }, [token]);

  return (
    <ApiContext.Provider value={api}>
      {children}
    </ApiContext.Provider>
  );
};