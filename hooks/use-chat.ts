"use client"

import { useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

// Types for our API responses
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

interface ApiResponse<T> {
  success: boolean
  data: T
  error?: string
}

// Custom hook for managing chat functionality
export function useChat() {
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [sessions, setSessions] = useState<Session[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoadingSessions, setIsLoadingSessions] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const { data: session } = useSession()
  const user = session?.user

  // Fetch sessions from API
  const fetchSessions = useCallback(async () => {
    if (!user?.id) return

    setIsLoadingSessions(true)
    try {
      const response = await fetch(`/api/chat/sessions?userId=${user.id}`)
      if (response.ok) {
        const result: ApiResponse<Session[]> = await response.json()
        if (result.success) {
          const sortedSessions = result.data.sort(
            (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          )
          setSessions(sortedSessions)
        }
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error)
    } finally {
      setIsLoadingSessions(false)
    }
  }, [user?.id])

  // Fetch messages from API
  const fetchMessages = useCallback(async (sessionId: string) => {
    setIsLoadingMessages(true)
    try {
      const response = await fetch(`/api/chat/messages?sessionId=${sessionId}`)
      if (response.ok) {
        const result: ApiResponse<Message[]> = await response.json()
        if (result.success) {
          setMessages(result.data)
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setIsLoadingMessages(false)
    }
  }, [])

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

        const response = await fetch("/api/chat/sessions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ title: sessionTitle, userId: user.id }),
        })

        if (response.ok) {
          const result: ApiResponse<Session> = await response.json()
          if (result.success) {
            setCurrentSessionId(result.data.id)
            await fetchSessions()
            toast.success("New chat session created")
          }
        } else {
          throw new Error("Failed to create session")
        }
      } catch (error) {
        toast.error("Failed to create new session")
        console.error("Create session error:", error)
      }
    },
    [user?.id, fetchSessions],
  )

  // Send a message in the current session
  const sendMessage = useCallback(
    async (content: string) => {
      if (!user?.id) return

      if (!currentSessionId) {
        const words = content.trim().split(/\s+/)
        const sessionTitle = words.slice(0, 3).join(" ") || "New Chat"

        try {
          const response = await fetch("/api/chat/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title: sessionTitle, userId: user.id }),
          })

          if (response.ok) {
            const result: ApiResponse<Session> = await response.json()
            if (result.success) {
              const newSessionId = result.data.id
              setCurrentSessionId(newSessionId)
              await fetchSessions()

              // Now send the message with the new session ID
              const tempUserMessage: Message = {
                id: `temp-${Date.now()}`,
                sessionId: newSessionId,
                content,
                role: "user",
                createdAt: new Date().toISOString(),
              }
              setMessages([tempUserMessage])
              setIsSending(true)

              try {
                const messageResponse = await fetch("/api/chat/messages", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    sessionId: newSessionId,
                    content,
                    userId: user.id,
                  }),
                })

                if (messageResponse.ok) {
                  await fetchMessages(newSessionId)
                  await fetchSessions() // Refresh sessions to update timestamps
                } else {
                  setMessages([])
                  throw new Error("Failed to send message")
                }
              } catch (error) {
                toast.error("Failed to send message")
                console.error("Send message error:", error)
              } finally {
                setIsSending(false)
              }
            }
          } else {
            throw new Error("Failed to create session")
          }
        } catch (error) {
          toast.error("Failed to create new session")
          console.error("Create session error:", error)
        }
        return
      }

      const tempUserMessage: Message = {
        id: `temp-${Date.now()}`,
        sessionId: currentSessionId,
        content,
        role: "user",
        createdAt: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, tempUserMessage])
      setIsSending(true)

      try {
        const response = await fetch("/api/chat/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sessionId: currentSessionId,
            content,
            userId: user.id,
          }),
        })

        if (response.ok) {
          await fetchMessages(currentSessionId)
          await fetchSessions() // Refresh sessions to update timestamps
        } else {
          setMessages((prev) => prev.filter((msg) => msg.id !== tempUserMessage.id))
          throw new Error("Failed to send message")
        }
      } catch (error) {
        toast.error("Failed to send message")
        console.error("Send message error:", error)
      } finally {
        setIsSending(false)
      }
    },
    [currentSessionId, user?.id, fetchMessages, fetchSessions],
  )

  // Select a chat session
  const selectSession = useCallback(
    (sessionId: string) => {
      setCurrentSessionId(sessionId)
      fetchMessages(sessionId)
    },
    [fetchMessages],
  )

  // Update session title
  const updateSessionTitle = useCallback(
    async (sessionId: string, title: string) => {
      try {
        const response = await fetch("/api/chat/sessions", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId, title }),
        })

        if (response.ok) {
          await fetchSessions()
          toast.success("Chat title updated")
        } else {
          throw new Error("Failed to update title")
        }
      } catch (error) {
        toast.error("Failed to update title")
        console.error("Update title error:", error)
      }
    },
    [fetchSessions],
  )

  // Delete a session
  const deleteSession = useCallback(
    async (sessionId: string) => {
      try {
        const response = await fetch("/api/chat/sessions", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sessionId }),
        })

        if (response.ok) {
          if (currentSessionId === sessionId) {
            setCurrentSessionId(null)
            setMessages([])
          }
          await fetchSessions()
          toast.success("Chat session deleted")
        } else {
          throw new Error("Failed to delete session")
        }
      } catch (error) {
        toast.error("Failed to delete session")
        console.error("Delete session error:", error)
      }
    },
    [currentSessionId, fetchSessions],
  )

  return {
    // State
    currentSessionId,
    isLoading,
    isSending,

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
    refetchSessions: fetchSessions,
    refetchMessages: () => (currentSessionId ? fetchMessages(currentSessionId) : Promise.resolve()),
  }
}
