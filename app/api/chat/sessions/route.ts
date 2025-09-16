import { type NextRequest, NextResponse } from "next/server"
import { chatSessionQueries } from "@/lib/db"

// GET /api/chat/sessions - Get all sessions for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const sessions = await chatSessionQueries.getAll(userId)

    return NextResponse.json({
      success: true,
      data: sessions,
    })
  } catch (error) {
    console.error("[v0] Error fetching sessions:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch sessions" }, { status: 500 })
  }
}

// POST /api/chat/sessions - Create a new session
export async function POST(request: NextRequest) {
  try {
    const { title, userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 })
    }

    const sessionTitle = title || "New Chat"
    const session = await chatSessionQueries.create(sessionTitle, userId)

    return NextResponse.json({
      success: true,
      data: session,
    })
  } catch (error) {
    console.error("[v0] Error creating session:", error)
    return NextResponse.json({ success: false, error: "Failed to create session" }, { status: 500 })
  }
}

// PUT /api/chat/sessions - Update session title
export async function PUT(request: NextRequest) {
  try {
    const { sessionId, title } = await request.json()

    if (!sessionId || !title) {
      return NextResponse.json({ success: false, error: "Session ID and title are required" }, { status: 400 })
    }

    const updatedSession = await chatSessionQueries.updateTitle(sessionId, title)

    if (!updatedSession) {
      return NextResponse.json({ success: false, error: "Session not found or update failed" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: updatedSession,
    })
  } catch (error) {
    console.error("[v0] Error updating session:", error)
    return NextResponse.json({ success: false, error: "Failed to update session" }, { status: 500 })
  }
}

// DELETE /api/chat/sessions - Delete a session
export async function DELETE(request: NextRequest) {
  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ success: false, error: "Session ID is required" }, { status: 400 })
    }

    const deleted = await chatSessionQueries.delete(sessionId)

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Session not found or delete failed" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: { sessionId },
    })
  } catch (error) {
    console.error("[v0] Error deleting session:", error)
    return NextResponse.json({ success: false, error: "Failed to delete session" }, { status: 500 })
  }
}
