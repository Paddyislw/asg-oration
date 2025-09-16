"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import { trpc } from "@/lib/trpc/client"

// Types for our data
interface Session {
  id: string
  title: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface Message {
  id: string
  sessionId: string
  content: string
  role: "user" | "assistant"
  createdAt: string
}

// Custom hook for managing chat functionality
export function useChat() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isDraftSession, setIsDraftSession] = useState(false) // New state for draft sessions
  const [draftSessionTitle, setDraftSessionTitle] = useState("New Session")
  const [isSending, setIsSending] = useState(false)
  const [aiThinkingPhase, setAiThinkingPhase] = useState<'thinking' | 'processing' | 'responding'>('thinking')
  const [tempMessages, setTempMessages] = useState<Message[]>([])
  const { data: session } = useSession()
  const user = session?.user

  // tRPC queries and mutations
  const {
    data: sessions = [],
    isLoading: isLoadingSessions,
    refetch: refetchSessions,
  } = trpc.getSessions.useQuery({ userId: user?.id! }, { enabled: !!user?.id })

  const {
    data: dbMessages = [],
    isLoading: isLoadingMessages,
    refetch: refetchMessages,
  } = trpc.getMessages.useQuery({ sessionId: currentSessionId! }, { enabled: !!currentSessionId && !isDraftSession })

  // Combine real messages with temp messages (only use temp messages for draft sessions)
  const messages = isDraftSession ? tempMessages : [...dbMessages, ...tempMessages]

  const createSessionMutation = trpc.createSession.useMutation({
    onSuccess: () => refetchSessions(),
  })

  const updateTitleMutation = trpc.updateTitle.useMutation({
    onSuccess: () => refetchSessions(),
  })

  const deleteSessionMutation = trpc.deleteSession.useMutation({
    onSuccess: () => refetchSessions(),
  })

  const sendMessageMutation = trpc.sendMessage.useMutation({
    onSuccess: () => {
      setTempMessages([])
      refetchMessages()
      refetchSessions()
    },
    onError: () => {
      setTempMessages([])
    },
  })

  // Create a new draft chat session (not saved to DB yet)
  const createSession = useCallback(
    async (title?: string) => {
      if (!user?.id) return

      // Create a draft session that's not saved to DB yet
      setIsDraftSession(true)
      setCurrentSessionId("draft-session") // Temporary ID
      setDraftSessionTitle(title || "New Session")
      setTempMessages([]) // Clear any existing temp messages
      toast.success("New chat session ready")
    },
    [user?.id],
  )

  // Send a message in the current session
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user?.id) return

      let sessionId = currentSessionId

      // Handle draft session - create real session with message title
      if (isDraftSession || !sessionId) {
        const words = content.trim().split(/\s+/)
        const sessionTitle = words.slice(0, 4).join(" ") || "New Chat" // Take first 4 words

        try {
          const result = await createSessionMutation.mutateAsync({
            title: sessionTitle,
            userId: user.id,
          })

          sessionId = result.id
          setCurrentSessionId(sessionId)
          setIsDraftSession(false) // No longer a draft
          setDraftSessionTitle("")
        } catch (error) {
          toast.error("Failed to create new session")
          console.error("Create session error:", error)
          return
        }
      }

      // Show user message instantly
      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        sessionId,
        content,
        role: "user",
        createdAt: new Date().toISOString(),
      }

      // Add temp message immediately
      setTempMessages([tempUserMessage])
      setIsSending(true)
      setAiThinkingPhase('thinking')

      try {
        // Simulate thinking phases for better UX
        setTimeout(() => setAiThinkingPhase('processing'), 800)
        setTimeout(() => setAiThinkingPhase('responding'), 1600)

        await sendMessageMutation.mutateAsync({
          sessionId,
          content,
          userId: user.id,
        })
      } catch (error) {
        toast.error("Failed to send message")
        console.error("Send message error:", error)
      } finally {
        setIsSending(false)
        setAiThinkingPhase('thinking') // Reset to default
      }
    },
    [currentSessionId, user?.id, createSessionMutation, sendMessageMutation],
  )

  // Select a chat session
  const selectSession = useCallback((sessionId: string) => {
    if (sessionId === "draft-session") {
      // Don't allow selecting the draft session ID directly
      return
    }
    setCurrentSessionId(sessionId)
    setIsDraftSession(false) // Not a draft when selecting existing session
    setTempMessages([]) // Clear temp messages when switching sessions
  }, [])

  // Update session title
  const updateSessionTitle = useCallback(
    async (sessionId: string, title: string) => {
      try {
        await updateTitleMutation.mutateAsync({ sessionId, title })
        toast.success("Chat title updated")
      } catch (error) {
        toast.error("Failed to update title")
        console.error("Update title error:", error)
      }
    },
    [updateTitleMutation],
  )

  // Delete a session
  const deleteSession = useCallback(
    async (sessionId: string) => {
      // Handle draft session deletion
      if (sessionId === "draft-session" || isDraftSession) {
        setCurrentSessionId(null)
        setIsDraftSession(false)
        setTempMessages([])
        setDraftSessionTitle("")
        toast.success("Draft session cleared")
        return
      }

      try {
        await deleteSessionMutation.mutateAsync({ sessionId })
        if (currentSessionId === sessionId) {
          setCurrentSessionId(null)
          setTempMessages([]) // Clear temp messages when deleting current session
        }
        toast.success("Chat session deleted")
      } catch (error) {
        toast.error("Failed to delete session")
        console.error("Delete session error:", error)
      }
    },
    [currentSessionId, isDraftSession, deleteSessionMutation],
  )

  return {
    // State
    currentSessionId,
    isDraftSession,
    draftSessionTitle,
    isSending,
    aiThinkingPhase,
    isLoading: isLoadingSessions || isLoadingMessages,

    // Data
    sessions,
    messages,

    // Loading states
    isLoadingSessions,
    isLoadingMessages,

    // Actions
    createSession,
    sendMessage,
    selectSession,
    updateSessionTitle,
    deleteSession,

    // Refetch functions
    refetchSessions: () => refetchSessions(),
    refetchMessages: () => refetchMessages(),
  }
}
