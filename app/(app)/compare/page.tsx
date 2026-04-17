"use client"

import { useMemo, useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Scale,
  Plus,
  X,
  Calendar,
  Users,
  Wallet,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"
import {
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarAngleAxis,
  PolarGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

const STATUS_LABELS: Record<string, string> = {
  en_curs: "En curs",
  planificacio: "Planificacio",
  pausat: "Pausat",
  completat: "Completat",
  cancelat: "Cancelat",
}

const PROJECT_COLORS = ["#3b82f6", "#f97316", "#10b981", "#a855f7"]

export default function ComparePage() {
  const projects = useAppStore((s) => s.projects)
  const tasks = useAppStore((s) => s.tasks)
  const [selectedIds, setSelectedIds] = useState<string[]>(() => projects.slice(0, 2).map((p) => p.id))

  const selectedProjects = useMemo(
    () => selectedIds.map((id) => projects.find((p) => p.id === id)!).filter(Boolean),
    [selectedIds, projects]
  )

  const projectMetrics = useMemo(() => {
    return selectedProjects.map((p) => {
      const projectTasks = tasks.filter((t) => t.projectId === p.id)
      const completedTasks = projectTasks.filter((t) => t.status === "completat").length
      const inProgressTasks = projectTasks.filter((t) => t.status === "en_curs").length
      const pendingTasks = projectTasks.filter((t) => t.status === "pendent").length
      const blockedTasks = projectTasks.filter((t) => t.status === "bloquejat").length

      const start = new Date(p.startDate).getTime()
      const end = new Date(p.endDate).getTime()
      const now = Date.now()
      const totalDays = Math.max(1, Math.round((end - start) / 86400000))
      const elapsedDays = Math.max(0, Math.round((now - start) / 86400000))
      const timeProgress = Math.min(100, Math.round((elapsedDays / totalDays) * 100))

      const budgetUsed = Math.round(((p.spent ?? 0) / Math.max(1, p.budget)) * 100)
      const onTrack = p.progress >= timeProgress - 10

      return {
        project: p,
        stats: {
          total: projectTasks.length,
          completed: completedTasks,
          inProgress: inProgressTasks,
          pending: pendingTasks,
          blocked: blockedTasks,
        },
        timeProgress,
        budgetUsed,
        onTrack,
      }
    })
  }, [selectedProjects, tasks])

  const radarData = useMemo(() => {
    return [
      { metric: "Progres", ...Object.fromEntries(projectMetrics.map((m, i) => [`p${i}`, m.project.progress])) },
      { metric: "Temps", ...Object.fromEntries(projectMetrics.map((m, i) => [`p${i}`, m.timeProgress])) },
      { metric: "Pressupost", ...Object.fromEntries(projectMetrics.map((m, i) => [`p${i}`, m.budgetUsed])) },
      {
        metric: "Compleccio tasques",
        ...Object.fromEntries(
          projectMetrics.map((m, i) => [
            `p${i}`,
            m.stats.total > 0 ? Math.round((m.stats.completed / m.stats.total) * 100) : 0,
          ])
        ),
      },
      {
        metric: "Equip",
        ...Object.fromEntries(projectMetrics.map((m, i) => [`p${i}`, Math.min(100, m.project.teamSize * 10)])),
      },
    ]
  }, [projectMetrics])

  const tasksBarData = useMemo(() => {
    return ["pendent", "en_curs", "revisio", "completat", "bloquejat"].map((status) => {
      const row: Record<string, string | number> = { status: status.replace("_", " ") }
      projectMetrics.forEach((m, i) => {
        const count = tasks.filter((t) => t.projectId === m.project.id && t.status === status).length
        row[m.project.name] = count
        row[`p${i}`] = count
      })
      return row
    })
  }, [projectMetrics, tasks])

  const addProject = (id: string) => {
    if (selectedIds.length >= 4 || selectedIds.includes(id)) return
    setSelectedIds([...selectedIds, id])
  }

  const removeProject = (id: string) => {
    setSelectedIds(selectedIds.filter((x) => x !== id))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Comparador de projectes</h1>
        <p className="text-muted-foreground mt-1">
          Compara fins a 4 projectes en paralel per veure diferencies i similituds
        </p>
      </div>

      {/* Selector */}
      <div className="bg-card border border-border rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Scale className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Projectes seleccionats ({selectedProjects.length}/4)</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {selectedProjects.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg border"
              style={{ borderColor: `${PROJECT_COLORS[i]}40`, backgroundColor: `${PROJECT_COLORS[i]}15` }}
            >
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: PROJECT_COLORS[i] }} />
              <span className="text-sm font-medium text-foreground">{p.name}</span>
              <button
                onClick={() => removeProject(p.id)}
                className="p-0.5 rounded hover:bg-card"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground" />
              </button>
            </div>
          ))}
          {selectedProjects.length < 4 && (
            <select
              value=""
              onChange={(e) => e.target.value && addProject(e.target.value)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-dashed border-border bg-transparent text-sm text-muted-foreground"
            >
              <option value="">+ Afegir projecte</option>
              {projects
                .filter((p) => !selectedIds.includes(p.id))
                .map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
            </select>
          )}
        </div>
      </div>

      {selectedProjects.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-semibold text-foreground mb-1">Sense projectes</h3>
          <p className="text-sm text-muted-foreground">Selecciona com a minim un projecte per comparar</p>
        </div>
      ) : (
        <>
          {/* Key metrics */}
          <div className={cn("grid gap-4", selectedProjects.length === 1 ? "grid-cols-1" : selectedProjects.length === 2 ? "grid-cols-1 md:grid-cols-2" : selectedProjects.length === 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
            {projectMetrics.map((m, i) => (
              <div key={m.project.id} className="bg-card border-2 rounded-xl p-5" style={{ borderColor: `${PROJECT_COLORS[i]}40` }}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="h-2 w-12 rounded-full mb-2" style={{ backgroundColor: PROJECT_COLORS[i] }} />
                    <h3 className="font-bold text-foreground">{m.project.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.project.clientName}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                    {STATUS_LABELS[m.project.status] || m.project.status}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        Progres
                      </span>
                      <span className="font-semibold text-foreground">{m.project.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${m.project.progress}%`, backgroundColor: PROJECT_COLORS[i] }} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Wallet className="h-3 w-3" />
                        Pressupost
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {Math.round((m.project.spent ?? 0) / 1000)}k / {Math.round(m.project.budget / 1000)}k
                      </div>
                      <div className="text-[10px] text-muted-foreground">{m.budgetUsed}% usat</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Users className="h-3 w-3" />
                        Equip
                      </div>
                      <div className="text-sm font-semibold text-foreground">{m.project.teamSize} persones</div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Tasques
                      </div>
                      <div className="text-sm font-semibold text-foreground">
                        {m.stats.completed}/{m.stats.total}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                        <Calendar className="h-3 w-3" />
                        Temps
                      </div>
                      <div className="text-sm font-semibold text-foreground">{m.timeProgress}%</div>
                    </div>
                  </div>

                  <div className={cn("flex items-center gap-2 pt-2 border-t border-border", m.onTrack ? "text-success" : "text-warning")}>
                    {m.onTrack ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    <span className="text-xs font-medium">
                      {m.onTrack ? "En bon ritme" : "Atencio: endarrerit"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Radar chart */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Comparativa multi-dimensional</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  {projectMetrics.map((m, i) => (
                    <Radar
                      key={m.project.id}
                      name={m.project.name}
                      dataKey={`p${i}`}
                      stroke={PROJECT_COLORS[i]}
                      fill={PROJECT_COLORS[i]}
                      fillOpacity={0.25}
                    />
                  ))}
                  <Tooltip contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)" }} />
                  <Legend wrapperStyle={{ color: "var(--muted-foreground)" }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Task distribution */}
          <div className="bg-card border border-border rounded-xl p-5">
            <h3 className="text-lg font-semibold text-foreground mb-4">Distribucio de tasques per estat</h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={tasksBarData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="status" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--popover-foreground)" }} />
                  <Legend wrapperStyle={{ color: "var(--muted-foreground)" }} />
                  {projectMetrics.map((m, i) => (
                    <Bar key={m.project.id} dataKey={m.project.name} fill={PROJECT_COLORS[i]} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
