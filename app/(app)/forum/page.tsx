"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  MessageSquare,
  TrendingUp,
  Clock,
  Flame,
  Pin,
  ChevronUp,
  ChevronDown,
  MessageCircle,
  Eye,
  Plus,
  Search,
} from "lucide-react"
import { cn, formatRelativeTime } from "@/lib/utils"
import { CreateThreadModal } from "@/components/modals"
import { useAppStore, type ForumThread } from "@/lib/store"

type SortOption = "hot" | "new" | "top"

const CATEGORIES = [
  { id: "cat_general", name: "General", color: "bg-blue-500" },
  { id: "cat_tecnic", name: "Tècnic", color: "bg-orange-500" },
  { id: "cat_projectes", name: "Projectes", color: "bg-green-500" },
  { id: "cat_normatives", name: "Normatives", color: "bg-red-500" },
  { id: "cat_ajuda", name: "Ajuda", color: "bg-purple-500" },
  { id: "cat_off_topic", name: "Off-Topic", color: "bg-gray-500" },
]

function ThreadCard({ thread, onVote }: { thread: ForumThread; onVote: (threadId: string, vote: number) => void }) {
  const categoryColor = CATEGORIES.find(c => c.id === thread.categoryId)?.color || 'bg-gray-500'

  return (
    <div
      className={cn(
        "flex gap-4 p-4 rounded-lg border transition-colors",
        thread.isPinned
          ? "bg-accent/30 border-accent"
          : "bg-card border-border hover:border-muted-foreground/30"
      )}
    >
      {/* Vote buttons */}
      <div className="flex flex-col items-center gap-1">
        <button
          onClick={() => onVote(thread.id, thread.userVote === 1 ? 0 : 1)}
          className={cn(
            "p-1 rounded hover:bg-muted transition-colors",
            thread.userVote === 1 && "text-primary"
          )}
        >
          <ChevronUp className="h-5 w-5" />
        </button>
        <span
          className={cn(
            "text-sm font-semibold",
            thread.userVote === 1 && "text-primary",
            thread.userVote === -1 && "text-destructive"
          )}
        >
          {thread.votes}
        </span>
        <button
          onClick={() => onVote(thread.id, thread.userVote === -1 ? 0 : -1)}
          className={cn(
            "p-1 rounded hover:bg-muted transition-colors",
            thread.userVote === -1 && "text-destructive"
          )}
        >
          <ChevronDown className="h-5 w-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {thread.isPinned && <Pin className="h-4 w-4 text-primary" />}
          <span className={cn("px-2 py-0.5 text-xs font-medium rounded text-white", categoryColor)}>
            {thread.categoryName}
          </span>
          <span className="text-xs text-muted-foreground">
            Publicat per <span className="text-foreground">{thread.authorName}</span> ({thread.authorRole})
          </span>
          <span className="text-xs text-muted-foreground">
            {formatRelativeTime(new Date(thread.createdAt))}
          </span>
        </div>

        <Link href={`/forum/${thread.id}`} className="block group">
          <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {thread.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{thread.content}</p>
        </Link>

        <div className="flex flex-wrap items-center gap-4 mt-3">
          <Link
            href={`/forum/${thread.id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            {thread.replyCount} respostes
          </Link>
          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Eye className="h-4 w-4" />
            {thread.viewCount} vistes
          </span>
          <span className="text-xs text-muted-foreground">
            Ultima resposta {formatRelativeTime(new Date(thread.lastReplyAt))}
          </span>
        </div>
      </div>
    </div>
  )
}

export default function ForumPage() {
  const threads = useAppStore((state) => state.threads)
  const voteThread = useAppStore((state) => state.voteThread)
  const addThread = useAppStore((state) => state.addThread)

  const [sortBy, setSortBy] = useState<SortOption>("hot")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreateThread = (data: { title: string; content: string; categoryId: string }) => {
    const category = CATEGORIES.find((c) => c.id === data.categoryId) || CATEGORIES[0]
    addThread({
      title: data.title,
      content: data.content,
      categoryId: category.id,
      categoryName: category.name,
      categoryColor: category.color,
      authorId: 'current',
      authorName: 'Tu',
      authorRole: 'Usuari',
    })
  }

  const handleVote = (threadId: string, vote: number) => {
    voteThread(threadId, vote)
  }

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    threads.forEach((t) => {
      counts[t.categoryId] = (counts[t.categoryId] || 0) + 1
    })
    return counts
  }, [threads])

  const filteredThreads = useMemo(() => {
    return threads
      .filter((thread) => {
        if (selectedCategory && thread.categoryId !== selectedCategory) return false
        const q = searchQuery.toLowerCase().trim()
        if (!q) return true
        return thread.title.toLowerCase().includes(q) || thread.content.toLowerCase().includes(q)
      })
      .slice()
      .sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1

        switch (sortBy) {
          case "hot":
            return b.votes + b.replyCount * 2 - (a.votes + a.replyCount * 2)
          case "new":
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          case "top":
            return b.votes - a.votes
          default:
            return 0
        }
      })
  }, [threads, selectedCategory, searchQuery, sortBy])

  const totalReplies = threads.reduce((sum, t) => sum + t.replyCount, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Fòrum</h1>
          <p className="text-muted-foreground mt-1">Discussions i anuncis de l&apos;equip</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nou Tema
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar - Categories */}
        <div className="lg:w-64 shrink-0 space-y-4">
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">Categories</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <span>Totes</span>
                <span>{threads.length}</span>
              </button>
              {CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 rounded-md text-sm transition-colors",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("w-2 h-2 rounded-full", category.color)} />
                    <span>{category.name}</span>
                  </div>
                  <span>{categoryCounts[category.id] || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Forum Stats */}
          <div className="bg-card rounded-lg border border-border p-4">
            <h3 className="font-semibold text-foreground mb-3">Estadistiques</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total temes</span>
                <span className="text-foreground font-medium">{threads.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Respostes</span>
                <span className="text-foreground font-medium">{totalReplies}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fixats</span>
                <span className="text-foreground font-medium">
                  {threads.filter((t) => t.isPinned).length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cercar temes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1">
              <button
                onClick={() => setSortBy("hot")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  sortBy === "hot"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Flame className="h-4 w-4" />
                Hot
              </button>
              <button
                onClick={() => setSortBy("new")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  sortBy === "new"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Clock className="h-4 w-4" />
                Nou
              </button>
              <button
                onClick={() => setSortBy("top")}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  sortBy === "top"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <TrendingUp className="h-4 w-4" />
                Top
              </button>
            </div>
          </div>

          {/* Threads List */}
          <div className="space-y-3">
            {filteredThreads.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-lg border border-border">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No s&apos;han trobat temes</p>
              </div>
            ) : (
              filteredThreads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} onVote={handleVote} />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Thread Modal */}
      <CreateThreadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateThread}
      />
    </div>
  )
}
