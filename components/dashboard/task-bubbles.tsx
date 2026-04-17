"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n/provider"
import { cn, getInitials, getAvatarColor } from "@/lib/utils"
import { 
  CircleDot, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Pause,
  ArrowUpRight,
  Filter,
  X
} from "lucide-react"

const STATUS_CONFIG: Record<string, { color: string; bgColor: string; label: string; icon: typeof Clock }> = {
  pendent: { color: "#94a3b8", bgColor: "bg-slate-500/20", label: "Pendent", icon: Clock },
  en_curs: { color: "#3b82f6", bgColor: "bg-blue-500/20", label: "En curs", icon: Clock },
  revisio: { color: "#a855f7", bgColor: "bg-purple-500/20", label: "Revisio", icon: CheckCircle2 },
  completat: { color: "#10b981", bgColor: "bg-emerald-500/20", label: "Completat", icon: CheckCircle2 },
  bloquejat: { color: "#ef4444", bgColor: "bg-red-500/20", label: "Bloquejat", icon: AlertTriangle },
}

const PRIORITY_CONFIG: Record<string, { size: number; ring: string; label: string }> = {
  baixa: { size: 44, ring: "ring-slate-400/30", label: "Baixa" },
  normal: { size: 52, ring: "ring-blue-400/30", label: "Normal" },
  alta: { size: 62, ring: "ring-amber-400/40", label: "Alta" },
  critica: { size: 72, ring: "ring-red-400/50", label: "Critica" },
}

// Physics-based layout for organic bubble placement
function calculatePositions(
  tasks: { id: string; priority: string }[],
  width: number,
  height: number
) {
  const positions: { x: number; y: number }[] = []
  const padding = 8

  tasks.forEach((task, index) => {
    const size = PRIORITY_CONFIG[task.priority]?.size || 52
    const radius = size / 2 + padding

    // Start with a grid-based position with randomization
    const cols = Math.ceil(Math.sqrt(tasks.length * (width / height)))
    const rows = Math.ceil(tasks.length / cols)
    const cellW = width / cols
    const cellH = height / rows
    const col = index % cols
    const row = Math.floor(index / cols)

    // Add controlled randomness
    const seed = index * 127.1
    const jitterX = (Math.sin(seed) * 0.4 + 0.1) * cellW
    const jitterY = (Math.cos(seed * 1.3) * 0.4 + 0.1) * cellH

    let x = col * cellW + cellW / 2 + jitterX
    let y = row * cellH + cellH / 2 + jitterY

    // Collision avoidance
    for (let iter = 0; iter < 5; iter++) {
      for (let j = 0; j < positions.length; j++) {
        const other = positions[j]
        const otherSize = PRIORITY_CONFIG[tasks[j].priority]?.size || 52
        const otherRadius = otherSize / 2 + padding
        const minDist = radius + otherRadius

        const dx = x - other.x
        const dy = y - other.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < minDist && dist > 0) {
          const overlap = minDist - dist
          const nx = dx / dist
          const ny = dy / dist
          x += nx * overlap * 0.6
          y += ny * overlap * 0.6
        }
      }
    }

    // Keep within bounds
    x = Math.max(radius, Math.min(width - radius, x))
    y = Math.max(radius, Math.min(height - radius, y))

    positions.push({ x, y })
  })

  return positions
}

export function TaskBubbles() {
  const router = useRouter()
  const { t } = useTranslation()
  const tasks = useAppStore((s) => s.tasks)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string | null>(null)

  const activeTasks = useMemo(() => {
    let filtered = tasks.filter((task) => task.status !== "completat")
    if (filterStatus) {
      filtered = filtered.filter((task) => task.status === filterStatus)
    }
    return filtered.slice(0, 24)
  }, [tasks, filterStatus])

  const width = 100 // percentage-based
  const height = 320

  const positions = useMemo(
    () => calculatePositions(activeTasks, 420, height),
    [activeTasks, height]
  )

  const hoveredTask = hoveredId ? activeTasks.find((t) => t.id === hoveredId) : null

  const handleClick = (taskId: string) => {
    router.push(`/tasks/${taskId}`)
  }

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    tasks.filter((t) => t.status !== "completat").forEach((t) => {
      counts[t.status] = (counts[t.status] || 0) + 1
    })
    return counts
  }, [tasks])

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <CircleDot className="h-5 w-5 text-accent" />
          <h3 className="font-semibold text-foreground">{t("dashboard.taskMap")}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {activeTasks.length} {t("dashboard.activeTasks")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {filterStatus && (
            <button
              onClick={() => setFilterStatus(null)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-3 w-3" />
              {t("common.clearFilter")}
            </button>
          )}
          <Filter className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2 p-3 border-b border-border bg-muted/30 overflow-x-auto">
        {Object.entries(STATUS_CONFIG)
          .filter(([key]) => key !== "completat")
          .map(([key, config]) => {
            const count = statusCounts[key] || 0
            const isActive = filterStatus === key
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(isActive ? null : key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap",
                  isActive
                    ? "bg-foreground text-background"
                    : "bg-card border border-border hover:border-foreground/30"
                )}
              >
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: config.color }}
                />
                <span>{config.label}</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-[10px]",
                  isActive ? "bg-background/20" : "bg-muted"
                )}>
                  {count}
                </span>
              </button>
            )
          })}
      </div>

      {/* Bubble visualization */}
      <div className="relative p-4" style={{ height }}>
        {activeTasks.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">{t("dashboard.noActiveTasks")}</p>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {activeTasks.map((task, index) => {
              const config = STATUS_CONFIG[task.status] || STATUS_CONFIG.pendent
              const priorityConfig = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.normal
              const pos = positions[index]
              const isHovered = hoveredId === task.id
              const isOverdue = task.dueDate && new Date(task.dueDate) < new Date()

              return (
                <button
                  key={task.id}
                  onClick={() => handleClick(task.id)}
                  onMouseEnter={() => setHoveredId(task.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className={cn(
                    "absolute rounded-full transition-all duration-200 ease-out",
                    "flex items-center justify-center",
                    "ring-2 ring-offset-2 ring-offset-card",
                    priorityConfig.ring,
                    isHovered && "scale-110 z-20 ring-4 shadow-lg",
                    isOverdue && "animate-pulse"
                  )}
                  style={{
                    width: priorityConfig.size,
                    height: priorityConfig.size,
                    left: `calc(${(pos.x / 420) * 100}% - ${priorityConfig.size / 2}px)`,
                    top: `calc(${(pos.y / height) * 100}% - ${priorityConfig.size / 2}px)`,
                    backgroundColor: config.color,
                  }}
                >
                  {/* Inner content */}
                  <div className="relative flex items-center justify-center w-full h-full">
                    {/* Progress ring */}
                    <svg className="absolute inset-0" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="4"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="46"
                        fill="none"
                        stroke="rgba(255,255,255,0.5)"
                        strokeWidth="4"
                        strokeDasharray={`${(task.progress || 0) * 2.89} 289`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-300"
                      />
                    </svg>

                    {/* Assignee avatar or icon */}
                    {task.assigneeName ? (
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full text-white font-semibold",
                          priorityConfig.size >= 62 ? "text-sm w-8 h-8" : "text-xs w-6 h-6"
                        )}
                        style={{ backgroundColor: "rgba(0,0,0,0.25)" }}
                      >
                        {getInitials(task.assigneeName)}
                      </div>
                    ) : (
                      <config.icon className={cn(
                        "text-white/80",
                        priorityConfig.size >= 62 ? "h-5 w-5" : "h-4 w-4"
                      )} />
                    )}

                    {/* Overdue indicator */}
                    {isOverdue && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-2.5 w-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        )}

        {/* Hover tooltip */}
        {hoveredTask && (
          <div className="absolute bottom-4 left-4 right-4 bg-popover border border-border rounded-lg shadow-xl p-4 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center",
                  STATUS_CONFIG[hoveredTask.status]?.bgColor
                )}
                style={{ color: STATUS_CONFIG[hoveredTask.status]?.color }}
              >
                {(() => {
                  const Icon = STATUS_CONFIG[hoveredTask.status]?.icon || Clock
                  return <Icon className="h-5 w-5" />
                })()}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-foreground truncate">{hoveredTask.title}</h4>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {hoveredTask.projectName}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs">
                  <span
                    className="px-2 py-0.5 rounded-full font-medium"
                    style={{
                      backgroundColor: `${STATUS_CONFIG[hoveredTask.status]?.color}20`,
                      color: STATUS_CONFIG[hoveredTask.status]?.color,
                    }}
                  >
                    {STATUS_CONFIG[hoveredTask.status]?.label}
                  </span>
                  <span className="text-muted-foreground">
                    {PRIORITY_CONFIG[hoveredTask.priority]?.label} {t("dashboard.priority")}
                  </span>
                  <span className="text-muted-foreground">
                    {hoveredTask.progress || 0}% {t("dashboard.complete")}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center gap-2">
                {hoveredTask.assigneeName && (
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white",
                      getAvatarColor(hoveredTask.assigneeName)
                    )}
                    title={hoveredTask.assigneeName}
                  >
                    {getInitials(hoveredTask.assigneeName)}
                  </div>
                )}
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Legend footer */}
      <div className="flex items-center justify-between gap-4 p-3 border-t border-border bg-muted/30 text-xs">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-muted-foreground font-medium">{t("dashboard.bubbleSize")}:</span>
          {Object.entries(PRIORITY_CONFIG).map(([key, config]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div
                className="rounded-full bg-muted-foreground/40"
                style={{ width: config.size / 4, height: config.size / 4 }}
              />
              <span className="text-muted-foreground">{config.label}</span>
            </div>
          ))}
        </div>
        <span className="text-muted-foreground">{t("dashboard.clickToOpen")}</span>
      </div>
    </div>
  )
}
