"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User } from "lucide-react"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Message interface for type safety
interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

// Props interface for the chat interface component
interface ChatInterfaceProps {
  sessionId?: string
  onSendMessage?: (message: string) => Promise<void>
  messages?: Message[]
  isLoading?: boolean
}

export function ChatInterface({ sessionId, onSendMessage, messages = [], isLoading = false }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const messageContent = inputValue.trim()
    setInputValue("")

    try {
      if (onSendMessage) {
        await onSendMessage(messageContent)
      }
    } catch (error) {
      console.error("Failed to send message:", error)
      setInputValue(messageContent)
    }
  }

  // Handle Enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-border bg-card">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold text-card-foreground">Career Counselor AI</h2>
          <p className="text-sm text-muted-foreground">Your personal career guidance assistant</p>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Bot className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Welcome to Career Counseling AI</h3>
              <p className="text-muted-foreground max-w-md">
                I'm here to help you with career guidance, job search strategies, skill development, and professional
                growth. Ask me anything!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 max-w-[80%]",
                  message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                )}
              >
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarFallback
                    className={cn(
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <Card
                  className={cn(
                    "p-3 max-w-full",
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground",
                  )}
                >
                  <div className="text-sm leading-relaxed">
                    {message.role === "assistant" ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="mb-2 pl-4 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="mb-2 pl-4 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            code: ({ children }) => (
                              <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono">{children}</code>
                            ),
                            pre: ({ children }) => (
                              <pre className="bg-muted p-2 rounded text-xs font-mono overflow-x-auto mb-2">{children}</pre>
                            ),
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>
                  <p className="text-xs opacity-70 mt-2">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </Card>
              </div>
            ))
          )}

          {/* Typing Indicator */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-3 bg-card text-card-foreground">
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  </div>
                  <span className="text-xs text-muted-foreground ml-2">AI is thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <div className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me about your career goals, job search, or professional development..."
            className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">Press Enter to send • Shift+Enter for new line</p>
      </div>
    </div>
  )
}
