import type { User, Message, Conversation } from "./types"
import { getStoredUsers, saveUsers } from "./auth"

const MESSAGES_KEY = "chatsync_messages"
const CONVERSATIONS_KEY = "chatsync_conversations"

export function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return []
  const messages = localStorage.getItem(MESSAGES_KEY)
  return messages ? JSON.parse(messages) : []
}

export function saveMessages(messages: Message[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages))
}

export function getStoredConversations(): Conversation[] {
  if (typeof window === "undefined") return []
  const conversations = localStorage.getItem(CONVERSATIONS_KEY)
  return conversations ? JSON.parse(conversations) : []
}

export function saveConversations(conversations: Conversation[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations))
}

export async function getUsers(): Promise<User[]> {
  return getStoredUsers()
}

export async function updateUserPresence(userId: string, status: User["status"]): Promise<void> {
  const users = getStoredUsers()
  const userIndex = users.findIndex((u) => u.id === userId)

  if (userIndex !== -1) {
    users[userIndex].status = status
    users[userIndex].lastSeen = new Date().toISOString()
    saveUsers(users)
  }
}

export async function createConversation(participantIds: string[]): Promise<string> {
  const conversations = getStoredConversations()
  const users = getStoredUsers()

  // Check if conversation already exists between these participants
  const existingConversation = conversations.find(
    (c) => c.participants.length === participantIds.length && participantIds.every((id) => c.participants.includes(id)),
  )

  if (existingConversation) {
    return existingConversation.id
  }

  // Create new conversation
  const otherParticipant = users.find((u) => participantIds.includes(u.id) && u.id !== participantIds[0])
  const conversationId = `conv-${Date.now()}`

  const newConversation: Conversation = {
    id: conversationId,
    name: otherParticipant?.name || "Unknown User",
    avatar: otherParticipant?.avatar || "/placeholder.svg",
    participants: participantIds,
    lastMessage: "",
    lastSeen: "Just now",
    unreadCount: 0,
    isGroup: participantIds.length > 2,
  }

  conversations.push(newConversation)
  saveConversations(conversations)

  return conversationId
}

export async function getConversations(userId: string): Promise<Conversation[]> {
  const conversations = getStoredConversations()
  const userConversations = conversations.filter((c) => c.participants.includes(userId))

  // Update conversation names and avatars for non-group chats
  const users = getStoredUsers()
  return userConversations.map((conv) => {
    if (!conv.isGroup) {
      const otherParticipant = users.find((u) => conv.participants.includes(u.id) && u.id !== userId)
      if (otherParticipant) {
        return {
          ...conv,
          name: otherParticipant.name,
          avatar: otherParticipant.avatar,
        }
      }
    }
    return conv
  })
}

export async function sendMessage(conversationId: string, senderId: string, content: string): Promise<void> {
  const messages = getStoredMessages()
  const conversations = getStoredConversations()
  const users = getStoredUsers()

  const sender = users.find((u) => u.id === senderId)
  if (!sender) return

  const newMessage: Message = {
    id: `msg-${Date.now()}`,
    content,
    timestamp: new Date().toISOString(),
    senderId,
    senderName: sender.name,
    senderAvatar: sender.avatar,
    conversationId,
  }

  messages.push(newMessage)
  saveMessages(messages)

  // Update conversation last message
  const conversationIndex = conversations.findIndex((c) => c.id === conversationId)
  if (conversationIndex !== -1) {
    conversations[conversationIndex].lastMessage = content
    conversations[conversationIndex].lastSeen = "Just now"
    saveConversations(conversations)
  }
}

export async function getMessages(conversationId: string): Promise<Message[]> {
  const messages = getStoredMessages()
  return messages
    .filter((m) => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
}
