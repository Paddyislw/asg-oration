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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-background to-background/80 relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 right-1/3 w-16 h-16 bg-primary/5 rounded-full blur-lg animate-pulse [animation-delay:2s]" />
        </div>

        <div className="text-center space-y-8 relative z-10">
          <div className="relative">
            {/* Main loading container */}
            <div className="relative w-24 h-24 mx-auto">
              {/* Inner spinning loader */}
              <div className="absolute inset-2 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              {/* Center icon container */}
              <div className="absolute inset-6 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Sparkles className="h-6 w-6 text-primary animate-pulse" />
              </div>
            </div>

            {/* Floating sparkles */}
            <div className="absolute -top-2 -left-2 w-3 h-3 bg-primary/40 rounded-full animate-bounce [animation-delay:0.5s]" />
            <div className="absolute -bottom-2 -right-2 w-2 h-2 bg-accent/40 rounded-full animate-bounce [animation-delay:1.5s]" />
            <div className="absolute top-2 -right-4 w-2.5 h-2.5 bg-primary/30 rounded-full animate-bounce [animation-delay:2.5s]" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text">
                Career AI
              </h2>
              <div className="flex items-center justify-center gap-1">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
            <p className="text-muted-foreground text-lg font-medium">
              Preparing your personalized experience
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
