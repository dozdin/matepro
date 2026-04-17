"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MessageSquare,
  CheckSquare,
  Send,
  AlertCircle,
  Flag,
  Trash2,
} from "lucide-react"
import { cn, formatDate, formatRelativeTime, getInitials, getAvatarColor } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import { TaskDependencies } from "@/components/tasks/task-dependencies"

const STATUS_LABELS: Record<string, string> = {
  pendent: "Pendent",
  en_curs: "En curs",
  revisio: "Revisió",
  completat: "Completat",
  bloquejat: "Bloquejat",
}

const STATUS_COLORS: Record<string, string> = {
  pendent: "bg-muted text-foreground",
  en_curs: "bg-primary/20 text-primary",
  revisio: "bg-chart-3/20 text-chart-3",
  completat: "bg-chart-5/20 text-chart-5",
  bloquejat: "bg-destructive/20 text-destructive",
}

const PRIORITY_LABELS: Record<string, string> = {
  baixa: "Baixa",
  normal: "Normal",
  alta: "Alta",
  critica: "Crítica",
}

const PRIORITY_COLORS: Record<string, string> = {
  baixa: "text-muted-foreground",
  normal: "text-primary",
  alta: "text-chart-3",
  critica: "text-destructive",
}

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const taskId = params.id as string

  const tasks = useAppStore((state) => state.tasks)
  const projects = useAppStore((state) => state.projects)
  const users = useAppStore((state) => state.users)
  const updateTask = useAppStore((state) => state.updateTask)
  const deleteTask = useAppStore((state) => state.deleteTask)
  const addComment = useAppStore((state) => state.addComment)

  const task = useMemo(() => tasks.find((t) => t.id === taskId), [tasks, taskId])
  const project = useMemo(
    () => (task ? projects.find((p) => p.id === task.projectId) : null),
    [task, projects],
  )
  const assignee = useMemo(
    () => (task?.assigneeId ? users.find((u) => u.id === task.assigneeId) : null),
    [task, users],
  )

  const [newComment, setNewComment] = useState("")

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <AlertCircle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-xl font-bold">Tasca no trobada</h2>
        <Link
          href="/tasks"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <ArrowLeft className="h-4 w-4" />
          Tornar a Tasques
        </Link>
      </div>
    )
  }

  const handleStatusChange = (newStatus: typeof task.status) => {
    updateTask(task.id, { status: newStatus })
    toast.success(`Estat canviat a ${STATUS_LABELS[newStatus]}`)
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return
    addComment(task.id, {
      author: "Tu",
      authorId: "current",
      content: newComment.trim(),
    })
    setNewComment("")
    toast.success("Comentari afegit")
  }

  const handleDelete = () => {
    if (confirm(`Segur que vols eliminar la tasca "${task.title}"?`)) {
      deleteTask(task.id)
      toast.success("Tasca eliminada")
      router.push("/tasks")
    }
  }

  const completedChecklist = task.checklist?.filter((c) => c.completed).length || 0
  const totalChecklist = task.checklist?.length || 0
  const progress = totalChecklist > 0 ? Math.round((completedChecklist / totalChecklist) * 100) : 0

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link href="/tasks" className="flex items-center gap-1 hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
          Tasques
        </Link>
        <span>/</span>
        <span className="text-foreground">{task.code || task.id}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-muted-foreground">{task.code || task.id}</span>
            {project && (
              <>
                <span className="text-muted-foreground">·</span>
                <Link
                  href={`/projects/${project.id}`}
                  className="text-xs text-primary hover:underline"
                >
                  {project.name}
                </Link>
              </>
            )}
          </div>
          <h1 className="text-3xl font-bold text-foreground text-balance">{task.title}</h1>
        </div>
        <button
          onClick={handleDelete}
          className="flex items-center gap-2 px-3 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-sm"
        >
          <Trash2 className="h-4 w-4" />
          Eliminar
        </button>
      </div>

      {/* Status & priority controls */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Estat:</span>
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as typeof task.status)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
              STATUS_COLORS[task.status],
            )}
          >
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value} className="bg-background text-foreground">
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Flag className={cn("h-4 w-4", PRIORITY_COLORS[task.priority])} />
          <span className="text-sm text-muted-foreground">Prioritat:</span>
          <span className={cn("text-sm font-medium", PRIORITY_COLORS[task.priority])}>
            {PRIORITY_LABELS[task.priority]}
          </span>
        </div>

        {task.dueDate && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Venciment:</span>
            <span className="text-sm font-medium">{formatDate(task.dueDate)}</span>
          </div>
        )}

        {task.estimatedHours && (
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Est.:</span>
            <span className="text-sm font-medium">{task.estimatedHours}h</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="p-6 bg-card border border-border rounded-xl">
            <h2 className="text-lg font-semibold mb-3">Descripció</h2>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {task.description || "Sense descripció"}
            </p>
          </div>

          {/* Dependencies graph */}
          <TaskDependencies taskId={task.id} />

          {/* Checklist */}
          {totalChecklist > 0 && (
            <div className="p-6 bg-card border border-border rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <CheckSquare className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-semibold">Checklist</h2>
                </div>
                <span className="text-sm text-muted-foreground">
                  {completedChecklist}/{totalChecklist} ({progress}%)
                </span>
              </div>
              <div className="space-y-2">
                {task.checklist?.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 p-2 rounded hover:bg-muted/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => {
                        const updated = task.checklist!.map((c) =>
                          c.id === item.id ? { ...c, completed: !c.completed } : c,
                        )
                        updateTask(task.id, { checklist: updated })
                      }}
                      className="h-4 w-4 accent-primary"
                    />
                    <span
                      className={cn(
                        "flex-1",
                        item.completed && "line-through text-muted-foreground",
                      )}
                    >
                      {item.title}
                    </span>
                  </label>
                ))}
              </div>
              <div className="mt-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Comments */}
          <div className="p-6 bg-card border border-border rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Comentaris ({task.comments?.length || 0})</h2>
            </div>

            <div className="space-y-4 mb-4">
              {task.comments?.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div
                    className={cn(
                      "h-9 w-9 rounded-full flex items-center justify-center text-sm font-medium text-white flex-shrink-0",
                      getAvatarColor(comment.author),
                    )}
                  >
                    {getInitials(comment.author)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatRelativeTime(new Date(comment.createdAt))}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              ))}
              {(!task.comments || task.comments.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Encara no hi ha comentaris
                </p>
              )}
            </div>

            <form onSubmit={handleAddComment} className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escriu un comentari..."
                className="flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <button
                type="submit"
                disabled={!newComment.trim()}
                className="flex items-center gap-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 text-sm"
              >
                <Send className="h-4 w-4" />
                Enviar
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Details */}
          <div className="p-6 bg-card border border-border rounded-xl space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalls
            </h3>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-muted-foreground">Assignat</label>
                {assignee ? (
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium text-white",
                        getAvatarColor(assignee.name),
                      )}
                    >
                      {getInitials(assignee.name)}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{assignee.name}</div>
                      <div className="text-xs text-muted-foreground">{assignee.roleLabel}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground mt-1">Sense assignar</div>
                )}
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Projecte</label>
                {project ? (
                  <Link
                    href={`/projects/${project.id}`}
                    className="block text-sm text-primary hover:underline mt-1"
                  >
                    {project.name}
                  </Link>
                ) : (
                  <div className="text-sm text-muted-foreground mt-1">-</div>
                )}
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Creat</label>
                <div className="text-sm mt-1">{formatDate(new Date(task.createdAt))}</div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Actualitzat</label>
                <div className="text-sm mt-1">
                  {formatRelativeTime(new Date(task.updatedAt))}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="p-6 bg-card border border-border rounded-xl">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Etiquetes
              </h3>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-muted text-xs rounded-md text-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
