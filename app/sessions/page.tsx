"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  MessageSquare,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  MoreHorizontal
} from "lucide-react"
import { cn } from "@/lib/utils"
import { trpc } from "@/lib/trpc/client"
import { formatDistanceToNow, format } from "date-fns"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"

export default function SessionsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const user = session?.user
  const [currentPage, setCurrentPage] = useState(1)
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")

  const limit = 12 // Sessions per page

  // Get paginated sessions
  const {
    data: sessionData,
    isLoading,
    refetch
  } = trpc.getSessionsPaginated.useQuery(
    {
      userId: user?.id!,
      page: currentPage,
      limit
    },
    {
      enabled: !!user?.id,
    }
  )

  // Mutations for session operations
  const updateTitleMutation = trpc.updateTitle.useMutation({
    onSuccess: () => {
      refetch()
      toast.success("Session title updated")
      setEditingSessionId(null)
    },
    onError: () => {
      toast.error("Failed to update title")
    }
  })

  const deleteSessionMutation = trpc.deleteSession.useMutation({
    onSuccess: () => {
      refetch()
      toast.success("Session deleted")
    },
    onError: () => {
      toast.error("Failed to delete session")
    }
  })

  const handleSessionClick = (sessionId: string) => {
    router.push(`/?session=${sessionId}`)
  }

  const handleStartEdit = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId)
    setEditTitle(currentTitle)
  }

  const handleSaveEdit = () => {
    if (editingSessionId && editTitle.trim()) {
      updateTitleMutation.mutate({
        sessionId: editingSessionId,
        title: editTitle.trim()
      })
    }
  }

  const handleCancelEdit = () => {
    setEditingSessionId(null)
    setEditTitle("")
  }

  const handleDeleteSession = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSessionMutation.mutate({ sessionId })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      handleCancelEdit()
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Please sign in to view your chat sessions.</p>
      </div>
    )
  }

  const sessions = sessionData?.sessions || []
  const totalPages = sessionData?.totalPages || 0
  const total = sessionData?.total || 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push("/")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Chat
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Chat Sessions</h1>
            <p className="text-muted-foreground">
              Browse and manage all your conversations ({total} total)
            </p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-4 w-3/4 mb-3" />
                <Skeleton className="h-3 w-1/2 mb-2" />
                <Skeleton className="h-3 w-1/3" />
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sessions.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <h2 className="text-xl font-semibold mb-2">No chat sessions yet</h2>
            <p className="text-muted-foreground mb-6">
              Start a new conversation to see your sessions here.
            </p>
            <Button onClick={() => router.push("/")}>
              Start New Chat
            </Button>
          </div>
        )}

        {/* Sessions Grid */}
        {!isLoading && sessions.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {sessions.map((session) => (
                <Card
                  key={session.id}
                  className="p-6 cursor-pointer hover:shadow-md transition-all duration-200 group"
                  onClick={() => handleSessionClick(session.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      {editingSessionId === session.id ? (
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onBlur={handleSaveEdit}
                          onKeyDown={handleKeyPress}
                          className="w-full bg-transparent border-none outline-none text-lg font-semibold"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors">
                          {session.title}
                        </h3>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleStartEdit(session.id, session.title)
                          }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteSession(session.id)
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Created: {format(new Date(session.createdAt), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        Last updated: {formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <Badge variant="secondary" className="text-xs">
                      Click to open chat
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} • {total} total sessions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page: number
                      if (totalPages <= 5) {
                        page = i + 1
                      } else if (currentPage <= 3) {
                        page = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i
                      } else {
                        page = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className="w-8 h-8 p-0"
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}