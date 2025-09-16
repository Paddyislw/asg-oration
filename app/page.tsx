"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { ChatInterface } from "@/components/chat/chat-interface";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import { SignInForm } from "@/components/auth/sign-in-form";
import { cn } from "@/lib/utils";
import { useChat } from "@/hooks/use-chat";
import { Toaster } from "sonner";
import { Sparkles } from "lucide-react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const sessionParam = searchParams.get("session");
  const authLoading = status === "loading";
  const user = session?.user;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    currentSessionId,
    isDraftSession,
    draftSessionTitle,
    isLoading,
    isSending,
    aiThinkingPhase,
    sessions,
    messages,
    isLoadingSessions,
    isLoadingMessages,
    createSession,
    sendMessage,
    selectSession,
    updateSessionTitle,
    deleteSession,
    refetchSessions,
  } = useChat();

  useEffect(() => {
    if (
      sessionParam &&
      sessions.length > 0 &&
      session?.user?.id &&
      !currentSessionId
    ) {
      const sessionExists = sessions.find((s) => s.id === sessionParam);
      if (sessionExists) {
        selectSession(sessionParam);
      }
    }
  }, [
    sessionParam,
    sessions,
    currentSessionId,
    selectSession,
    session?.user?.id,
  ]);

  useEffect(() => {
    if (
      session?.user?.id &&
      !currentSessionId &&
      !sessionParam &&
      sessions.length > 0
    ) {
      selectSession(sessions[0].id);
    }
  }, [
    session?.user?.id,
    currentSessionId,
    sessionParam,
    sessions.length,
    selectSession,
  ]);

  useEffect(() => {
    if (session?.user?.id) {
      refetchSessions();
    }
  }, [session?.user?.id, refetchSessions]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-primary animate-pulse" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-foreground">
              Loading Career AI
            </h2>
            <p className="text-muted-foreground">
              Preparing your personalized experience...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <SignInForm />;
  }

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
    setSidebarOpen(false);
  };

  const handleCreateSession = () => {
    createSession();
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId);
  };

  const handleRenameSession = (sessionId: string, newTitle: string) => {
    updateSessionTitle(sessionId, newTitle);
  };

  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    role: msg.role as "user" | "assistant",
    timestamp: new Date(msg.createdAt),
  }));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Toaster position="top-right" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ChatSidebar
          sessions={sessions}
          currentSessionId={currentSessionId || undefined}
          isDraftSession={isDraftSession}
          draftSessionTitle={draftSessionTitle}
          onSelectSession={handleSelectSession}
          onCreateSession={handleCreateSession}
          onDeleteSession={handleDeleteSession}
          onRenameSession={handleRenameSession}
          isLoading={isLoadingSessions}
        />
      </div>

      {/* Main Chat Area - Full Screen */}
      <div className="flex-1 flex flex-col min-w-0">
        {isLoadingSessions || isLoadingMessages ? (
          <div className="flex items-center justify-center h-full bg-background">
            <div className="text-center space-y-4">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  {isLoadingSessions ? "Loading your sessions..." : "Loading messages..."}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Please wait a moment
                </p>
              </div>
            </div>
          </div>
        ) : (
          <ChatInterface
            sessionId={currentSessionId || undefined}
            onSendMessage={sendMessage}
            messages={formattedMessages}
            isLoading={isSending}
            aiThinkingPhase={aiThinkingPhase}
            onMobileMenuToggle={() => setSidebarOpen(!sidebarOpen)}
            showMobileMenuToggle={true}
          />
        )}
      </div>
    </div>
  );
}
