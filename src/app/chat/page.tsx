"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, LogOut, Users, Settings } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import UserList from "@/components/user-list"
import ConversationList from "@/components/conversation-list"
import { toast } from "sonner"
import type { Message, User, Conversation } from "@/lib/types"
import { getCurrentUser, logoutUser } from "@/lib/auth"
import {
  sendMessage,
  getMessages,
  getUsers,
  updateUserPresence,
  getConversations,
  createConversation,
} from "@/lib/chat"

export default function ChatPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize user and data
  useEffect(() => {
    const initializeChat = async () => {
      // Check authentication
      const user = getCurrentUser()
      if (!user) {
        router.push("/login")
        return
      }

      setCurrentUser(user)
      await updateUserPresence(user.id, "online")

      // Load initial data
      try {
        const [initialUsers, initialConversations] = await Promise.all([getUsers(), getConversations(user.id)])

        setUsers(initialUsers)
        setConversations(initialConversations)
      } catch (error) {
        console.error("Error loading initial data:", error)
        toast.error("Failed to load chat data")
      }

      setIsLoading(false)
    }

    initializeChat()
  }, [router])

  // Set up polling for real-time updates
  useEffect(() => {
    if (!currentUser || isLoading) return

    const updateData = async () => {
      try {
        const [updatedUsers, updatedConversations] = await Promise.all([getUsers(), getConversations(currentUser.id)])

        setUsers(updatedUsers)
        setConversations(updatedConversations)

        if (activeConversation) {
          const updatedMessages = await getMessages(activeConversation)
          setMessages(updatedMessages)
        }
      } catch (error) {
        console.error("Error updating data:", error)
      }
    }

    // Initial update
    updateData()

    // Set up polling interval
    intervalRef.current = setInterval(updateData, 3000)

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [currentUser?.id, activeConversation, isLoading])

  // Handle component unmount
  useEffect(() => {
    return () => {
      if (currentUser) {
        updateUserPresence(currentUser.id, "offline")
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentUser?.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || !activeConversation) return

    try {
      await sendMessage(activeConversation, currentUser.id, newMessage.trim())
      setNewMessage("")

      // Immediately update messages
      const updatedMessages = await getMessages(activeConversation)
      setMessages(updatedMessages)
    } catch (error) {
      toast.error("Failed to send message", {
        description: "Please try again.",
      })
    }
  }

  const handleConversationSelect = async (conversationId: string) => {
    setActiveConversation(conversationId)
    try {
      const conversationMessages = await getMessages(conversationId)
      setMessages(conversationMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
    }
  }

  const handleUserSelect = async (userId: string) => {
    if (!currentUser || userId === currentUser.id) return

    try {
      const conversationId = await createConversation([currentUser.id, userId])
      setActiveConversation(conversationId)

      // Update conversations list
      const updatedConversations = await getConversations(currentUser.id)
      setConversations(updatedConversations)

      // Load messages for the conversation
      const conversationMessages = await getMessages(conversationId)
      setMessages(conversationMessages)
    } catch (error) {
      toast.error("Failed to start conversation", {
        description: "Please try again.",
      })
    }
  }

  const handleLogout = async () => {
    if (currentUser) {
      await updateUserPresence(currentUser.id, "offline")
      logoutUser()
    }

    // Clear interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }

    router.push("/login")
    toast.success("Logged out", {
      description: "You have been successfully logged out.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading your chat...</p>
        </div>
      </div>
    )
  }

  const activeConversationData = conversations.find((c) => c.id === activeConversation)

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* User Profile Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">ChatSync</h1>
            <Button size="sm" variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser?.avatar || "/placeholder.svg"} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{currentUser?.name}</span>
              <Badge variant="outline" className="text-xs w-fit">
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Conversations</h2>
          </div>
          <ScrollArea className="flex-1">
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              onSelectConversation={handleConversationSelect}
              currentUserId={currentUser?.id || ""}
            />
          </ScrollArea>
        </div>

        {/* Online Users */}
        <div className="border-t border-slate-200 dark:border-slate-800">
          <div className="p-3 border-b border-slate-200 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Online Users ({users.filter((u) => u.status === "online" && u.id !== currentUser?.id).length})
            </h2>
          </div>
          <ScrollArea className="h-48">
            <UserList users={users.filter((u) => u.id !== currentUser?.id)} onUserSelect={handleUserSelect} />
          </ScrollArea>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-3">
                  <AvatarImage
                    src={activeConversationData?.avatar || "/placeholder.svg"}
                    alt={activeConversationData?.name}
                  />
                  <AvatarFallback>{activeConversationData?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-medium">{activeConversationData?.name}</h2>
                  <p className="text-sm text-slate-500">{activeConversationData?.lastSeen}</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Settings className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} currentUser={currentUser} />
                ))}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-slate-500" />
              </div>
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-slate-500">Choose a user from the sidebar to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
