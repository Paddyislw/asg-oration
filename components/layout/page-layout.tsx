"use client";

import { AppHeader } from "./app-header";
import { MobileHeader } from "./mobile-header";

interface PageLayoutProps {
  children: React.ReactNode;
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
  showSidebarToggle?: boolean;
}

export function PageLayout({
  children,
  sidebarOpen,
  setSidebarOpen,
  showSidebarToggle = false
}: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Headers */}
      {showSidebarToggle ? (
        <MobileHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />
      ) : (
        <MobileHeader />
      )}
      <div className="hidden lg:block">
        <AppHeader />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}