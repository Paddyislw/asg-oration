"use client";

import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/auth/user-menu";
import { History, Sparkles } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-between p-6 border-b border-border/50 bg-gradient-to-r from-card via-card to-card/95 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg">
          <Sparkles className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Career Counseling AI
          </h1>
          <p className="text-sm text-muted-foreground">
            Your AI-powered career guidance assistant
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {pathname !== "/sessions" && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/sessions")}
            className="flex items-center gap-2 hover:bg-accent/50 transition-colors shadow-sm"
          >
            <History className="h-4 w-4" />
            View All Sessions
          </Button>
        )}
        <UserMenu />
      </div>
    </div>
  );
}