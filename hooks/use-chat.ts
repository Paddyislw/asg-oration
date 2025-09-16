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
  const [isSending, setIsSending] = useState(false)
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
  } = trpc.getMessages.useQuery({ sessionId: currentSessionId! }, { enabled: !!currentSessionId })

  // Combine real messages with temp messages
  const messages = [...dbMessages, ...tempMessages]

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

  // Create a new chat session
  const createSession = useCallback(
    async (title?: string) => {
      if (!user?.id) return

      try {
        const sessionTitle =
          title ||
          `Chat Session ${new Date().toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })}`

        const result = await createSessionMutation.mutateAsync({
          title: sessionTitle,
          userId: user.id,
        })

        setCurrentSessionId(result.id)
        toast.success("New chat session created")
      } catch (error) {
        toast.error("Failed to create new session")
        console.error("Create session error:", error)
      }
    },
    [user?.id, createSessionMutation],
  )

  // Send a message in the current session
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user?.id) return

      let sessionId = currentSessionId

      // Create new session if none exists
      if (!sessionId) {
        const words = content.trim().split(/\s+/)
        const sessionTitle = words.slice(0, 3).join(" ") || "New Chat"

        try {
          const result = await createSessionMutation.mutateAsync({
            title: sessionTitle,
            userId: user.id,
          })

          sessionId = result.id
          setCurrentSessionId(sessionId)
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

      try {
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
      }
    },
    [currentSessionId, user?.id, createSessionMutation, sendMessageMutation],
  )

  // Select a chat session
  const selectSession = useCallback((sessionId: string) => {
    setCurrentSessionId(sessionId)
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
    [currentSessionId, deleteSessionMutation],
  )

  return {
    // State
    currentSessionId,
    isSending,
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
