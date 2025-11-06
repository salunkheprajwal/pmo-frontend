
// Layout.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/shared/Header";
import Sidebar from "../components/shared/Sidebar";
import { ThemeProvider } from "../components/ThemeProvider";
import { useAuthProtection } from "../context/useAuthProtection";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = useAuthProtection();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Add a small delay to prevent flash of content
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no token, don't render the layout
  if (!token) {
    return null;
  }

  return (
    <ThemeProvider>
      <div className="flex h-screen">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div className="flex-1 flex flex-col">
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout;