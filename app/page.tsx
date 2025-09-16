"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { SignInForm } from "@/components/auth/sign-in-form"
import { UserMenu } from "@/components/auth/user-menu"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useChat } from "@/hooks/use-chat"
import { Toaster } from "sonner"

export default function HomePage() {
  const { data: session, status } = useSession()
  const authLoading = status === "loading"
  const user = session?.user
  const [sidebarOpen, setSidebarOpen] = useState(false)

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
    refetchSessions, // Assuming refetchSessions is part of useChat hook
  } = useChat()

  useEffect(() => {
    // Sessions will only be created when user sends first message
  }, [session?.user?.id, isLoadingSessions, sessions.length, currentSessionId, createSession])

  useEffect(() => {
    if (session?.user?.id && !currentSessionId && sessions.length > 0) {
      console.log("[v0] Selecting first session:", sessions[0].id)
      selectSession(sessions[0].id)
    }
  }, [session?.user?.id, currentSessionId, sessions.length, selectSession])

  useEffect(() => {
    if (session?.user?.id) {
      console.log("[v0] User authenticated, loading sessions...")
      refetchSessions()
    }
  }, [session?.user?.id, refetchSessions])

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Loading...</h2>
          <p className="text-muted-foreground">Checking authentication</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <SignInForm />
  }

  // Handle selecting a chat session
  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId)
    setSidebarOpen(false) // Close sidebar on mobile after selection
  }

  // Handle creating a new session
  const handleCreateSession = () => {
    createSession()
  }

  // Handle deleting a session
  const handleDeleteSession = (sessionId: string) => {
    deleteSession(sessionId)
  }

  // Handle renaming a session
  const handleRenameSession = (sessionId: string, newTitle: string) => {
    updateSessionTitle(sessionId, newTitle)
  }

  const formattedMessages = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    role: msg.role as "user" | "assistant",
    timestamp: new Date(msg.createdAt), // Fixed property name from created_at to createdAt
  }))

  return (
    <div className="flex h-screen bg-background">
      <Toaster position="top-right" />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-200 ease-in-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
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

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between gap-2 p-4 border-b border-border bg-card">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-card-foreground"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <h1 className="font-semibold text-card-foreground">Career Counseling AI</h1>
          </div>
          <UserMenu />
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-border bg-card">
          <h1 className="text-xl font-semibold text-card-foreground">Career Counseling AI</h1>
          <UserMenu />
        </div>

        {/* Chat Interface */}
        <div className="flex-1">
          <ChatInterface
            sessionId={currentSessionId || undefined}
            onSendMessage={sendMessage}
            messages={formattedMessages}
            isLoading={isLoading || isLoadingMessages || isSending}
            aiThinkingPhase={aiThinkingPhase}
          />
        </div>
      </div>
    </div>
  )
}
