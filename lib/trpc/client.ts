import { createTRPCReact } from "@trpc/react-query"
import type { AppRouter } from "./server"

// Create the tRPC React client
export const trpc = createTRPCReact<AppRouter>()
