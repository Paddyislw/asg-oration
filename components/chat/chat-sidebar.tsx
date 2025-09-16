"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  MessageSquare,
  MoreHorizontal,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  Sparkles,
  History,
  User,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserMenu } from "@/components/auth/user-menu";
import { cn } from "@/lib/utils";
import { formatDistanceToNow, format } from "date-fns";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

interface ChatSession {
  id: string;
  title: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  sessions?: ChatSession[];
  currentSessionId?: string;
  isDraftSession?: boolean;
  draftSessionTitle?: string;
  onSelectSession?: (sessionId: string) => void;
  onCreateSession?: () => void;
  onDeleteSession?: (sessionId: string) => void;
  onRenameSession?: (sessionId: string, newTitle: string) => void;
  isLoading?: boolean;
}

export function ChatSidebar({
  sessions = [],
  currentSessionId,
  isDraftSession = false,
  draftSessionTitle = "",
  onSelectSession,
  onCreateSession,
  onDeleteSession,
  onRenameSession,
  isLoading = false,
}: ChatSidebarProps) {
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  const isOnChatPage = pathname === "/" || pathname.includes("?session=");

  const handleStartEdit = (session: ChatSession) => {
    setEditingSessionId(session.id);
    setEditTitle(session.title);
  };

  const handleSaveEdit = () => {
    if (editingSessionId && editTitle.trim() && onRenameSession) {
      onRenameSession(editingSessionId, editTitle.trim());
    }
    setEditingSessionId(null);
    setEditTitle("");
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditTitle("");
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 border-r border-sidebar-border/50 backdrop-blur-sm">
      {/* Header with Logo */}
      <div className="py-3 px-4 border-b border-sidebar-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <h2 className="font-semibold text-sidebar-foreground">Career AI</h2>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 space-y-2">
        {/* New Chat Button */}
        <Button
          onClick={onCreateSession}
          className="w-full justify-start bg-gradient-to-r from-sidebar-accent to-sidebar-accent/90 hover:from-sidebar-accent/90 hover:to-sidebar-accent/80 text-sidebar-accent-foreground shadow-sm hover:shadow-md transition-all duration-200"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Chat
        </Button>

        {/* All Sessions Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/sessions")}
          className={cn(
            "w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground",
            pathname === "/sessions" &&
              "bg-sidebar-accent/20 text-sidebar-accent-foreground"
          )}
        >
          <History className="h-4 w-4 mr-2" />
          All Sessions
        </Button>
      </div>

      {/* Chat Sessions List - Only show on chat pages */}
      {isOnChatPage && (
        <>
          <div className="px-4 py-2">
            <h3 className="text-sm font-medium text-sidebar-foreground/70 mb-2">
              Recent Chats
            </h3>
          </div>
          <ScrollArea className="flex-1 px-3">
            <div className="space-y-2">
              {isDraftSession && (
                <Card
                  className={cn(
                    "p-3 cursor-pointer transition-all duration-200 border-dashed border-2 group hover:shadow-sm",
                    "bg-gradient-to-r from-muted/30 to-muted/20 text-muted-foreground hover:from-muted/40 hover:to-muted/30",
                    "border-primary/30 hover:border-primary/50"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium truncate italic text-white">
                        {draftSessionTitle}
                      </h3>
                      <p className="text-xs opacity-70 mt-1 text-white">
                        Type a message to save this conversation
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem
                          onClick={() => onDeleteSession?.("draft-session")}
                          className="text-destructive"
                        >
                          <Trash2 className="h-3 w-3 mr-2" />
                          Clear Draft
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              )}

              {sessions.length === 0 && !isDraftSession ? (
                <div className="flex flex-col items-center justify-center h-48 text-center px-4 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-sidebar-accent/20 to-sidebar-accent/10 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-8 w-8 text-sidebar-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-sidebar-foreground/70">
                      No conversations yet
                    </p>
                    <p className="text-xs text-sidebar-foreground/50 leading-relaxed">
                      Start a new chat to begin your career counseling journey
                    </p>
                  </div>
                </div>
              ) : sessions.length > 0 ? (
                sessions.map((session) => (
                  <Card
                    key={session.id}
                    className={cn(
                      "p-2 cursor-pointer transition-all duration-200 hover:shadow-sm group ",
                      currentSessionId === session.id
                        ? "bg-gray-700 from-sidebar-accent to-sidebar-accent/90 text-sidebar-accent-foreground shadow-sm "
                        : "bg-sidebar/50 text-sidebar-foreground hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground border-sidebar-border/30"
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
                          <h3
                            className={cn(
                              "text-sm font-medium truncate group-hover:text-current transition-colors",
                              currentSessionId === session.id
                                ? "text-[#ffa88e] font-semibold"
                                : ""
                            )}
                          >
                            {session.title}
                          </h3>
                        )}

                        <div className="flex flex-col gap-1.5 mt-2">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3 opacity-50" />
                            <p className="text-xs opacity-70">
                              {(() => {
                                try {
                                  const date = new Date(session.createdAt);
                                  if (isNaN(date.getTime())) return "Unknown";
                                  return format(date, "MMM d, h:mm a");
                                } catch (error) {
                                  return "Unknown";
                                }
                              })()}
                            </p>
                          </div>
                          {/* <div className="flex items-center gap-1.5">
                        <Clock className="h-3 w-3 opacity-50" />
                        <p className="text-xs opacity-70">
                          {(() => {
                            try {
                              const date = new Date(session.updatedAt);
                              if (isNaN(date.getTime())) return "Recently";
                              return formatDistanceToNow(date, {
                                addSuffix: true,
                              });
                            } catch (error) {
                              return "Recently";
                            }
                          })()}
                        </p>
                      </div> */}
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-accent/50"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(session);
                            }}
                          >
                            <Edit3 className="h-3 w-3 mr-2" />
                            Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteSession?.(session.id);
                            }}
                            className="text-destructive focus:text-destructive hover:text-white"
                          >
                            <Trash2 className="h-3 w-3 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))
              ) : null}
            </div>
          </ScrollArea>
        </>
      )}

      {/* User Section at Bottom */}
      <div className="mt-auto p-4 border-t border-sidebar-border/50">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {user.name || user.email}
              </p>
              <p className="text-xs text-sidebar-foreground/50 truncate">
                {user.email}
              </p>
            </div>
            <UserMenu />
          </div>
        ) : (
          <div className="text-center">
            <p className="text-xs text-sidebar-foreground/50">Please sign in</p>
          </div>
        )}
      </div>
    </div>
  );
}
