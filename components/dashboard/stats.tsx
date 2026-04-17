"use client"

import {
  FolderKanban,
  ListTodo,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { useTranslation } from "@/lib/i18n/provider"

export function DashboardStats() {
  const { t } = useTranslation()
  const projects = useAppStore((state) => state.projects)
  const tasks = useAppStore((state) => state.tasks)
  const users = useAppStore((state) => state.users)

  const activeProjects = projects.filter((p) => p.status === "en_curs").length
  const completedTasks = tasks.filter((t) => t.status === "completat").length
  const pendingTasks = tasks.filter((t) => t.status === "pendent").length
  const inProgressTasks = tasks.filter((t) => t.status === "en_curs").length
  const today = new Date()
  const overdueTasks = tasks.filter((t) => {
    if (!t.dueDate || t.status === "completat") return false
    return new Date(t.dueDate) < today
  }).length

  const averageProgress =
    projects.length > 0
      ? Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length)
      : 0

  const activeUsers = users.filter((u) => u.status === "active").length

  const stats = [
    {
      title: t("dashboard.activeProjects"),
      value: String(activeProjects),
      change: `${projects.length} ${t("dashboard.totalCount")}`,
      changeType: "positive" as const,
      icon: FolderKanban,
      color: "text-primary bg-primary/10",
    },
    {
      title: t("dashboard.totalTasks"),
      value: String(tasks.length),
      change: `${inProgressTasks} ${t("dashboard.inProgressCount")}`,
      changeType: "neutral" as const,
      icon: ListTodo,
      color: "text-accent bg-accent/10",
    },
    {
      title: t("dashboard.completed"),
      value: String(completedTasks),
      change: `${Math.round((completedTasks / Math.max(tasks.length, 1)) * 100)}% ${t("dashboard.ofTotal")}`,
      changeType: "positive" as const,
      icon: CheckCircle2,
      color: "text-success bg-success/10",
    },
    {
      title: t("dashboard.pending"),
      value: String(pendingTasks),
      change: overdueTasks > 0 ? `${overdueTasks} ${t("dashboard.withOverdue")}` : t("dashboard.noDelays"),
      changeType: overdueTasks > 0 ? ("negative" as const) : ("neutral" as const),
      icon: Clock,
      color: "text-warning bg-warning/10",
    },
    {
      title: t("dashboard.overdue"),
      value: String(overdueTasks),
      change: overdueTasks > 0 ? t("dashboard.needsAttention") : t("dashboard.onSchedule"),
      changeType: overdueTasks > 0 ? ("negative" as const) : ("positive" as const),
      icon: AlertTriangle,
      color: "text-destructive bg-destructive/10",
    },
    {
      title: t("dashboard.team"),
      value: String(users.length),
      change: `${activeUsers} ${t("dashboard.activeMembers")}`,
      changeType: "positive" as const,
      icon: Users,
      color: "text-accent bg-accent/10",
    },
    {
      title: t("dashboard.avgProgress"),
      value: `${averageProgress}%`,
      change: t("dashboard.allProjects"),
      changeType: averageProgress >= 50 ? ("positive" as const) : ("neutral" as const),
      icon: TrendingUp,
      color: "text-success bg-success/10",
    },
    {
      title: t("dashboard.activity"),
      value: String(tasks.length + projects.length),
      change: t("dashboard.totalItems"),
      changeType: "neutral" as const,
      icon: Activity,
      color: "text-primary bg-primary/10",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
              <p className="mt-1 text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`rounded-lg p-2 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </div>
          <p
            className={`mt-2 text-xs ${
              stat.changeType === "positive"
                ? "text-success"
                : stat.changeType === "negative"
                ? "text-destructive"
                : "text-muted-foreground"
            }`}
          >
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  )
}
