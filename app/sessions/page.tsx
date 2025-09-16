"use client";

import type React from "react";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatSidebar } from "@/components/chat/chat-sidebar";
import {
  MessageSquare,
  Calendar,
  Clock,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit3,
  MoreHorizontal,
  Sparkles,
  Search,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import { formatDistanceToNow, format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

export default function SessionsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;
  const [currentPage, setCurrentPage] = useState(1);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const limit = 12;

  const {
    data: sessionData,
    isLoading,
    refetch,
  } = trpc.getSessionsPaginated.useQuery(
    {
      userId: user?.id!,
      page: currentPage,
      limit,
    },
    {
      enabled: !!user?.id,
    }
  );

  const updateTitleMutation = trpc.updateTitle.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Session title updated");
      setEditingSessionId(null);
    },
    onError: () => {
      toast.error("Failed to update title");
    },
  });

  const deleteSessionMutation = trpc.deleteSession.useMutation({
    onSuccess: () => {
      refetch();
      toast.success("Session deleted");
    },
    onError: () => {
      toast.error("Failed to delete session");
    },
  });

  const handleSessionClick = (sessionId: string) => {
    router.push(`/?session=${sessionId}`);
  };

  const handleStartEdit = (sessionId: string, currentTitle: string) => {
    setEditingSessionId(sessionId);
    setEditTitle(currentTitle);
  };

  const handleSaveEdit = () => {
    if (editingSessionId && editTitle.trim()) {
      updateTitleMutation.mutate({
        sessionId: editingSessionId,
        title: editTitle.trim(),
      });
    }
  };

  const handleCancelEdit = () => {
    setEditingSessionId(null);
    setEditTitle("");
  };

  const handleDeleteSession = (sessionId: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      deleteSessionMutation.mutate({ sessionId });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit();
    } else if (e.key === "Escape") {
      handleCancelEdit();
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-background via-background to-muted/20">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center mx-auto">
            <MessageSquare className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg font-medium">
            Please sign in to view your chat sessions.
          </p>
        </div>
      </div>
    );
  }

  const sessions = sessionData?.sessions || [];
  const totalPages = sessionData?.totalPages || 0;
  const total = sessionData?.total || 0;

  // Filter sessions based on search query
  const filteredSessions = sessions.filter((session) =>
    session.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-out lg:relative lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ChatSidebar
          sessions={sessions}
          currentSessionId={undefined}
          isDraftSession={false}
          draftSessionTitle=""
          onSelectSession={(sessionId) => router.push(`/?session=${sessionId}`)}
          onCreateSession={() => router.push("/")}
          onDeleteSession={handleDeleteSession}
          onRenameSession={() => {}}
          isLoading={isLoading}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-gradient-to-br from-background via-background to-muted/10">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center p-4 border-b border-border/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-foreground hover:bg-accent/50 mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold">All Sessions</h1>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center py-3 px-6 border-b border-border/30">
          <h1 className="text-2xl font-bold">All Sessions</h1>
        </div>

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search sessions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-card/50 border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                {total} total sessions
              </div>
            </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="p-6 space-y-4">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-full" />
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && sessions.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-3">
              No chat sessions yet
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto leading-relaxed">
              Start a new conversation with your AI career counselor to see your
              sessions here.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Start New Chat
            </Button>
          </div>
        )}

        {/* Sessions Grid */}
        {!isLoading && filteredSessions.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {filteredSessions.map((session) => (
                <Card
                  key={session.id}
                  className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 group border-border/50 hover:border-border bg-card/50 backdrop-blur-sm hover:bg-card/80"
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
                        <h3 className="text-lg font-semibold truncate group-hover:text-primary transition-colors leading-tight">
                          {session.title}
                        </h3>
                      )}
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/50"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(session.id, session.title);
                          }}
                        >
                          <Edit3 className="h-4 w-4 mr-2" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.id);
                          }}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary/60" />
                      <span>
                        Created:{" "}
                        {format(
                          new Date(session.createdAt),
                          "MMM d, yyyy 'at' h:mm a"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary/60" />
                      <span>
                        Last updated:{" "}
                        {formatDistanceToNow(new Date(session.updatedAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-border/30">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Click to open chat
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-card/30 rounded-xl border border-border/30 backdrop-blur-sm">
                <div className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages} • {total} total sessions
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let page: number;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "w-10 h-10 p-0 transition-colors",
                            currentPage === page
                              ? "bg-primary text-primary-foreground shadow-sm"
                              : "hover:bg-accent/50"
                          )}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="hover:bg-accent/50 transition-colors"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* No search results */}
        {!isLoading &&
          searchQuery &&
          filteredSessions.length === 0 &&
          sessions.length > 0 && (
            <div className="text-center py-16">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold mb-2">No sessions found</h2>
              <p className="text-muted-foreground mb-6">
                No sessions match your search for "{searchQuery}"
              </p>
              <Button
                variant="outline"
                onClick={() => setSearchQuery("")}
                className="hover:bg-accent/50 transition-colors"
              >
                Clear search
              </Button>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
