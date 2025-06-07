"use client"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import type { Conversation } from "@/lib/types"

interface ConversationListProps {
  conversations: Conversation[]
  activeConversation: string | null
  onSelectConversation: (conversationId: string) => void
  currentUserId: string
}

export default function ConversationList({
  conversations,
  activeConversation,
  onSelectConversation,
  currentUserId,
}: ConversationListProps) {
  return (
    <div className="p-2">
      {conversations.length === 0 ? (
        <div className="text-center py-8 text-slate-500">
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs">Click on a user to start chatting</p>
        </div>
      ) : (
        conversations.map((conversation) => (
          <Button
            key={conversation.id}
            variant={activeConversation === conversation.id ? "secondary" : "ghost"}
            className="w-full justify-start mb-1 h-auto p-3"
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-center w-full">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                <AvatarFallback>{conversation.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{conversation.name}</span>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 truncate">{conversation.lastMessage || "No messages yet"}</p>
                <p className="text-xs text-slate-400">{conversation.lastSeen}</p>
              </div>
            </div>
          </Button>
        ))
      )}
    </div>
  )
}
