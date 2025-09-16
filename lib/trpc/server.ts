import { initTRPC } from "@trpc/server"
import superjson from "superjson"
import { chatRouter } from "./routers/chat"

// Initialize tRPC with superjson transformer for better serialization
const t = initTRPC.create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure

// Create the main tRPC router with chat functionality
export const appRouter = router({
  // Health check endpoint
  health: publicProcedure.query(() => {
    return { status: "ok", timestamp: new Date().toISOString() }
  }),

  chat: chatRouter,
})

export type AppRouter = typeof appRouter
