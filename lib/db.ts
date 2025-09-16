import { prisma } from "./prisma"
import type { ChatSession, ChatMessage, User } from "@prisma/client"

// Re-export Prisma types for convenience
export type { ChatSession, ChatMessage, User }

// Extended types with relations
export type ChatSessionWithMessages = ChatSession & {
  messages: ChatMessage[]
  user: User
}

export type ChatMessageWithSession = ChatMessage & {
  session: ChatSession
}

// Database operations for chat sessions
export const chatSessionQueries = {
  // Create a new chat session
  async create(title = "New Chat Session", userId?: string): Promise<ChatSession> {
    return await prisma.chatSession.create({
      data: {
        title,
        userId: userId!,
      },
    })
  },

  // Get all chat sessions, ordered by most recent
  async getAll(userId?: string): Promise<ChatSession[]> {
    if (!userId) {
      return await prisma.chatSession.findMany({
        orderBy: { updatedAt: "desc" },
      })
    }

    return await prisma.chatSession.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    })
  },

  // Get a specific chat session by ID
  async getById(id: string): Promise<ChatSession | null> {
    return await prisma.chatSession.findUnique({
      where: { id },
    })
  },

  // Get chat session with messages
  async getByIdWithMessages(id: string): Promise<ChatSessionWithMessages | null> {
    return await prisma.chatSession.findUnique({
      where: { id },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
        },
        user: true,
      },
    })
  },

  // Update chat session title
  async updateTitle(id: string, title: string): Promise<ChatSession | null> {
    try {
      return await prisma.chatSession.update({
        where: { id },
        data: { title },
      })
    } catch (error) {
      return null
    }
  },

  // Delete a chat session (hard delete)
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.chatSession.delete({
        where: { id },
      })
      return true
    } catch (error) {
      return false
    }
  },

  // Get paginated sessions
  async getPaginated(
    userId?: string,
    page = 1,
    limit = 20
  ): Promise<{ sessions: ChatSession[]; total: number; hasMore: boolean }> {
    const skip = (page - 1) * limit
    const where = userId ? { userId } : {}

    const [sessions, total] = await Promise.all([
      prisma.chatSession.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.chatSession.count({ where }),
    ])

    return {
      sessions,
      total,
      hasMore: skip + sessions.length < total,
    }
  },
}

// Database operations for messages
export const messageQueries = {
  // Create a new message
  async create(
    sessionId: string,
    content: string,
    role: "user" | "assistant",
    _metadata?: Record<string, any>
  ): Promise<ChatMessage> {
    return await prisma.chatMessage.create({
      data: {
        sessionId,
        content,
        role,
        // Note: metadata field needs to be added to schema if needed
      },
    })
  },

  // Get all messages for a chat session
  async getBySessionId(sessionId: string): Promise<ChatMessage[]> {
    return await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    })
  },

  // Get recent messages for context (useful for AI)
  async getRecentBySessionId(sessionId: string, limit = 10): Promise<ChatMessage[]> {
    return await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  },

  // Get message with session details
  async getByIdWithSession(id: string): Promise<ChatMessageWithSession | null> {
    return await prisma.chatMessage.findUnique({
      where: { id },
      include: { session: true },
    })
  },

  // Delete a message
  async delete(id: string): Promise<boolean> {
    try {
      await prisma.chatMessage.delete({
        where: { id },
      })
      return true
    } catch (error) {
      return false
    }
  },

  // Get message count for a session
  async getCountBySessionId(sessionId: string): Promise<number> {
    return await prisma.chatMessage.count({
      where: { sessionId },
    })
  },
}

// User operations (for NextAuth integration)
export const userQueries = {
  // Create a new user
  async create(email: string, displayName?: string, passwordHash?: string): Promise<User> {
    return await prisma.user.create({
      data: {
        email,
        displayName,
        passwordHash: passwordHash || "oauth_user",
      },
    })
  },

  // Get user by email
  async getByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
    })
  },

  // Get user by ID
  async getById(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    })
  },

  // Update user
  async update(id: string, data: Partial<User>): Promise<User | null> {
    try {
      return await prisma.user.update({
        where: { id },
        data,
      })
    } catch (error) {
      return null
    }
  },

  // Get user with chat sessions
  async getByIdWithSessions(id: string): Promise<(User & { chatSessions: ChatSession[] }) | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        chatSessions: {
          orderBy: { updatedAt: "desc" },
        },
      },
    })
  },
}