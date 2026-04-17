import { getSession } from "@/lib/auth"
import { DashboardStats } from "@/components/dashboard/stats"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { GanttChart } from "@/components/dashboard/gantt-chart"
import { ProductivitySpeedometer } from "@/components/dashboard/productivity-speedometer"
import { ActivityHeatmap } from "@/components/dashboard/activity-heatmap"
import { TaskBubbles } from "@/components/dashboard/task-bubbles"
import { WelcomeHeader } from "@/components/dashboard/welcome-header"

export default async function DashboardPage() {
  const user = await getSession()
  const firstName = user?.name?.split(" ")[0] ?? ""

  return (
    <div className="space-y-6">
      {/* Welcome header */}
      <WelcomeHeader firstName={firstName} />

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
