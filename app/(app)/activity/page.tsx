"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useAppStore, type Activity, type ActivityType } from "@/lib/store"
import { cn, formatRelativeTime } from "@/lib/utils"
import {
  Activity as ActivityIcon,
  CheckCircle2,
  FolderPlus,
  RefreshCw,
  MessageCircle,
  FileUp,
  ListChecks,
  MessageSquare,
  UserPlus,
  Trophy,
  Filter,
  Heart,
  Flame,
  Star,
  ThumbsUp,
} from "lucide-react"

const TYPE_META: Record<ActivityType, { icon: React.ReactNode; color: string; label: string }> = {
  task_created: { icon: <ActivityIcon className="h-4 w-4" />, color: "text-accent bg-accent/15", label: "Tasca creada" },
  task_completed: { icon: <CheckCircle2 className="h-4 w-4" />, color: "text-success bg-success/15", label: "Tasca completada" },
  task_status_changed: { icon: <RefreshCw className="h-4 w-4" />, color: "text-warning bg-warning/20", label: "Canvi d'estat" },
  project_created: { icon: <FolderPlus className="h-4 w-4" />, color: "text-primary bg-primary/15", label: "Nou projecte" },
  project_updated: { icon: <RefreshCw className="h-4 w-4" />, color: "text-primary bg-primary/15", label: "Projecte actualitzat" },
  comment_added: { icon: <MessageCircle className="h-4 w-4" />, color: "text-[color:var(--chart-2)] bg-[color:var(--chart-2)]/15", label: "Comentari" },
  document_uploaded: { icon: <FileUp className="h-4 w-4" />, color: "text-[color:var(--chart-4)] bg-[color:var(--chart-4)]/15", label: "Document" },
  checklist_completed: { icon: <ListChecks className="h-4 w-4" />, color: "text-success bg-success/15", label: "Checklist completada" },
  forum_post: { icon: <MessageSquare className="h-4 w-4" />, color: "text-accent bg-accent/15", label: "Forum" },
  user_joined: { icon: <UserPlus className="h-4 w-4" />, color: "text-[color:var(--chart-5)] bg-[color:var(--chart-5)]/15", label: "Nou usuari" },
  achievement_unlocked: { icon: <Trophy className="h-4 w-4" />, color: "text-warning bg-warning/15", label: "Assoliment" },
}

const REACTIONS = [
  { key: "like", icon: <ThumbsUp className="h-3.5 w-3.5" />, label: "Like" },
  { key: "fire", icon: <Flame className="h-3.5 w-3.5" />, label: "Fire" },
  { key: "heart", icon: <Heart className="h-3.5 w-3.5" />, label: "Heart" },
  { key: "star", icon: <Star className="h-3.5 w-3.5" />, label: "Star" },
]

const CURRENT_USER_ID = "current"

export default function ActivityPage() {
  const activities = useAppStore((s) => s.activities)
  const reactToActivity = useAppStore((s) => s.reactToActivity)
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all")
  const [authorFilter, setAuthorFilter] = useState<string | null>(null)
  const [openReactions, setOpenReactions] = useState<string | null>(null)

  const authors = useMemo(() => {
    const set = new Map<string, string>()
    activities.forEach((a) => set.set(a.actorId, a.actorName))
    return Array.from(set.entries())
  }, [activities])

  const filtered = useMemo(() => {
    return activities.filter((a) => {
      if (typeFilter !== "all" && a.type !== typeFilter) return false
      if (authorFilter && a.actorId !== authorFilter) return false
      return true
    })
  }, [activities, typeFilter, authorFilter])

  const grouped = useMemo(() => {
    const groups: Record<string, Activity[]> = {}
    filtered.forEach((a) => {
      const d = new Date(a.createdAt)
      const today = new Date()
      const yesterday = new Date()
      yesterday.setDate(today.getDate() - 1)
      let label: string
      if (d.toDateString() === today.toDateString()) label = "Avui"
      else if (d.toDateString() === yesterday.toDateString()) label = "Ahir"
      else label = d.toLocaleDateString("ca-ES", { day: "numeric", month: "long", year: "numeric" })
      if (!groups[label]) groups[label] = []
      groups[label].push(a)
    })
    return groups
  }, [filtered])

  const targetLink = (a: Activity): string => {
    switch (a.targetType) {
      case "task":
        return `/tasks/${a.targetId}`
      case "project":
        return `/projects/${a.targetId}`
      case "checklist":
        return `/checklists/${a.targetId}`
      case "forum":
        return `/forum/${a.targetId}`
      case "document":
        return `/documents`
      default:
        return "#"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Activitat</h1>
          <p className="text-muted-foreground mt-1">Tot el que passa al teu drassana en temps real</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>En directe</span>
          </div>
          <span>•</span>
          <span>{filtered.length} esdeveniments</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <button
          onClick={() => setTypeFilter("all")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
            typeFilter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          )}
        >
          Tot
        </button>
        {(Object.entries(TYPE_META) as [ActivityType, typeof TYPE_META[ActivityType]][]).map(([type, meta]) => (
          <button
            key={type}
            onClick={() => setTypeFilter(type)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              typeFilter === type
                ? "bg-primary text-primary-foreground"
                : "bg-card border border-border text-muted-foreground hover:text-foreground"
            )}
          >
            <span className="scale-75">{meta.icon}</span>
            {meta.label}
          </button>
        ))}
        {authors.length > 0 && (
          <select
            value={authorFilter || ""}
            onChange={(e) => setAuthorFilter(e.target.value || null)}
            className="ml-2 bg-card border border-border rounded-lg px-3 py-1.5 text-xs text-foreground"
          >
            <option value="">Tots els usuaris</option>
            {authors.map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        )}
      </div>

      {/* Timeline */}
      {Object.keys(grouped).length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <ActivityIcon className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Sense activitat</h3>
          <p className="text-sm text-muted-foreground">No hi ha esdeveniments per aquests filtres</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([label, items]) => (
            <div key={label}>
              <div className="sticky top-16 z-10 mb-4 bg-background/80 backdrop-blur-sm py-2">
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">{label}</h2>
              </div>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-4">
                  {items.map((activity) => {
                    const meta = TYPE_META[activity.type]
                    const totalReactions = Object.values(activity.reactions || {}).reduce((sum, list) => sum + list.length, 0)
                    return (
                      <div key={activity.id} className="relative pl-12">
                        <div className={cn("absolute left-0 top-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-background", meta.color)}>
                          {meta.icon}
                        </div>
                        <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-semibold text-foreground">{activity.actorName}</span>
                                <span className="text-sm text-muted-foreground">{activity.description}</span>
                                <Link href={targetLink(activity)} className="text-sm font-medium text-primary hover:underline truncate">
                                  {activity.targetName}
                                </Link>
                              </div>
                              {activity.metadata?.comment && (
                                <div className="mt-2 p-3 bg-muted/30 rounded-lg text-sm text-foreground border-l-2 border-primary">
                                  {String(activity.metadata.comment)}
                                </div>
                              )}
                              {activity.metadata?.from && activity.metadata?.to && (
                                <div className="mt-2 flex items-center gap-2 text-xs">
                                  <span className="px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                    {String(activity.metadata.from)}
                                  </span>
                                  <span>→</span>
                                  <span className="px-2 py-0.5 rounded bg-primary/20 text-primary">
                                    {String(activity.metadata.to)}
                                  </span>
                                </div>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {formatRelativeTime(activity.createdAt)}
                            </span>
                          </div>

                          {/* Reactions */}
                          <div className="mt-3 flex items-center gap-2 flex-wrap">
                            {Object.entries(activity.reactions || {}).map(([key, users]) => {
                              const reactionMeta = REACTIONS.find((r) => r.key === key)
                              const reacted = users.includes(CURRENT_USER_ID)
                              return (
                                <button
                                  key={key}
                                  onClick={() => reactToActivity(activity.id, CURRENT_USER_ID, key)}
                                  className={cn(
                                    "flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-colors",
                                    reacted
                                      ? "bg-primary/20 border-primary/40 text-primary"
                                      : "bg-muted/30 border-border text-muted-foreground hover:bg-muted"
                                  )}
                                >
                                  {reactionMeta?.icon}
                                  <span>{users.length}</span>
                                </button>
                              )
                            })}
                            <div className="relative">
                              <button
                                onClick={() => setOpenReactions(openReactions === activity.id ? null : activity.id)}
                                className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-dashed border-border text-xs text-muted-foreground hover:text-foreground hover:border-border"
                              >
                                + Reacciona
                              </button>
                              {openReactions === activity.id && (
                                <div className="absolute bottom-full mb-2 left-0 bg-popover border border-border rounded-lg shadow-lg p-1 flex items-center gap-1 z-20">
                                  {REACTIONS.map((r) => (
                                    <button
                                      key={r.key}
                                      onClick={() => {
                                        reactToActivity(activity.id, CURRENT_USER_ID, r.key)
                                        setOpenReactions(null)
                                      }}
                                      className="flex items-center justify-center w-8 h-8 rounded hover:bg-accent"
                                      title={r.label}
                                    >
                                      {r.icon}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                            {totalReactions > 0 && (
                              <span className="text-xs text-muted-foreground ml-auto">
                                {totalReactions} {totalReactions === 1 ? "reaccio" : "reaccions"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
