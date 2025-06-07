"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { User } from "@/lib/types"

interface UserListProps {
  users: User[]
  onUserSelect?: (userId: string) => void
}

export default function UserList({ users, onUserSelect }: UserListProps) {
  // Sort users by status (online first)
  const sortedUsers = [...users].sort((a, b) => {
    if (a.status === "online" && b.status !== "online") return -1
    if (a.status !== "online" && b.status === "online") return 1
    return a.name.localeCompare(b.name)
  })

  return (
    <div className="p-2 space-y-1">
      {sortedUsers.map((user) => (
        <Button
          key={user.id}
          variant="ghost"
          className="w-full justify-start h-auto p-2"
          onClick={() => onUserSelect?.(user.id)}
        >
          <div className="flex items-center w-full">
            <div className="relative">
              <Avatar className="h-8 w-8 mr-2">
                <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                  user.status === "online"
                    ? "bg-green-500"
                    : user.status === "away"
                      ? "bg-yellow-500"
                      : user.status === "busy"
                        ? "bg-red-500"
                        : "bg-gray-400"
                }`}
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{user.name}</span>
              <Badge variant={user.status === "online" ? "default" : "outline"} className="text-xs">
                {user.status}
              </Badge>
            </div>
          </div>
        </Button>
      ))}
    </div>
  )
}
