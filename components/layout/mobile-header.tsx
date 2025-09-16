"use client";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { Menu, X, History, Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface MobileHeaderProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export function MobileHeader({ sidebarOpen, setSidebarOpen }: MobileHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="lg:hidden flex items-center justify-between gap-3 p-4 border-b border-border/50 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        {setSidebarOpen && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-card-foreground hover:bg-accent/50 transition-colors"
          >
            {sidebarOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        )}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="font-semibold text-card-foreground">Career AI</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {pathname !== "/sessions" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/sessions")}
            className="text-card-foreground hover:bg-accent/50 transition-colors"
          >
            <History className="h-4 w-4" />
          </Button>
        )}
        <UserMenu />
      </div>
    </div>
  );
}