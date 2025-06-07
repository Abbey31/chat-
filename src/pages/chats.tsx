"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Send, Plus, LogOut, Users, Hash } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import ChannelList from "@/components/channel-list"
import UserList from "@/components/user-list"
import { toast } from "sonner"
import type { Message, Channel, User } from "@/lib/types"
import { generateMockData } from "@/lib/mock-data"

export default function ChatPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [channels, setChannels] = useState<Channel[]>([])
  const [activeChannel, setActiveChannel] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/login")
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser({
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        name: userData.name,
        email: userData.email,
        avatar: `/placeholder.svg?height=40&width=40`,
        status: "online",
      })

      // Load mock data
      const { mockChannels, mockUsers, mockMessages } = generateMockData()
      setChannels(mockChannels)
      setUsers(mockUsers)
      setActiveChannel(mockChannels[0].id)
      setMessages(mockMessages.filter((m) => m.channelId === mockChannels[0].id))

      setIsLoading(false)
    } catch (error) {
      console.error("Error initializing chat:", error)
      toast.error("Error", {
        description: "Failed to initialize chat. Please try again.",
      })
      router.push("/login")
    }
  }, [router])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      timestamp: new Date().toISOString(),
      sender: user,
      channelId: activeChannel,
    }

    setMessages((prev) => [...prev, newMsg])
    setNewMessage("")

    // Simulate receiving a response after a short delay
    setTimeout(() => {
      const botResponse: Message = {
        id: `msg-${Date.now() + 1}`,
        content: `Thanks for your message! This is an automated response.`,
        timestamp: new Date().toISOString(),
        sender: {
          id: "bot",
          name: "ChatBot",
          email: "bot@chatsync.com",
          avatar: `/placeholder.svg?height=40&width=40`,
          status: "online",
        },
        channelId: activeChannel,
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const handleChannelChange = (channelId: string) => {
    setActiveChannel(channelId)
    setMessages((prev) => prev.filter((m) => m.channelId === channelId))
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
    toast.success("Logged out", {
      description: "You have been successfully logged out.",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  const activeChannelData = channels.find((c) => c.id === activeChannel)

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">ChatSync</h1>
          <div className="flex items-center mt-4 space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <Badge variant="outline" className="text-xs">
                Online
              </Badge>
            </div>
          </div>
        </div>

        <Tabs defaultValue="channels" className="flex-1">
          <TabsList className="grid grid-cols-2 mx-4 mt-4">
            <TabsTrigger value="channels">
              <Hash className="h-4 w-4 mr-1" />
              Channels
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-1" />
              Users
            </TabsTrigger>
          </TabsList>

          <TabsContent value="channels" className="flex-1 p-0">
            <ChannelList channels={channels} activeChannel={activeChannel} onSelectChannel={handleChannelChange} />
          </TabsContent>

          <TabsContent value="users" className="flex-1 p-0">
            <UserList users={users} />
          </TabsContent>
        </Tabs>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Channel Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center">
            <Hash className="h-5 w-5 mr-2 text-slate-500" />
            <h2 className="text-lg font-medium">{activeChannelData?.name}</h2>
            <span className="ml-2 text-sm text-slate-500">{activeChannelData?.description}</span>
          </div>
          <Button size="sm" variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Invite
          </Button>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} currentUser={user} />
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
      </div>
    </div>
  )
}
