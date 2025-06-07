import type { User } from "./types"

const USERS_KEY = "chatsync_users"
const CURRENT_USER_KEY = "chatsync_current_user"

// Mock user database
const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "user-2",
    name: "Bob Smith",
    email: "bob@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "user-3",
    name: "Carol Davis",
    email: "carol@example.com",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "away",
  },
]

// Initialize users if not exists
if (typeof window !== "undefined" && !localStorage.getItem(USERS_KEY)) {
  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers))
}

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return []
  const users = localStorage.getItem(USERS_KEY)
  return users ? JSON.parse(users) : []
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export async function registerUser(name: string, email: string, password: string): Promise<User | null> {
  const users = getStoredUsers()

  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return null
  }

  const newUser: User = {
    id: `user-${Date.now()}`,
    name,
    email,
    avatar: `/placeholder.svg?height=40&width=40`,
    status: "online",
  }

  users.push(newUser)
  saveUsers(users)

  // Set as current user
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser))

  return newUser
}

export async function loginUser(email: string, password: string): Promise<User | null> {
  const users = getStoredUsers()
  const user = users.find((u) => u.email === email)

  if (user) {
    // Update user status to online
    user.status = "online"
    saveUsers(users)

    // Set as current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    return user
  }

  return null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(CURRENT_USER_KEY)
  return user ? JSON.parse(user) : null
}

export function logoutUser(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CURRENT_USER_KEY)
}
