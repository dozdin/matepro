"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  ArrowLeft,
  ChevronUp,
  ChevronDown,
  Pin,
  Lock,
  Send,
  Reply as ReplyIcon,
  Eye,
  MessageCircle,
} from "lucide-react"
import { cn, formatRelativeTime, getInitials, getAvatarColor } from "@/lib/utils"
import { useAppStore, type ForumReply } from "@/lib/store"

function ReplyCard({
  reply,
  threadId,
  onVote,
  onReply,
  depth = 0,
}: {
  reply: ForumReply
  threadId: string
  onVote: (replyId: string, vote: number) => void
  onReply: (parentId: string, content: string) => void
  depth?: number
}) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState("")

  const handleSendReply = () => {
    if (!replyContent.trim()) return
    onReply(reply.id, replyContent.trim())
    setReplyContent("")
    setShowReplyForm(false)
    toast.success("Resposta enviada")
  }

  return (
    <div className={cn("flex gap-3", depth > 0 && "ml-6 pl-4 border-l-2 border-border")}>
      <div
        className={cn(
          "shrink-0 flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium text-white",
          getAvatarColor(reply.authorName)
        )}
      >
        {getInitials(reply.authorName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 mb-2 text-sm">
            <span className="font-medium text-foreground">{reply.authorName}</span>
            <span className="text-xs text-muted-foreground">({reply.authorRole})</span>
            <span className="text-xs text-muted-foreground">
              • {formatRelativeTime(new Date(reply.createdAt))}
            </span>
          </div>
          <p className="text-sm text-foreground whitespace-pre-wrap">{reply.content}</p>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => onVote(reply.id, reply.userVote === 1 ? 0 : 1)}
            className={cn(
              "p-1 rounded hover:bg-muted transition-colors",
              reply.userVote === 1 && "text-primary"
            )}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <span
            className={cn(
              "text-xs font-semibold",
              reply.userVote === 1 && "text-primary",
              reply.userVote === -1 && "text-destructive"
            )}
          >
            {reply.votes}
          </span>
          <button
            onClick={() => onVote(reply.id, reply.userVote === -1 ? 0 : -1)}
            className={cn(
              "p-1 rounded hover:bg-muted transition-colors",
              reply.userVote === -1 && "text-destructive"
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowReplyForm(!showReplyForm)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted"
          >
            <ReplyIcon className="h-3 w-3" />
            Respondre
          </button>
        </div>

        {showReplyForm && (
          <div className="mt-3 flex gap-2">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Escriu la teva resposta..."
              rows={2}
              className="flex-1 px-3 py-2 bg-card border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSendReply}
              disabled={!replyContent.trim()}
              className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 self-start"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ThreadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const threadId = params.id as string

  const thread = useAppStore((state) => state.threads.find((t) => t.id === threadId))
  const voteThread = useAppStore((state) => state.voteThread)
  const voteReply = useAppStore((state) => state.voteReply)
  const addReply = useAppStore((state) => state.addReply)

  const [newReply, setNewReply] = useState("")

  if (!thread) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <MessageCircle className="h-12 w-12 text-muted-foreground mb-3" />
        <h2 className="text-xl font-semibold mb-2">Tema no trobat</h2>
        <p className="text-muted-foreground mb-4">Aquest tema no existeix o ha estat eliminat</p>
        <button
          onClick={() => router.push('/forum')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Tornar al fòrum
        </button>
      </div>
    )
  }

  const handleMainReply = () => {
    if (!newReply.trim()) return
    addReply(thread.id, newReply.trim(), null, {
      id: 'current',
      name: 'Tu',
      role: 'Usuari',
    })
    setNewReply("")
    toast.success("Resposta publicada")
  }

  const handleReply = (parentId: string, content: string) => {
    addReply(thread.id, content, parentId, {
      id: 'current',
      name: 'Tu',
      role: 'Usuari',
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/forum"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Tornar al fòrum
      </Link>

      {/* Thread header */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex gap-4">
          {/* Vote */}
          <div className="flex flex-col items-center gap-1">
            <button
              onClick={() => voteThread(thread.id, thread.userVote === 1 ? 0 : 1)}
              className={cn(
                "p-1.5 rounded hover:bg-muted transition-colors",
                thread.userVote === 1 && "text-primary"
              )}
            >
              <ChevronUp className="h-6 w-6" />
            </button>
            <span
              className={cn(
                "text-lg font-bold",
                thread.userVote === 1 && "text-primary",
                thread.userVote === -1 && "text-destructive"
              )}
            >
              {thread.votes}
            </span>
            <button
              onClick={() => voteThread(thread.id, thread.userVote === -1 ? 0 : -1)}
              className={cn(
                "p-1.5 rounded hover:bg-muted transition-colors",
                thread.userVote === -1 && "text-destructive"
              )}
            >
              <ChevronDown className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {thread.isPinned && <Pin className="h-4 w-4 text-primary" />}
              {thread.isLocked && <Lock className="h-4 w-4 text-muted-foreground" />}
              <span className="px-2 py-0.5 text-xs font-medium rounded bg-accent/20 text-accent">
                {thread.categoryName}
              </span>
            </div>

            <h1 className="text-2xl font-bold text-foreground mb-3">{thread.title}</h1>

            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white",
                    getAvatarColor(thread.authorName)
                  )}
                >
                  {getInitials(thread.authorName)}
                </div>
                <span>
                  <span className="text-foreground font-medium">{thread.authorName}</span>{' '}
                  ({thread.authorRole})
                </span>
              </div>
              <span>•</span>
              <span>{formatRelativeTime(new Date(thread.createdAt))}</span>
              <span>•</span>
              <span className="inline-flex items-center gap-1">
                <Eye className="h-3.5 w-3.5" />
                {thread.viewCount} vistes
              </span>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none">
              <p className="whitespace-pre-wrap text-foreground">{thread.content}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Replies count */}
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">
          {thread.replies.length} respost{thread.replies.length !== 1 && 'es'}
        </h2>
      </div>

      {/* Main reply form */}
      {!thread.isLocked ? (
        <div className="bg-card rounded-lg border border-border p-4">
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Escriu una resposta..."
            rows={4}
            className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleMainReply}
              disabled={!newReply.trim()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              Publicar resposta
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border p-4 text-center">
          <Lock className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aquest tema està tancat</p>
        </div>
      )}

      {/* Replies list */}
      <div className="space-y-4">
        {thread.replies.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-lg border border-border">
            <MessageCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Encara no hi ha respostes. Sigues el primer!</p>
          </div>
        ) : (
          thread.replies
            .filter((r) => r.parentId === null)
            .map((reply) => {
              const children = thread.replies.filter((r) => r.parentId === reply.id)
              return (
                <div key={reply.id} className="space-y-3">
                  <ReplyCard
                    reply={reply}
                    threadId={thread.id}
                    onVote={(id, v) => voteReply(thread.id, id, v)}
                    onReply={handleReply}
                  />
                  {children.map((child) => (
                    <ReplyCard
                      key={child.id}
                      reply={child}
                      threadId={thread.id}
                      onVote={(id, v) => voteReply(thread.id, id, v)}
                      onReply={handleReply}
                      depth={1}
                    />
                  ))}
                </div>
              )
            })
        )}
      </div>
    </div>
  )
}
