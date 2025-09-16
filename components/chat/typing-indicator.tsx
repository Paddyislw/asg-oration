import { cn } from "@/lib/utils"

interface TypingIndicatorProps {
  isTyping: boolean
  message?: string
  className?: string
}

export function TypingIndicator({ isTyping, message = "AI is thinking", className }: TypingIndicatorProps) {
  if (!isTyping) return null

  return (
    <div className={cn("flex items-center space-x-2 p-4 text-muted-foreground", className)}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
        <div className="w-2 h-2 bg-current rounded-full animate-bounce" />
      </div>
      <span className="text-sm italic">{message}...</span>
    </div>
  )
}

interface AIThinkingIndicatorProps {
  isThinking: boolean
  className?: string
}

export function AIThinkingIndicator({ isThinking, className }: AIThinkingIndicatorProps) {
  return (
    <TypingIndicator
      isTyping={isThinking}
      message="AI is thinking"
      className={className}
    />
  )
}

interface UserTypingIndicatorProps {
  isTyping: boolean
  userName?: string
  className?: string
}

export function UserTypingIndicator({ isTyping, userName = "User", className }: UserTypingIndicatorProps) {
  return (
    <TypingIndicator
      isTyping={isTyping}
      message={`${userName} is typing`}
      className={className}
    />
  )
}