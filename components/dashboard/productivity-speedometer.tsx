"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Gauge, TrendingUp, TrendingDown } from "lucide-react"

export function ProductivitySpeedometer() {
  const tasks = useAppStore((s) => s.tasks)
  const projects = useAppStore((s) => s.projects)

  const productivity = useMemo(() => {
    const now = Date.now()
    const weekAgo = now - 7 * 24 * 60 * 60 * 1000
    const twoWeeksAgo = now - 14 * 24 * 60 * 60 * 1000

    const completedThisWeek = tasks.filter((t) => {
      if (t.status !== "completat") return false
      const d = new Date(t.updatedAt).getTime()
      return d >= weekAgo
    }).length

    const completedLastWeek = tasks.filter((t) => {
      if (t.status !== "completat") return false
      const d = new Date(t.updatedAt).getTime()
      return d >= twoWeeksAgo && d < weekAgo
    }).length

    const totalActive = tasks.filter((t) => t.status !== "completat").length
    const overdue = tasks.filter((t) => {
      if (t.status === "completat") return false
      if (!t.dueDate) return false
      return new Date(t.dueDate).getTime() < now
    }).length

    const avgProjectProgress = projects.length > 0
      ? Math.round(projects.reduce((s, p) => s + p.progress, 0) / projects.length)
      : 0

    // Score 0-100 based on completion rate and low overdue
    const completionRate = totalActive > 0 ? (completedThisWeek / (completedThisWeek + totalActive)) * 100 : 50
    const overduePenalty = Math.min(30, overdue * 3)
    const score = Math.max(0, Math.min(100, Math.round(completionRate * 0.6 + avgProjectProgress * 0.4 - overduePenalty)))

    const trend = completedLastWeek > 0
      ? Math.round(((completedThisWeek - completedLastWeek) / completedLastWeek) * 100)
      : completedThisWeek > 0 ? 100 : 0

    return { score, completedThisWeek, completedLastWeek, totalActive, overdue, avgProjectProgress, trend }
  }, [tasks, projects])

  // Arc math
  const radius = 80
  const strokeWidth = 14
  const circumference = Math.PI * radius  // semi-circle
  const progress = (productivity.score / 100) * circumference
  const dashOffset = circumference - progress

  const getColor = () => {
    if (productivity.score >= 75) return "#10b981"
    if (productivity.score >= 50) return "#3b82f6"
    if (productivity.score >= 25) return "#eab308"
    return "#ef4444"
  }

  const getLabel = () => {
    if (productivity.score >= 75) return "Excelent"
    if (productivity.score >= 50) return "Bon ritme"
    if (productivity.score >= 25) return "Millorable"
    return "Baix"
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Gauge className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Indicador de productivitat</h3>
      </div>

      <div className="flex flex-col items-center">
        {/* Speedometer */}
        <div className="relative">
          <svg width={220} height={130} viewBox="0 0 220 130" className="transform">
            {/* Background arc */}
            <path
              d={`M 20 110 A ${radius} ${radius} 0 0 1 200 110`}
              fill="none"
                stroke="var(--border)"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            {/* Progress arc */}
            <path
              d={`M 20 110 A ${radius} ${radius} 0 0 1 200 110`}
              fill="none"
              stroke={getColor()}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000"
            />
            {/* Tick marks */}
            {[0, 25, 50, 75, 100].map((val) => {
              const angle = 180 + (val / 100) * 180
              const rad = (angle * Math.PI) / 180
              const x1 = 110 + Math.cos(rad) * 95
              const y1 = 110 + Math.sin(rad) * 95
              const x2 = 110 + Math.cos(rad) * 103
              const y2 = 110 + Math.sin(rad) * 103
              return (
                <line
                  key={val}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#64748b"
                  strokeWidth={1.5}
                />
              )
            })}
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
            <div className="text-4xl font-bold text-foreground leading-none">{productivity.score}</div>
            <div className="text-xs text-muted-foreground mt-1">/ 100</div>
          </div>
        </div>

        <div className={cn("mt-2 px-3 py-1 rounded-full text-sm font-semibold", getColor() === "#10b981" && "bg-success/15 text-success", getColor() === "#3b82f6" && "bg-accent/15 text-accent", getColor() === "#eab308" && "bg-warning/20 text-warning", getColor() === "#ef4444" && "bg-destructive/15 text-destructive")}>
          {getLabel()}
        </div>
      </div>

      {/* Stats */}
      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-3 text-center">
        <div>
          <div className="text-xs text-muted-foreground">Setmana</div>
          <div className="text-lg font-bold text-foreground">{productivity.completedThisWeek}</div>
          <div className={cn("flex items-center justify-center gap-0.5 text-[10px] font-medium", productivity.trend >= 0 ? "text-success" : "text-destructive")}>
            {productivity.trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {Math.abs(productivity.trend)}%
          </div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Actives</div>
          <div className="text-lg font-bold text-foreground">{productivity.totalActive}</div>
          <div className="text-[10px] text-muted-foreground">en curs</div>
        </div>
        <div>
          <div className="text-xs text-muted-foreground">Endarrerides</div>
          <div className={cn("text-lg font-bold", productivity.overdue > 0 ? "text-destructive" : "text-foreground")}>
            {productivity.overdue}
          </div>
          <div className="text-[10px] text-muted-foreground">
            {productivity.overdue === 0 ? "ok" : "atencio"}
          </div>
        </div>
      </div>
    </div>
  )
}
