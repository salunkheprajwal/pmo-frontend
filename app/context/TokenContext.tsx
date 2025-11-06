'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type TokenContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

const TokenContext = createContext<TokenContextType | undefined>(undefined);

export function TokenProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from localStorage if we're in the browser
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Set initialized flag after hydration
    setIsInitialized(true);
  }, []);

  const updateToken = (newToken: string | null) => {
    if (typeof window !== 'undefined') {
      if (newToken) {
        localStorage.setItem('token', newToken);
      } else {
        localStorage.removeItem('token');
      }
      setToken(newToken);
    }
  };

  return (
    <TokenContext.Provider value={{ token, setToken: updateToken }}>
      {children}
    </TokenContext.Provider>
  );
}

export function useToken() {
  const context = useContext(TokenContext);
  if (context === undefined) {
    throw new Error('useToken must be used within a TokenProvider');
  }
  return context;
}