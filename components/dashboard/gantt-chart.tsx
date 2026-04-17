"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { GanttChartSquare } from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  planificacio: "bg-muted-foreground",
  en_curs: "bg-primary",
  pausat: "bg-warning",
  completat: "bg-success",
  cancelat: "bg-destructive",
}

export function GanttChart() {
  const projects = useAppStore((s) => s.projects)

  const { startDate, endDate, months, rows } = useMemo(() => {
    const activeProjects = projects.filter((p) => p.status !== "cancelat").slice(0, 8)
    if (activeProjects.length === 0) {
      return { startDate: new Date(), endDate: new Date(), months: [], rows: [] }
    }

    const starts = activeProjects.map((p) => new Date(p.startDate).getTime())
    const ends = activeProjects.map((p) => new Date(p.endDate).getTime())
    const minTime = Math.min(...starts)
    const maxTime = Math.max(...ends)
    const startDate = new Date(minTime)
    const endDate = new Date(maxTime)
    const totalMs = maxTime - minTime

    // Build list of months between
    const months: { label: string; offset: number; width: number }[] = []
    const cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    while (cursor.getTime() <= endDate.getTime()) {
      const monthStart = new Date(cursor).getTime()
      const nextMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1).getTime()
      const monthEnd = Math.min(nextMonth, maxTime)
      const offset = ((monthStart - minTime) / totalMs) * 100
      const width = ((monthEnd - monthStart) / totalMs) * 100
      months.push({
        label: cursor.toLocaleDateString("ca-ES", { month: "short", year: "2-digit" }),
        offset,
        width,
      })
      cursor.setMonth(cursor.getMonth() + 1)
    }

    const rows = activeProjects.map((p) => {
      const s = new Date(p.startDate).getTime()
      const e = new Date(p.endDate).getTime()
      const left = ((s - minTime) / totalMs) * 100
      const width = ((e - s) / totalMs) * 100
      return { project: p, left, width }
    })

    return { startDate, endDate, months, rows }
  }, [projects])

  const [todayPos, setTodayPos] = useState<number | null>(null)
  useEffect(() => {
    const now = Date.now()
    const start = startDate.getTime()
    const end = endDate.getTime()
    if (now < start || now > end) {
      setTodayPos(null)
      return
    }
    setTodayPos(((now - start) / (end - start)) * 100)
  }, [startDate, endDate])

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <GanttChartSquare className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Cronograma de projectes</h3>
      </div>

      {rows.length === 0 ? (
        <div className="text-center text-sm text-muted-foreground py-8">Sense projectes per mostrar</div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-[600px]">
            {/* Month header */}
            <div className="flex gap-2 mb-2">
              <div className="w-40 flex-shrink-0" />
              <div className="flex-1 relative h-6">
                {months.map((m, i) => (
                  <div
                    key={i}
                    className="absolute top-0 text-[10px] text-muted-foreground border-l border-border pl-1.5 h-full"
                    style={{ left: `${m.offset}%`, width: `${m.width}%` }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            </div>

            {/* Rows */}
            <div className="space-y-2">
              {rows.map(({ project, left, width }) => (
                <div key={project.id} className="flex items-center gap-2">
                  <Link
                    href={`/projects/${project.id}`}
                    className="w-40 flex-shrink-0 text-sm font-medium text-foreground truncate hover:text-primary"
                  >
                    {project.name}
                  </Link>
                  <div className="flex-1 relative h-8 bg-muted/30 rounded">
                    {todayPos !== null && (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-accent z-10"
                        style={{ left: `${todayPos}%` }}
                      >
                        <div className="absolute -top-1 -left-1 h-2 w-2 rounded-full bg-accent" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "absolute top-1 bottom-1 rounded group cursor-pointer transition-opacity hover:opacity-90",
                        STATUS_COLORS[project.status] || "bg-muted"
                      )}
                      style={{ left: `${left}%`, width: `${Math.max(width, 1)}%` }}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-background/40 rounded-l"
                        style={{ width: `${100 - project.progress}%`, right: 0, left: "auto" }}
                      />
                      <div className="absolute inset-0 flex items-center px-2 text-[10px] font-semibold text-primary-foreground truncate mix-blend-difference">
                        {project.progress}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-4 flex-wrap text-xs">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span className="text-muted-foreground">En curs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-success" />
                <span className="text-muted-foreground">Completat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-warning" />
                <span className="text-muted-foreground">Pausat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                <span className="text-muted-foreground">Planificacio</span>
              </div>
              {todayPos !== null && (
                <div className="flex items-center gap-1.5 ml-auto">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Avui</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
