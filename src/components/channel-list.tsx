import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Hash, Lock } from "lucide-react"
import type { Channel } from "@/lib/types"

interface ChannelListProps {
  channels: Channel[]
  activeChannel: string
  onSelectChannel: (channelId: string) => void
}

export default function ChannelList({ channels, activeChannel, onSelectChannel }: ChannelListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="p-2">
        {channels.map((channel) => (
          <Button
            key={channel.id}
            variant={activeChannel === channel.id ? "secondary" : "ghost"}
            className="w-full justify-start mb-1"
            onClick={() => onSelectChannel(channel.id)}
          >
            {channel.isPrivate ? <Lock className="h-4 w-4 mr-2" /> : <Hash className="h-4 w-4 mr-2" />}
            {channel.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}
