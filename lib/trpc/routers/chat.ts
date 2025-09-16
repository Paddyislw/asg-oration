import { z } from "zod"
import { router, publicProcedure } from "../server"
import { chatSessionQueries, messageQueries } from "@/lib/db"
// Note: AI functionality moved to API routes using Google Gemini

// Input validation schemas
const createSessionSchema = z.object({
  title: z.string().optional(),
  userId: z.string().optional(),
})

// sendMessageSchema removed - functionality moved to API routes

const getMessagesSchema = z.object({
  sessionId: z.string().uuid(),
})

const updateSessionTitleSchema = z.object({
  sessionId: z.string().uuid(),
  title: z.string().min(1).max(255),
})

const deleteSessionSchema = z.object({
  sessionId: z.string().uuid(),
})

// Chat router with all chat-related procedures
export const chatRouter = router({
  // Get all chat sessions for a user
  getSessions: publicProcedure.input(z.object({ userId: z.string().optional() })).query(async ({ input }) => {
    try {
      const sessions = await chatSessionQueries.getAll(input.userId)
      return { success: true, data: sessions }
    } catch (error) {
      console.error("Error fetching chat sessions:", error)
      throw new Error("Failed to fetch chat sessions")
    }
  }),

  // Create a new chat session
  createSession: publicProcedure.input(createSessionSchema).mutation(async ({ input }) => {
    try {
      const session = await chatSessionQueries.create(input.title, input.userId)
      return { success: true, data: session }
    } catch (error) {
      console.error("Error creating chat session:", error)
      throw new Error("Failed to create chat session")
    }
  }),

  // Get messages for a specific chat session
  getMessages: publicProcedure.input(getMessagesSchema).query(async ({ input }) => {
    try {
      const messages = await messageQueries.getBySessionId(input.sessionId)
      return { success: true, data: messages }
    } catch (error) {
      console.error("Error fetching messages:", error)
      throw new Error("Failed to fetch messages")
    }
  }),

  // Note: Send message functionality moved to API routes (/api/chat/messages)
  // This endpoint is deprecated in favor of the direct API route

  // Update chat session title
  updateSessionTitle: publicProcedure.input(updateSessionTitleSchema).mutation(async ({ input }) => {
    try {
      const session = await chatSessionQueries.updateTitle(input.sessionId, input.title)
      if (!session) {
        throw new Error("Session not found")
      }
      return { success: true, data: session }
    } catch (error) {
      console.error("Error updating session title:", error)
      throw new Error("Failed to update session title")
    }
  }),

  // Delete a chat session
  deleteSession: publicProcedure.input(deleteSessionSchema).mutation(async ({ input }) => {
    try {
      const success = await chatSessionQueries.delete(input.sessionId)
      if (!success) {
        throw new Error("Session not found")
      }
      return { success: true }
    } catch (error) {
      console.error("Error deleting session:", error)
      throw new Error("Failed to delete session")
    }
  }),
})
