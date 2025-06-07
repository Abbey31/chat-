import type { User, Channel, Message } from "./types"

export function generateMockData() {
  // Mock users
  const mockUsers: User[] = [
    {
      id: "user-1",
      name: "John Doe",
      email: "john@example.com",
      avatar: `/placeholder.svg?height=40&width=40`,
      status: "online",
    },
    {
      id: "user-2",
      name: "Jane Smith",
      email: "jane@example.com",
      avatar: `/placeholder.svg?height=40&width=40`,
      status: "online",
    },
    {
      id: "user-3",
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: `/placeholder.svg?height=40&width=40`,
      status: "away",
    },
    {
      id: "user-4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      avatar: `/placeholder.svg?height=40&width=40`,
      status: "offline",
    },
    {
      id: "user-5",
      name: "Alex Brown",
      email: "alex@example.com",
      avatar: `/placeholder.svg?height=40&width=40`,
      status: "busy",
    },
  ]

  // Mock channels
  const mockChannels: Channel[] = [
    {
      id: "channel-1",
      name: "general",
      description: "General discussions",
      isPrivate: false,
    },
    {
      id: "channel-2",
      name: "random",
      description: "Random topics",
      isPrivate: false,
    },
    {
      id: "channel-3",
      name: "development",
      description: "Development discussions",
      isPrivate: false,
    },
    {
      id: "channel-4",
      name: "design",
      description: "Design discussions",
      isPrivate: false,
    },
    {
      id: "channel-5",
      name: "team-private",
      description: "Private team discussions",
      isPrivate: true,
    },
  ]

  // Mock messages
  const mockMessages: Message[] = [
    {
      id: "msg-1",
      content: "Hello everyone! Welcome to the general channel.",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      sender: mockUsers[0],
      channelId: "channel-1",
    },
    {
      id: "msg-2",
      content: "Thanks John! Glad to be here.",
      timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
      sender: mockUsers[1],
      channelId: "channel-1",
    },
    {
      id: "msg-3",
      content: "Has anyone started working on the new project?",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      sender: mockUsers[2],
      channelId: "channel-1",
    },
    {
      id: "msg-4",
      content: "I've been working on the design mockups. Will share them soon!",
      timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
      sender: mockUsers[3],
      channelId: "channel-1",
    },
    {
      id: "msg-5",
      content: "Looking forward to seeing them, Sarah!",
      timestamp: new Date(Date.now() - 600000).toISOString(), // 10 minutes ago
      sender: mockUsers[0],
      channelId: "channel-1",
    },
    {
      id: "msg-6",
      content: "Random thought: Does anyone have recommendations for good programming podcasts?",
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      sender: mockUsers[4],
      channelId: "channel-2",
    },
    {
      id: "msg-7",
      content: "I like 'Syntax' and 'The Changelog'!",
      timestamp: new Date(Date.now() - 82800000).toISOString(), // 23 hours ago
      sender: mockUsers[2],
      channelId: "channel-2",
    },
    {
      id: "msg-8",
      content: "Team, let's discuss the sprint planning for next week.",
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      sender: mockUsers[0],
      channelId: "channel-5",
    },
  ]

  return { mockUsers, mockChannels, mockMessages }
}
