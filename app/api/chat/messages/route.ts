import { type NextRequest, NextResponse } from "next/server";
import { messageQueries } from "@/lib/db";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

// GET /api/chat/messages - Get all messages for a session
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: "Session ID is required" },
        { status: 400 }
      );
    }

    const messages = await messageQueries.getBySessionId(sessionId);

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("[v0] Error fetching messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}

// POST /api/chat/messages - Send a new message
export async function POST(request: NextRequest) {
  try {
    const { sessionId, content, userId } = await request.json();

    if (!sessionId || !content || !userId) {
      return NextResponse.json(
        {
          success: false,
          error: "Session ID, content, and user ID are required",
        },
        { status: 400 }
      );
    }

    // Insert user message
    const userMessage = await messageQueries.create(sessionId, content, "user");

    console.log("[v0] Generating AI response for message:", content);

    // Get conversation history for context
    const previousMessages = await messageQueries.getBySessionId(sessionId);

    // Build conversation context
    const conversationHistory = previousMessages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new Error("Google Generative AI API key is not set");
    }
    console.log(
      "[v0] Using Gemini API key:",
      apiKey.substring(0, 20) + "..." + apiKey.substring(apiKey.length - 10)
    );

    // Set environment variable for Google AI SDK
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = apiKey;

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
    });

    console.log("[v0] Gemini response generated successfully");
    console.log("[v0] AI response generated:", text.substring(0, 100) + "...");

    // Insert AI response
    const aiMessage = await messageQueries.create(sessionId, text, "assistant");

    // Return both messages
    const messages = [userMessage, aiMessage];

    return NextResponse.json({
      success: true,
      data: messages,
    });
  } catch (error) {
    console.error("[v0] Error sending message:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 }
    );
  }
}
