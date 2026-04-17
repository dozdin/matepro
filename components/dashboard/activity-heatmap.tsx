"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { CalendarDays } from "lucide-react"

export function ActivityHeatmap() {
  const activities = useAppStore((s) => s.activities)
  const tasks = useAppStore((s) => s.tasks)

  const { grid, weekLabels, max } = useMemo(() => {
    // Last 12 weeks (84 days), grouped into weeks
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - 83)
    // Align to Monday
    const dayOfWeek = (startDate.getDay() + 6) % 7 // 0 = Monday
    startDate.setDate(startDate.getDate() - dayOfWeek)

    const counts: Record<string, number> = {}
    const addCount = (isoDate: string) => {
      const d = new Date(isoDate)
      d.setHours(0, 0, 0, 0)
      const key = d.toISOString().slice(0, 10)
      counts[key] = (counts[key] || 0) + 1
    }

    activities.forEach((a) => addCount(a.createdAt))
    tasks.forEach((t) => {
      if (t.createdAt) addCount(t.createdAt)
      if (t.updatedAt && t.status === "completat") addCount(t.updatedAt)
    })

    // Build 13 weeks x 7 days grid
    const grid: { date: Date; key: string; count: number }[][] = []
    const weekLabels: string[] = []

    const cursor = new Date(startDate)
    for (let w = 0; w < 13; w++) {
      const week: { date: Date; key: string; count: number }[] = []
      for (let d = 0; d < 7; d++) {
        const date = new Date(cursor)
        const key = date.toISOString().slice(0, 10)
        const count = counts[key] || 0
        const isFuture = date.getTime() > today.getTime()
        week.push({ date, key, count: isFuture ? -1 : count })
        cursor.setDate(cursor.getDate() + 1)
      }
      grid.push(week)
      if (w % 2 === 0) {
        weekLabels.push(week[0].date.toLocaleDateString("ca-ES", { month: "short" }))
      } else {
        weekLabels.push("")
      }
    }

    const max = Math.max(...Object.values(counts), 1)
    return { grid, weekLabels, max }
  }, [activities, tasks])

  const getColor = (count: number) => {
    if (count === -1) return "bg-muted/10"
    if (count === 0) return "bg-muted/30"
    const intensity = count / max
    if (intensity > 0.75) return "bg-primary"
    if (intensity > 0.5) return "bg-primary/75"
    if (intensity > 0.25) return "bg-primary/50"
    return "bg-primary/25"
  }

  const totalActivity = grid.flat().reduce((s, d) => s + Math.max(0, d.count), 0)
  const activeDays = grid.flat().filter((d) => d.count > 0).length

  const dayLabels = ["Dl", "", "Dx", "", "Dv", "", "Dg"]

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-foreground">Mapa de calor d&apos;activitat</h3>
        </div>
        <div className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{totalActivity}</span> accions en{" "}
          <span className="font-semibold text-foreground">{activeDays}</span> dies
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Day labels */}
          <div className="flex flex-col gap-1 pr-2 pt-4">
            {dayLabels.map((label, i) => (
              <div key={i} className="h-3 text-[9px] text-muted-foreground flex items-center">
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="flex-1">
            <div className="flex gap-1 mb-1">
              {weekLabels.map((label, i) => (
                <div key={i} className="w-3 text-[9px] text-muted-foreground text-center">
                  {label}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.key}
                      className={cn("h-3 w-3 rounded-sm transition-transform hover:scale-150", getColor(day.count))}
                      title={`${day.date.toLocaleDateString("ca-ES", { day: "numeric", month: "long" })}: ${Math.max(0, day.count)} accions`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
        <span>Menys</span>
        <div className="flex items-center gap-0.5">
          <div className="h-3 w-3 rounded-sm bg-muted/30" />
          <div className="h-3 w-3 rounded-sm bg-primary/25" />
          <div className="h-3 w-3 rounded-sm bg-primary/50" />
          <div className="h-3 w-3 rounded-sm bg-primary/75" />
          <div className="h-3 w-3 rounded-sm bg-primary" />
        </div>
        <span>Mes</span>
      </div>
    </div>
  )
}
