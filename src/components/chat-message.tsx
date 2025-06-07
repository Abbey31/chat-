import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Message, User } from "@/lib/types"

interface ChatMessageProps {
  message: Message
  currentUser: User | null
}

export default function ChatMessage({ message, currentUser }: ChatMessageProps) {
  const isCurrentUser = message.senderId === currentUser?.id
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div className={`flex ${isCurrentUser ? "flex-row-reverse" : "flex-row"} max-w-[80%] gap-2`}>
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.senderAvatar || "/placeholder.svg"} alt={message.senderName} />
          <AvatarFallback>{message.senderName.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{message.senderName}</span>
            <span className="text-xs text-slate-500">{formattedTime}</span>
          </div>

          <div
            className={`mt-1 p-3 rounded-lg ${
              isCurrentUser
                ? "bg-blue-600 text-white"
                : "bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            }`}
          >
            {message.content}
          </div>
        </div>
      </div>
    </div>
  )
}
