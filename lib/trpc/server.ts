import { initTRPC } from "@trpc/server"
import { z } from "zod"
import superjson from "superjson"
import { chatSessionQueries, messageQueries } from "@/lib/db"
import { generateText } from "ai"
import { google } from "@ai-sdk/google"

const t = initTRPC.create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

export const appRouter = router({
  // Get sessions
  getSessions: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input }) => {
      const sessions = await chatSessionQueries.getAll(input.userId)
      return sessions.map(session => ({
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      }))
    }),

  // Create session
  createSession: publicProcedure
    .input(z.object({ title: z.string().optional(), userId: z.string() }))
    .mutation(async ({ input }) => {
      const session = await chatSessionQueries.create(input.title, input.userId)
      return {
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      }
    }),

  // Get messages
  getMessages: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      const messages = await messageQueries.getBySessionId(input.sessionId)
      return messages.map(message => ({
        ...message,
        createdAt: message.createdAt.toISOString(),
      }))
    }),

  // Update session title
  updateTitle: publicProcedure
    .input(z.object({ sessionId: z.string(), title: z.string() }))
    .mutation(async ({ input }) => {
      const session = await chatSessionQueries.updateTitle(input.sessionId, input.title)
      if (!session) return null
      return {
        ...session,
        createdAt: session.createdAt.toISOString(),
        updatedAt: session.updatedAt.toISOString(),
      }
    }),

  // Delete session
  deleteSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .mutation(async ({ input }) => {
      return await chatSessionQueries.delete(input.sessionId)
    }),

  // Send message with AI response
  sendMessage: publicProcedure
    .input(z.object({
      sessionId: z.string(),
      content: z.string(),
      userId: z.string()
    }))
    .mutation(async ({ input }) => {
      const { sessionId, content, userId } = input

      // Insert user message
      const userMessage = await messageQueries.create(sessionId, content, "user")

      // Get conversation history for context
      const previousMessages = await messageQueries.getBySessionId(sessionId)

      // Build conversation context
      const conversationHistory = previousMessages.map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      }))

      const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
      if (!apiKey) {
        throw new Error("Google Generative AI API key is not set")
      }

      // Generate AI response
      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        system: `You are a professional career counselor AI assistant. You provide helpful, empathetic, and actionable career guidance.

Key areas you help with:
- Career planning and goal setting
- Job search strategies and techniques
- Resume and interview preparation
- Skill development recommendations
- Professional networking advice
- Career transitions and pivots
- Work-life balance guidance
- Industry insights and trends

Always be supportive, professional, and provide specific, actionable advice. Ask clarifying questions when needed to give more personalized guidance.`,
        messages: conversationHistory,
      })

      // Insert AI response
      const aiMessage = await messageQueries.create(sessionId, text, "assistant")

      // Return both messages with proper formatting
      return [
        {
          ...userMessage,
          createdAt: userMessage.createdAt.toISOString(),
        },
        {
          ...aiMessage,
          createdAt: aiMessage.createdAt.toISOString(),
        }
      ]
    }),
})

export type AppRouter = typeof appRouter
