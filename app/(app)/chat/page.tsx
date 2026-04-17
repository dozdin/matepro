"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import {
  Hash,
  Lock,
  Users,
  Plus,
  Search,
  Send,
  Paperclip,
  Smile,
  MoreHorizontal,
  Phone,
  Video,
  Bell,
} from "lucide-react"
import { toast } from "sonner"
import { cn, formatRelativeTime, getInitials, getAvatarColor } from "@/lib/utils"
import { useAppStore } from "@/lib/store"

const CURRENT_USER = {
  id: "demo-admin",
  name: "Carlos Martinez",
  role: "Administrador",
}

export default function ChatPage() {
  const channels = useAppStore((state) => state.channels)
  const messages = useAppStore((state) => state.messages)
  const users = useAppStore((state) => state.users)
  const addMessage = useAppStore((state) => state.addMessage)
  const deleteMessage = useAppStore((state) => state.deleteMessage)

  const [selectedChannelId, setSelectedChannelId] = useState<string>(channels[0]?.id || "ch_general")
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selectedChannel = channels.find((c) => c.id === selectedChannelId)
  const channelMessages = useMemo(
    () =>
      messages
        .filter((m) => m.channelId === selectedChannelId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()),
    [messages, selectedChannelId]
  )

  const filteredChannels = useMemo(
    () =>
      channels.filter((c) => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return true
        return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      }),
    [channels, searchQuery]
  )

  const publicChannels = filteredChannels.filter((c) => c.type === "public")
  const privateChannels = filteredChannels.filter((c) => c.type === "private")

  // Simulate direct messages with other users
  const directMessages = useMemo(
    () =>
      users
        .filter((u) => u.id !== CURRENT_USER.id && u.status === "active")
        .slice(0, 5),
    [users]
  )

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [channelMessages.length, selectedChannelId])

  // Focus input when channel changes
  useEffect(() => {
    inputRef.current?.focus()
  }, [selectedChannelId])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    addMessage({
      channelId: selectedChannelId,
      authorId: CURRENT_USER.id,
      authorName: CURRENT_USER.name,
      content: messageInput.trim(),
    })
    setMessageInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleDeleteMessage = (id: string) => {
    deleteMessage(id)
    toast.success("Missatge eliminat")
  }

  // Group messages by author for consecutive messages
  const groupedMessages = useMemo(() => {
    const groups: { authorId: string; authorName: string; messages: typeof channelMessages }[] = []
    channelMessages.forEach((msg) => {
      const lastGroup = groups[groups.length - 1]
      if (lastGroup && lastGroup.authorId === msg.authorId) {
        lastGroup.messages.push(msg)
      } else {
        groups.push({
          authorId: msg.authorId,
          authorName: msg.authorName,
          messages: [msg],
        })
      }
    })
    return groups
  }, [channelMessages])

  return (
    <div className="flex h-[calc(100vh-7rem)] -mx-4 md:-mx-6 -my-4 md:-my-6 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-bold mb-3">Chat</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cercar canals..."
              className="w-full pl-9 pr-3 py-2 bg-muted/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Public channels */}
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Canals Publics
              </span>
              <button className="text-muted-foreground hover:text-foreground">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-0.5">
              {publicChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannelId(channel.id)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left",
                    selectedChannelId === channel.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Hash className="h-4 w-4 shrink-0" />
                  <span className="flex-1 truncate">{channel.name}</span>
                  {channel.unreadCount > 0 && (
                    <span className="shrink-0 bg-destructive text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Private channels */}
          {privateChannels.length > 0 && (
            <div className="p-2">
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs font-semibold uppercase text-muted-foreground">
                  Canals Privats
                </span>
              </div>
              <div className="space-y-0.5">
                {privateChannels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setSelectedChannelId(channel.id)}
                    className={cn(
                      "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left",
                      selectedChannelId === channel.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Lock className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{channel.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct messages */}
          <div className="p-2">
            <div className="flex items-center justify-between px-2 py-1.5">
              <span className="text-xs font-semibold uppercase text-muted-foreground">
                Missatges Directes
              </span>
            </div>
            <div className="space-y-0.5">
              {directMessages.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedChannelId(`dm_${user.id}`)}
                  className={cn(
                    "w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors text-left",
                    selectedChannelId === `dm_${user.id}`
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <div className="relative shrink-0">
                    <div
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium text-white",
                        getAvatarColor(user.name)
                      )}
                    >
                      {getInitials(user.name)}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-success ring-2 ring-card" />
                  </div>
                  <span className="flex-1 truncate">{user.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background">
        {selectedChannel ? (
          <>
            {/* Channel header */}
            <div className="h-14 shrink-0 border-b border-border bg-card flex items-center justify-between px-4">
              <div className="flex items-center gap-2 min-w-0">
                {selectedChannel.type === "public" ? (
                  <Hash className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <Lock className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <h1 className="font-semibold truncate">{selectedChannel.name}</h1>
                <span className="text-sm text-muted-foreground hidden md:inline">
                  | {selectedChannel.description}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded hover:bg-muted" title="Membres">
                  <Users className="h-4 w-4" />
                  <span className="sr-only">Membres</span>
                </button>
                <button className="p-2 rounded hover:bg-muted" title="Trucada">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="p-2 rounded hover:bg-muted" title="Videotrucada">
                  <Video className="h-4 w-4" />
                </button>
                <button className="p-2 rounded hover:bg-muted" title="Notificacions">
                  <Bell className="h-4 w-4" />
                </button>
                <button className="p-2 rounded hover:bg-muted" title="Mes">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {channelMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Hash className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-1">
                    Benvingut a #{selectedChannel.name}
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    {selectedChannel.description ||
                      'Aquest es el comencement del canal. Envia el primer missatge!'}
                  </p>
                </div>
              ) : (
                groupedMessages.map((group, groupIndex) => {
                  const isCurrentUser = group.authorId === CURRENT_USER.id
                  return (
                    <div key={groupIndex} className="flex gap-3 group">
                      <div
                        className={cn(
                          "shrink-0 flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white",
                          getAvatarColor(group.authorName)
                        )}
                      >
                        {getInitials(group.authorName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-foreground">
                            {group.authorName}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(new Date(group.messages[0].createdAt))}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {group.messages.map((msg) => (
                            <div
                              key={msg.id}
                              className="group/msg flex items-start gap-2 hover:bg-muted/50 -mx-2 px-2 py-0.5 rounded"
                            >
                              <p className="flex-1 text-sm text-foreground whitespace-pre-wrap break-words">
                                {msg.content}
                                {msg.edited && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    (editat)
                                  </span>
                                )}
                              </p>
                              {isCurrentUser && (
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="opacity-0 group-hover/msg:opacity-100 text-xs text-destructive hover:underline shrink-0"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input */}
            <div className="shrink-0 p-4 border-t border-border bg-card">
              <div className="flex items-end gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground rounded">
                  <Paperclip className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder={`Missatge a #${selectedChannel.name}`}
                    className="w-full px-4 py-2.5 bg-muted/50 border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground">
                    <Smile className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim()}
                  className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Prem Enter per enviar, Shift+Enter per salt de linia
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Selecciona un canal</p>
          </div>
        )}
      </div>
    </div>
  )
}
