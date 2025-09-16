"use client";

import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User, Sparkles, ArrowUp, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Message interface for type safety
interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

// Props interface for the chat interface component
interface ChatInterfaceProps {
  sessionId?: string;
  onSendMessage?: (message: string) => Promise<void>;
  messages?: Message[];
  isLoading?: boolean;
  aiThinkingPhase?: "thinking" | "processing" | "responding";
  onTypingChange?: (isTyping: boolean) => void;
  onMobileMenuToggle?: () => void;
  showMobileMenuToggle?: boolean;
}

export function ChatInterface({
  sessionId,
  onSendMessage,
  messages = [],
  isLoading = false,
  aiThinkingPhase = "thinking",
  onTypingChange,
  onMobileMenuToggle,
  showMobileMenuToggle = false,
}: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState("");
  const [isUserTyping, setIsUserTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth auto-scroll to bottom when new messages arrive or AI is responding
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  // Auto-scroll when messages change or AI is thinking/responding
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages, isLoading, aiThinkingPhase, scrollToBottom]);

  useEffect(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Handle typing detection
  const handleTypingChange = useCallback(
    (isTyping: boolean) => {
      setIsUserTyping(isTyping);
      onTypingChange?.(isTyping);
    },
    [onTypingChange]
  );

  // Debounced typing detection
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setInputValue(value);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      if (value.length > 0 && !isUserTyping) {
        handleTypingChange(true);
      }

      typingTimeoutRef.current = setTimeout(() => {
        handleTypingChange(false);
      }, 1000);
    },
    [isUserTyping, handleTypingChange]
  );

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const messageContent = inputValue.trim();
    setInputValue("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    handleTypingChange(false);

    setTimeout(() => scrollToBottom(), 50);

    try {
      if (onSendMessage) {
        await onSendMessage(messageContent);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setInputValue(messageContent);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Mobile Menu Button - Only show on mobile */}
      {showMobileMenuToggle && (
        <div className="lg:hidden flex items-center p-4 border-b border-border/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="text-foreground hover:bg-accent/50"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 pt-10" ref={scrollAreaRef}>
        <div className="space-y-6 max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-96 text-center space-y-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center">
                  <Bot className="h-12 w-12 text-primary" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-accent-foreground" />
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-bold text-foreground">
                  Welcome to Career Counseling AI
                </h3>
                <p className="text-muted-foreground max-w-md leading-relaxed">
                  I'm here to help you with career guidance, job search
                  strategies, skill development, and professional growth. Ask me
                  anything to get started!
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border-dashed">
                  <p className="text-sm font-medium">💼 Career Planning</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Get guidance on your career path
                  </p>
                </Card>
                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border-dashed">
                  <p className="text-sm font-medium">📝 Resume Review</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Improve your resume and CV
                  </p>
                </Card>
                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border-dashed">
                  <p className="text-sm font-medium">🎯 Skill Development</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Learn new skills for your field
                  </p>
                </Card>
                <Card className="p-4 hover:bg-accent/50 transition-colors cursor-pointer border-dashed">
                  <p className="text-sm font-medium">🔍 Job Search</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Find the right opportunities
                  </p>
                </Card>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-4 max-w-[85%] group",
                  message.role === "user"
                    ? "ml-auto flex-row-reverse"
                    : "mr-auto"
                )}
              >
                <Avatar
                  className={cn(
                    "h-10 w-10 flex-shrink-0 ring-2 ring-offset-2 ring-offset-background transition-all duration-200",
                    message.role === "user"
                      ? "ring-primary/20 group-hover:ring-primary/40"
                      : "ring-muted/20 group-hover:ring-muted/40"
                  )}
                >
                  <AvatarFallback
                    className={cn(
                      "transition-colors duration-200",
                      message.role === "user"
                        ? "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground"
                        : "bg-gradient-to-br from-muted to-muted/80 text-muted-foreground"
                    )}
                  >
                    {message.role === "user" ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5" />
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col space-y-2 min-w-0 flex-1">
                  <Card
                    className={cn(
                      "p-4 shadow-sm transition-all duration-200 group-hover:shadow-md",
                      message.role === "user"
                        ? "bg-gray-300 dark:bg-[#364153] text-gray-800 dark:text-primary-foreground border-primary/20"
                        : "bg-card text-card-foreground border-border/50 hover:border-border"
                    )}
                  >
                    <div className="text-sm leading-relaxed">
                      {message.role === "assistant" ? (
                        <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              p: ({ children }) => (
                                <p className="mb-3 last:mb-0 leading-relaxed">
                                  {children}
                                </p>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-3 pl-5 space-y-1">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-3 pl-5 space-y-1">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="text-sm leading-relaxed">
                                  {children}
                                </li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-foreground">
                                  {children}
                                </strong>
                              ),
                              em: ({ children }) => (
                                <em className="italic">{children}</em>
                              ),
                              code: ({ children }) => (
                                <code className="bg-muted/50 px-2 py-1 rounded-md text-xs font-mono border">
                                  {children}
                                </code>
                              ),
                              pre: ({ children }) => (
                                <pre className="bg-muted/30 p-4 rounded-lg text-xs font-mono overflow-x-auto mb-3 border">
                                  {children}
                                </pre>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap leading-relaxed">
                          {message.content}
                        </p>
                      )}
                    </div>
                  </Card>

                  <p
                    className={cn(
                      "text-xs opacity-60 transition-opacity group-hover:opacity-80",
                      message.role === "user" ? "text-right" : "text-left"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))
          )}

          {isLoading && (
            <div className="flex gap-4 max-w-[85%] mr-auto group">
              <Avatar className="h-10 w-10 flex-shrink-0 ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-gradient-to-br from-muted to-muted/80 text-muted-foreground">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <Card className="p-4 bg-card text-card-foreground border-border/50 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium">
                    {aiThinkingPhase === "thinking" && "AI is thinking..."}
                    {aiThinkingPhase === "processing" &&
                      "Processing your request..."}
                    {aiThinkingPhase === "responding" &&
                      "Preparing response..."}
                  </span>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="pb-4 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me about your career goals, job search, or professional development..."
                className="min-h-[52px] pr-12 bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 resize-none"
                disabled={isLoading}
              />
              
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="h-[52px] w-[52px] bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              size="icon"
            >
              <ArrowUp className="h-5 w-5" />
            </Button>
          </div>

          {/* Enhanced typing and help indicators */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isUserTyping && !isLoading && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse [animation-delay:-0.2s]" />
                    <div className="w-1 h-1 bg-primary rounded-full animate-pulse [animation-delay:-0.4s]" />
                  </div>
                  <span className="font-medium">You are typing...</span>
                </div>
              )}
            </div>

            {/* {!isUserTyping && (
              <p className="text-xs text-muted-foreground">
                Press{" "}
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                  Enter
                </kbd>{" "}
                to send •
                <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs ml-1">
                  Shift+Enter
                </kbd>{" "}
                for new line
              </p>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
