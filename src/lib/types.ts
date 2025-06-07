export interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline" | "away" | "busy"
  lastSeen?: string
}

export interface Message {
  id: string
  content: string
  timestamp: string
  senderId: string
  senderName: string
  senderAvatar: string
  conversationId: string
}

export interface Conversation {
  id: string
  name: string
  avatar: string
  participants: string[]
  lastMessage: string
  lastSeen: string
  unreadCount: number
  isGroup: boolean
}

export interface Channel {
  id: string
  name: string
  description: string
  isPrivate: boolean
}
