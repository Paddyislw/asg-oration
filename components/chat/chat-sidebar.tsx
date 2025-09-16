"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"
import { Plus, MessageSquare, MoreHorizontal, Trash2, Edit3, Calendar, Clock } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { formatDistanceToNow, format } from "date-fns"

interface ChatSession {
  id: string
  title: string
  userId: string
  createdAt: string
  updatedAt: string
}

// Props interface for the sidebar component
interface ChatSidebarProps {
  sessions?: ChatSession[]
  currentSessionId?: string
  onSelectSession?: (sessionId: string) => void
  onCreateSession?: () => void
  onDeleteSession?: (sessionId: string) => void
  onRenameSession?: (sessionId: string, newTitle: string) => void
  isLoading?: boolean
}

export function ChatSidebar({
  sessions = [],
  currentSessionId,
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
  isLoading = false,
}: ChatSidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  // Handle starting to edit a session title
  const handleStartEdit = (session: ChatSession) => {
    setEditingSessionId(session.id)
    setEditTitle(session.title)
  }

  // Handle saving the edited title
  const handleSaveEdit = () => {
    if (editingSessionId && editTitle.trim() && onRenameSession) {
      onRenameSession(editingSessionId, editTitle.trim())
    }
    setEditingSessionId(null)
    setEditTitle("")
  }

  // Handle canceling the edit
  const handleCancelEdit = () => {
    setEditingSessionId(null)
    setEditTitle("")
  }

  // Handle key press in edit mode
  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  return (
    <div className="flex flex-col h-full bg-sidebar border-r border-sidebar-border">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onCreateSession}
          className="w-full bg-sidebar-accent hover:bg-sidebar-accent/90 text-sidebar-accent-foreground"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat Sessions List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center px-4">
              <MessageSquare className="h-8 w-8 text-sidebar-foreground/50 mb-2" />
              <p className="text-sm text-sidebar-foreground/70">No chat sessions yet</p>
              <p className="text-xs text-sidebar-foreground/50">Start a new conversation</p>
            </div>
          ) : (
            sessions.map((session) => (
              <Card
                key={session.id}
                className={cn(
                  "p-3 cursor-pointer transition-colors hover:bg-sidebar-accent/50 border-sidebar-border",
                  currentSessionId === session.id
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "bg-sidebar text-sidebar-foreground",
                )}
                onClick={() => onSelectSession?.(session.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    {editingSessionId === session.id ? (
                      <input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={handleEditKeyPress}
                        className="w-full bg-transparent border-none outline-none text-sm font-medium"
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <h3 className="text-sm font-medium truncate">{session.title}</h3>
                    )}
                    <div className="flex flex-col gap-1 mt-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 opacity-50" />
                        <p className="text-xs opacity-70">
                          Created: {(() => {
                            try {
                              const date = new Date(session.createdAt)
                              if (isNaN(date.getTime())) {
                                return "Unknown"
                              }
                              return format(date, "MMM d, h:mm a")
                            } catch (error) {
                              console.log("[v0] Date formatting error:", error, "for date:", session.createdAt)
                              return "Unknown"
                            }
                          })()}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 opacity-50" />
                        <p className="text-xs opacity-70">
                          {(() => {
                            try {
                              const date = new Date(session.updatedAt)
                              if (isNaN(date.getTime())) {
                                return "Recently"
                              }
                              return formatDistanceToNow(date, { addSuffix: true })
                            } catch (error) {
                              console.log("[v0] Date formatting error:", error, "for date:", session.updatedAt)
                              return "Recently"
                            }
                          })()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-50 hover:opacity-100"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-32">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          handleStartEdit(session)
                        }}
                      >
                        <Edit3 className="h-3 w-3 mr-2" />
                        Rename
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteSession?.(session.id)
                        }}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-foreground/50 text-center">Career Counseling AI</p>
      </div>
    </div>
  )
}
