"use client"

import { useMemo, useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { Users, TrendingUp, AlertTriangle, Clock, ArrowUpDown } from "lucide-react"

type Period = "week" | "month" | "quarter"

export default function WorkloadPage() {
  const users = useAppStore((s) => s.users)
  const tasks = useAppStore((s) => s.tasks)
  const [period, setPeriod] = useState<Period>("week")
  const [sortBy, setSortBy] = useState<"load" | "name">("load")

  const periodDays = period === "week" ? 7 : period === "month" ? 30 : 90

  const userLoad = useMemo(() => {
    const now = new Date()
    const horizon = new Date()
    horizon.setDate(now.getDate() + periodDays)

    return users
      .filter((u) => u.status === "active")
      .map((user) => {
        const assignedTasks = tasks.filter(
          (t) =>
            (t.assigneeId === user.id || t.assigneeName === user.name) &&
            t.status !== "completat"
        )
        const upcomingTasks = assignedTasks.filter((t) => {
          if (!t.dueDate) return true
          const d = new Date(t.dueDate)
          return d >= now && d <= horizon
        })
        const hoursAssigned = upcomingTasks.reduce((s, t) => s + (t.estimatedHours || 4), 0)
        const maxHoursForPeriod = periodDays * 8
        const loadPercent = Math.min(100, Math.round((hoursAssigned / maxHoursForPeriod) * 100))

        let status: "low" | "normal" | "high" | "critical"
        if (loadPercent < 30) status = "low"
        else if (loadPercent < 70) status = "normal"
        else if (loadPercent < 100) status = "high"
        else status = "critical"

        const overdueTasks = assignedTasks.filter((t) => {
          if (!t.dueDate) return false
          return new Date(t.dueDate) < now
        }).length

        const highPriority = upcomingTasks.filter((t) => t.priority === "alta" || t.priority === "critica").length

        return {
          user,
          taskCount: upcomingTasks.length,
          totalTasks: assignedTasks.length,
          hoursAssigned,
          loadPercent,
          status,
          overdueTasks,
          highPriority,
          tasks: upcomingTasks.slice(0, 5),
        }
      })
      .sort((a, b) => {
        if (sortBy === "name") return a.user.name.localeCompare(b.user.name)
        return b.loadPercent - a.loadPercent
      })
  }, [users, tasks, periodDays, sortBy])

  const totals = useMemo(() => {
    const totalHours = userLoad.reduce((s, u) => s + u.hoursAssigned, 0)
    const avgLoad = userLoad.length > 0
      ? Math.round(userLoad.reduce((s, u) => s + u.loadPercent, 0) / userLoad.length)
      : 0
    const overloaded = userLoad.filter((u) => u.loadPercent >= 100).length
    const underutilized = userLoad.filter((u) => u.loadPercent < 30).length
    return { totalHours, avgLoad, overloaded, underutilized }
  }, [userLoad])

  const statusStyles = {
    low: "bg-accent/10 text-accent border-accent/30",
    normal: "bg-success/15 text-success border-success/30",
    high: "bg-warning/20 text-warning border-warning/30",
    critical: "bg-destructive/15 text-destructive border-destructive/30",
  }

  const statusLabels = {
    low: "Subcarrega",
    normal: "Optim",
    high: "Alt",
    critical: "Sobrecarrega",
  }

  const barColor = (status: string) => {
    switch (status) {
      case "low": return "bg-accent"
      case "normal": return "bg-success"
      case "high": return "bg-warning"
      case "critical": return "bg-destructive"
      default: return "bg-muted"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carrega de treball</h1>
          <p className="text-muted-foreground mt-1">Distribucio de tasques i capacitat per persona</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg border border-border overflow-hidden">
            {(["week", "month", "quarter"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  period === p ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"
                )}
              >
                {p === "week" ? "Setmana" : p === "month" ? "Mes" : "Trimestre"}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortBy(sortBy === "load" ? "name" : "load")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:text-foreground"
          >
            <ArrowUpDown className="h-3.5 w-3.5" />
            {sortBy === "load" ? "Per carrega" : "Per nom"}
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Actius</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{userLoad.length}</div>
          <div className="text-xs text-muted-foreground mt-1">membres del equip</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Hores totals</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totals.totalHours}h</div>
          <div className="text-xs text-muted-foreground mt-1">assignades</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">Carrega mitjana</span>
          </div>
          <div className="text-2xl font-bold text-foreground">{totals.avgLoad}%</div>
          <div className="text-xs text-muted-foreground mt-1">del equip</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-xs text-muted-foreground">Alertes</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {totals.overloaded + totals.underutilized}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {totals.overloaded} sobrecarrega • {totals.underutilized} subcarrega
          </div>
        </div>
      </div>

      {/* User cards */}
      <div className="grid gap-3">
        {userLoad.map((item) => (
          <div key={item.user.id} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-bold text-foreground">
                {item.user.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <h3 className="font-semibold text-foreground">{item.user.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{item.user.roleLabel}</span>
                      <span>•</span>
                      <span>{item.user.department}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn("px-2 py-0.5 rounded-full border text-xs font-medium", statusStyles[item.status])}>
                      {statusLabels[item.status]}
                    </span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground leading-none">{item.loadPercent}%</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{item.hoursAssigned}h / {periodDays * 8}h</div>
                    </div>
                  </div>
                </div>

                {/* Load bar */}
                <div className="mt-3">
                  <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("absolute inset-y-0 left-0 rounded-full transition-all", barColor(item.status))}
                      style={{ width: `${Math.min(100, item.loadPercent)}%` }}
                    />
                    {item.loadPercent > 100 && (
                      <div
                        className="absolute inset-y-0 left-0 bg-destructive rounded-full animate-pulse"
                        style={{ width: "100%" }}
                      />
                    )}
                  </div>
                </div>

                {/* Info */}
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <span>{item.taskCount} tasques al periode</span>
                  {item.highPriority > 0 && (
                    <span className="flex items-center gap-1 text-warning">
                      <AlertTriangle className="h-3 w-3" />
                      {item.highPriority} alta prioritat
                    </span>
                  )}
                  {item.overdueTasks > 0 && (
                    <span className="flex items-center gap-1 text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      {item.overdueTasks} endarrerides
                    </span>
                  )}
                </div>

                {/* Tasks */}
                {item.tasks.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {item.tasks.map((task) => (
                      <a
                        key={task.id}
                        href={`/tasks/${task.id}`}
                        className="px-2 py-0.5 text-xs rounded bg-muted/40 border border-border/50 text-muted-foreground hover:text-foreground hover:bg-muted truncate max-w-[200px]"
                        title={task.title}
                      >
                        {task.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
