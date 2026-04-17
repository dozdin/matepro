"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
  GitBranch,
  Plus,
  X,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Ban,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAppStore, type Task } from "@/lib/store"

const STATUS_CONFIG = {
  pendent: { icon: Clock, color: "text-muted-foreground", label: "Pendent" },
  en_curs: { icon: Clock, color: "text-primary", label: "En curs" },
  revisio: { icon: AlertCircle, color: "text-chart-3", label: "Revisio" },
  completat: { icon: CheckCircle2, color: "text-chart-5", label: "Completat" },
  bloquejat: { icon: Ban, color: "text-destructive", label: "Bloquejat" },
} as const

type Props = {
  taskId: string
}

export function TaskDependencies({ taskId }: Props) {
  const tasks = useAppStore((state) => state.tasks)
  const updateTask = useAppStore((state) => state.updateTask)
  const [adding, setAdding] = useState(false)
  const [search, setSearch] = useState("")

  const task = tasks.find((t) => t.id === taskId)
  const dependencies = task?.dependencies ?? []

  const blockers = useMemo(
    () =>
      dependencies
        .map((id) => tasks.find((t) => t.id === id))
        .filter((t): t is Task => Boolean(t)),
    [dependencies, tasks],
  )

  const dependents = useMemo(
    () => tasks.filter((t) => t.dependencies?.includes(taskId)),
    [tasks, taskId],
  )

  const availableTasks = useMemo(() => {
    return tasks
      .filter((t) => t.id !== taskId && !dependencies.includes(t.id))
      .filter((t) => {
        if (!search) return true
        const q = search.toLowerCase()
        return t.title.toLowerCase().includes(q) || (t.code || "").toLowerCase().includes(q)
      })
      .slice(0, 8)
  }, [tasks, taskId, dependencies, search])

  const blockedByIncomplete = blockers.filter((b) => b.status !== "completat")
  const isBlocked = blockedByIncomplete.length > 0

  const handleAdd = (depId: string) => {
    if (!task) return
    const newDeps = [...dependencies, depId]
    updateTask(taskId, { dependencies: newDeps })
    toast.success("Dependencia afegida")
    setSearch("")
    setAdding(false)
  }

  const handleRemove = (depId: string) => {
    if (!task) return
    updateTask(taskId, { dependencies: dependencies.filter((id) => id !== depId) })
    toast.success("Dependencia eliminada")
  }

  if (!task) return null

  return (
    <div className="p-6 bg-card border border-border rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitBranch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Dependencies</h2>
          {isBlocked && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full">
              <Ban className="h-3 w-3" />
              Bloquejada
            </span>
          )}
        </div>
        <button
          onClick={() => setAdding((v) => !v)}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-muted hover:bg-muted/80 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Afegir
        </button>
      </div>

      {/* Graph visualization */}
      <div className="mb-6 p-6 bg-background/50 border border-border rounded-lg overflow-x-auto">
        <div className="flex items-center justify-center gap-4 min-w-max">
          {/* Blockers column */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">
              Bloqueja ({blockers.length})
            </div>
            {blockers.length === 0 && (
              <div className="text-xs text-muted-foreground italic p-3 border border-dashed border-border rounded-lg w-48 text-center">
                Sense blockers
              </div>
            )}
            {blockers.map((b) => {
              const cfg = STATUS_CONFIG[b.status]
              const Icon = cfg.icon
              return (
                <Link
                  key={b.id}
                  href={`/tasks/${b.id}`}
                  className={cn(
                    "flex items-center gap-2 p-3 border rounded-lg hover:bg-muted/50 transition-colors w-48",
                    b.status === "completat"
                      ? "border-chart-5/30 bg-chart-5/5"
                      : "border-destructive/30 bg-destructive/5",
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", cfg.color)} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{b.title}</div>
                    <div className={cn("text-xs", cfg.color)}>{cfg.label}</div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />

          {/* Current task */}
          <div className="flex flex-col">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">
              Aquesta tasca
            </div>
            <div
              className={cn(
                "flex items-center gap-2 p-3 border-2 rounded-lg w-52 shadow-lg",
                isBlocked
                  ? "border-destructive/50 bg-destructive/10"
                  : "border-primary/50 bg-primary/10",
              )}
            >
              <div
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                  isBlocked ? "bg-destructive/20" : "bg-primary/20",
                )}
              >
                {isBlocked ? (
                  <Ban className="h-4 w-4 text-destructive" />
                ) : (
                  <GitBranch className="h-4 w-4 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold truncate">{task.title}</div>
                <div className="text-xs text-muted-foreground">
                  {isBlocked ? "Esperant blockers" : "Llesta"}
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />

          {/* Dependents column */}
          <div className="flex flex-col gap-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase mb-1">
              Desbloqueja ({dependents.length})
            </div>
            {dependents.length === 0 && (
              <div className="text-xs text-muted-foreground italic p-3 border border-dashed border-border rounded-lg w-48 text-center">
                Res a desbloquejar
              </div>
            )}
            {dependents.map((d) => {
              const cfg = STATUS_CONFIG[d.status]
              const Icon = cfg.icon
              return (
                <Link
                  key={d.id}
                  href={`/tasks/${d.id}`}
                  className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors w-48"
                >
                  <Icon className={cn("h-4 w-4 shrink-0", cfg.color)} />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate">{d.title}</div>
                    <div className={cn("text-xs", cfg.color)}>{cfg.label}</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Blocker warning */}
      {isBlocked && (
        <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-medium text-destructive">Tasca bloquejada</span>
            <span className="text-muted-foreground">
              {" "}
              per {blockedByIncomplete.length} tasca
              {blockedByIncomplete.length === 1 ? "" : "s"} sense completar
            </span>
          </div>
        </div>
      )}

      {/* Blockers list with remove */}
      {blockers.length > 0 && (
        <div className="space-y-2 mb-4">
          {blockers.map((b) => {
            const cfg = STATUS_CONFIG[b.status]
            return (
              <div
                key={b.id}
                className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg group"
              >
                <span className="text-xs text-muted-foreground font-mono w-16 shrink-0">
                  {b.code || b.id.slice(0, 8)}
                </span>
                <span className="flex-1 text-sm truncate">{b.title}</span>
                <span className={cn("text-xs px-2 py-0.5 rounded-full bg-background", cfg.color)}>
                  {cfg.label}
                </span>
                <button
                  onClick={() => handleRemove(b.id)}
                  className="p-1 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 rounded text-destructive transition-opacity"
                  title="Eliminar dependencia"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )
          })}
        </div>
      )}

      {/* Add form */}
      {adding && (
        <div className="p-3 border border-border rounded-lg bg-background/50">
          <input
            type="text"
            placeholder="Cerca tasques per bloquejar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {availableTasks.length > 0 && (
            <div className="mt-2 space-y-1 max-h-64 overflow-y-auto">
              {availableTasks.map((t) => {
                const cfg = STATUS_CONFIG[t.status]
                return (
                  <button
                    key={t.id}
                    onClick={() => handleAdd(t.id)}
                    className="w-full flex items-center gap-2 p-2 hover:bg-muted rounded-lg text-left transition-colors"
                  >
                    <span className="text-xs text-muted-foreground font-mono w-16 shrink-0">
                      {t.code || t.id.slice(0, 8)}
                    </span>
                    <span className="flex-1 text-sm truncate">{t.title}</span>
                    <span className={cn("text-xs", cfg.color)}>{cfg.label}</span>
                  </button>
                )
              })}
            </div>
          )}
          {search && availableTasks.length === 0 && (
            <p className="mt-2 text-sm text-muted-foreground text-center py-4">
              Cap resultat per &quot;{search}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
