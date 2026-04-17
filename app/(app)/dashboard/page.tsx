import { getSession } from "@/lib/auth"
import { DashboardStats } from "@/components/dashboard/stats"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { GanttChart } from "@/components/dashboard/gantt-chart"
import { ProductivitySpeedometer } from "@/components/dashboard/productivity-speedometer"
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap"
import { TaskBubbles } from "@/components/dashboard/task-bubbles"

export default async function DashboardPage() {
  const user = await getSession()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Bon dia" : hour < 20 ? "Bona tarda" : "Bona nit"

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            {greeting}, {user?.name.split(" ")[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Aqui tens un resum de l&apos;activitat del drassana
          </p>
        </div>
        <div className="text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
          <kbd className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
          Paleta de comandes
        </div>
      </div>

      {/* Stats grid */}
      <DashboardStats />

      {/* Quick actions */}
      <QuickActions />

      {/* Gantt */}
      <GanttChart />

      {/* Speedometer + Heatmap + Bubbles */}
      <div className="grid gap-6 lg:grid-cols-3">
        <ProductivitySpeedometer />
        <div className="lg:col-span-2">
          <ActivityHeatmap />
        </div>
      </div>

      {/* Projects + Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RecentProjects />
        <UpcomingTasks />
      </div>

      {/* Task bubbles */}
      <TaskBubbles />
    </div>
  )
}
