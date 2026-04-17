"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  Bell,
  CheckCircle2,
  MessageSquare,
  FolderKanban,
  AlertTriangle,
  Settings,
  Trash2,
  Check,
  AtSign,
  Clock,
  Zap,
  Reply,
  ExternalLink,
  Flame,
  ChevronRight,
} from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"
import { useAppStore, type Notification } from "@/lib/store"

const NOTIFICATION_ICONS = {
  task: CheckCircle2,
  mention: AtSign,
  project: FolderKanban,
  message: MessageSquare,
  system: AlertTriangle,
} as const

const NOTIFICATION_COLORS = {
  task: "text-chart-5 bg-chart-5/10",
  mention: "text-primary bg-primary/10",
  project: "text-chart-3 bg-chart-3/10",
  message: "text-chart-2 bg-chart-2/10",
  system: "text-destructive bg-destructive/10",
} as const

const NOTIFICATION_LABELS = {
  task: "Tasca",
  mention: "Mencio",
  project: "Projecte",
  message: "Missatge",
  system: "Sistema",
} as const

const PRIORITY_STYLES = {
  urgent: "border-l-destructive bg-destructive/5",
  high: "border-l-chart-3 bg-chart-3/5",
  normal: "border-l-primary/50",
  low: "border-l-muted-foreground/30",
} as const

type TabId = "all" | "unread" | Notification["type"]

export default function NotificationsPage() {
  const notifications = useAppStore((state) => state.notifications)
  const tasks = useAppStore((state) => state.tasks)
  const markNotificationRead = useAppStore((state) => state.markNotificationRead)
  const markAllNotificationsRead = useAppStore((state) => state.markAllNotificationsRead)
  const deleteNotification = useAppStore((state) => state.deleteNotification)
  const snoozeNotification = useAppStore((state) => state.snoozeNotification)
  const updateTask = useAppStore((state) => state.updateTask)

  const [filter, setFilter] = useState<TabId>("all")
  const [quickReply, setQuickReply] = useState<{ id: string; value: string } | null>(null)

  const now = Date.now()

  // Active = not snoozed, or snooze time has passed
  const activeNotifications = useMemo(
    () =>
      notifications.filter(
        (n) => !n.snoozedUntil || new Date(n.snoozedUntil).getTime() <= now,
      ),
    [notifications, now],
  )

  const unreadCount = activeNotifications.filter((n) => !n.read).length
  const urgentCount = activeNotifications.filter((n) => n.priority === "urgent" && !n.read).length

  const filteredNotifications = useMemo(() => {
    return activeNotifications.filter((n) => {
      if (filter === "all") return true
      if (filter === "unread") return !n.read
      return n.type === filter
    })
  }, [activeNotifications, filter])

  // Group by priority when showing all/unread
  const grouped = useMemo(() => {
    if (filter !== "all" && filter !== "unread") {
      return [{ key: "all", label: "", items: filteredNotifications }]
    }
    const urgent = filteredNotifications.filter((n) => n.priority === "urgent")
    const high = filteredNotifications.filter((n) => n.priority === "high")
    const normal = filteredNotifications.filter(
      (n) => !n.priority || n.priority === "normal",
    )
    const low = filteredNotifications.filter((n) => n.priority === "low")
    return [
      { key: "urgent", label: "Urgent", items: urgent, icon: Flame, color: "text-destructive" },
      { key: "high", label: "Prioritat alta", items: high, icon: Zap, color: "text-chart-3" },
      { key: "normal", label: "Normal", items: normal, icon: Bell, color: "text-primary" },
      { key: "low", label: "Baixa prioritat", items: low, icon: Bell, color: "text-muted-foreground" },
    ].filter((g) => g.items.length > 0)
  }, [filteredNotifications, filter])

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return
    markAllNotificationsRead()
    toast.success("Totes les notificacions marcades com a llegides")
  }

  const handleSnooze = (id: string, hours: number) => {
    const until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString()
    snoozeNotification(id, until)
    toast.success(`Notificacio posposada ${hours}h`)
  }

  const handleCompleteTask = (taskId: string, notifId: string) => {
    updateTask(taskId, { status: "completat" })
    markNotificationRead(notifId)
    toast.success("Tasca marcada com a completada")
  }

  const handleQuickReply = (notifId: string) => {
    if (!quickReply?.value.trim()) return
    markNotificationRead(notifId)
    setQuickReply(null)
    toast.success("Resposta enviada")
  }

  const TABS: { id: TabId; label: string; icon?: React.ComponentType<{ className?: string }> }[] = [
    { id: "all", label: "Totes", icon: Bell },
    { id: "unread", label: "Sense llegir" },
    { id: "task", label: "Tasques", icon: CheckCircle2 },
    { id: "mention", label: "Mencions", icon: AtSign },
    { id: "project", label: "Projectes", icon: FolderKanban },
    { id: "message", label: "Missatges", icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-foreground">Notificacions</h1>
            {urgentCount > 0 && (
              <span className="flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive text-xs font-medium rounded-full">
                <Flame className="h-3 w-3" />
                {urgentCount} urgent
              </span>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            {unreadCount > 0
              ? `Tens ${unreadCount} notificacio${unreadCount === 1 ? "" : "ns"} sense llegir`
              : "Totes les notificacions llegides"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            Marcar tot llegit
          </button>
          <Link
            href="/settings"
            className="rounded-lg border border-border p-2 hover:bg-muted transition-colors"
            aria-label="Configuracio"
          >
            <Settings className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1 w-fit overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={cn(
                "px-3 py-2 text-sm rounded-md transition-colors whitespace-nowrap flex items-center gap-2",
                filter === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {Icon && <Icon className="h-4 w-4" />}
              {tab.label}
              {tab.id === "unread" && unreadCount > 0 && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 text-xs rounded-full",
                    filter === tab.id
                      ? "bg-primary-foreground/20 text-primary-foreground"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {unreadCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Grouped notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-card rounded-lg border border-border">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
            <Bell className="h-6 w-6 text-muted-foreground" />
          </div>
          <p className="font-medium">Cap notificacio</p>
          <p className="text-sm text-muted-foreground mt-1">
            {filter === "unread" ? "Estas al dia!" : "No hi ha notificacions per mostrar"}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map((group) => (
            <div key={group.key}>
              {group.label && (
                <div className="flex items-center gap-2 mb-2 px-1">
                  {group.icon && <group.icon className={cn("h-4 w-4", group.color)} />}
                  <h2 className={cn("text-sm font-semibold uppercase tracking-wide", group.color)}>
                    {group.label}
                  </h2>
                  <span className="text-xs text-muted-foreground">({group.items.length})</span>
                </div>
              )}
              <div className="space-y-2">
                {group.items.map((notification) => {
                  const Icon = NOTIFICATION_ICONS[notification.type]
                  const colorClass = NOTIFICATION_COLORS[notification.type]
                  const typeLabel = NOTIFICATION_LABELS[notification.type]
                  const priorityStyle =
                    PRIORITY_STYLES[notification.priority ?? "normal"] ?? PRIORITY_STYLES.normal
                  const relatedTask = notification.relatedTaskId
                    ? tasks.find((t) => t.id === notification.relatedTaskId)
                    : null
                  const isQuickReplying = quickReply?.id === notification.id

                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "group border-l-4 border border-border rounded-lg transition-all",
                        priorityStyle,
                        !notification.read && "shadow-sm",
                      )}
                    >
                      <div className="flex items-start gap-3 p-4">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full shrink-0",
                            colorClass,
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={cn(
                                  "text-xs font-medium px-1.5 py-0.5 rounded",
                                  colorClass,
                                )}
                              >
                                {typeLabel}
                              </span>
                              {!notification.read && (
                                <span className="flex items-center gap-1 text-xs text-primary">
                                  <span className="h-2 w-2 bg-primary rounded-full" />
                                  Nou
                                </span>
                              )}
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                            <button
                              onClick={() => {
                                deleteNotification(notification.id)
                                toast.success("Notificacio eliminada")
                              }}
                              className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Eliminar"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>

                          <h3
                            className={cn(
                              "text-foreground mb-1",
                              !notification.read ? "font-semibold" : "font-medium",
                            )}
                          >
                            {notification.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>

                          {/* Inline actions */}
                          {isQuickReplying ? (
                            <div className="mt-3 flex items-center gap-2">
                              <input
                                type="text"
                                autoFocus
                                placeholder="Escriu una resposta rapida..."
                                value={quickReply?.value ?? ""}
                                onChange={(e) =>
                                  setQuickReply({ id: notification.id, value: e.target.value })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") handleQuickReply(notification.id)
                                  if (e.key === "Escape") setQuickReply(null)
                                }}
                                className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                              />
                              <button
                                onClick={() => handleQuickReply(notification.id)}
                                disabled={!quickReply?.value.trim()}
                                className="px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50"
                              >
                                Enviar
                              </button>
                              <button
                                onClick={() => setQuickReply(null)}
                                className="px-3 py-2 text-muted-foreground hover:text-foreground text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              {/* Complete task inline action */}
                              {relatedTask && relatedTask.status !== "completat" && (
                                <button
                                  onClick={() =>
                                    handleCompleteTask(relatedTask.id, notification.id)
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 bg-chart-5/10 text-chart-5 hover:bg-chart-5/20 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <CheckCircle2 className="h-3.5 w-3.5" />
                                  Completar tasca
                                </button>
                              )}

                              {/* Quick reply for mentions and messages */}
                              {(notification.type === "mention" ||
                                notification.type === "message") && (
                                <button
                                  onClick={() =>
                                    setQuickReply({ id: notification.id, value: "" })
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Reply className="h-3.5 w-3.5" />
                                  Respondre
                                </button>
                              )}

                              {/* Action URL */}
                              {notification.actionUrl && (
                                <Link
                                  href={notification.actionUrl}
                                  onClick={() =>
                                    !notification.read && markNotificationRead(notification.id)
                                  }
                                  className="flex items-center gap-1 px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <ExternalLink className="h-3.5 w-3.5" />
                                  Obrir
                                  <ChevronRight className="h-3.5 w-3.5" />
                                </Link>
                              )}

                              {/* Mark read */}
                              {!notification.read && (
                                <button
                                  onClick={() => {
                                    markNotificationRead(notification.id)
                                    toast.success("Marcada com a llegida")
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 text-muted-foreground hover:bg-muted rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Check className="h-3.5 w-3.5" />
                                  Llegida
                                </button>
                              )}

                              {/* Snooze dropdown */}
                              <div className="relative group/snooze">
                                <button className="flex items-center gap-1 px-3 py-1.5 text-muted-foreground hover:bg-muted rounded-lg text-xs font-medium transition-colors">
                                  <Clock className="h-3.5 w-3.5" />
                                  Posposar
                                </button>
                                <div className="absolute top-full left-0 mt-1 hidden group-hover/snooze:block z-10 bg-popover border border-border rounded-lg shadow-lg py-1 min-w-[140px]">
                                  {[
                                    { h: 1, label: "1 hora" },
                                    { h: 4, label: "4 hores" },
                                    { h: 24, label: "Demà" },
                                    { h: 24 * 7, label: "La propera setmana" },
                                  ].map((opt) => (
                                    <button
                                      key={opt.h}
                                      onClick={() => handleSnooze(notification.id, opt.h)}
                                      className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors"
                                    >
                                      {opt.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
