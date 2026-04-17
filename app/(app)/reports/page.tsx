"use client"

import { useMemo, useState } from "react"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  PieChart as PieIcon,
  LineChart as LineIcon,
  TrendingUp,
  Download,
  Filter,
  Settings2,
  FileSpreadsheet,
} from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts"

type Dimension = "status" | "priority" | "assignee" | "project" | "month"
type Metric = "count" | "hours" | "budget" | "progress"
type ChartType = "bar" | "line" | "pie" | "area"

const COLORS = ["#3b82f6", "#10b981", "#f97316", "#a855f7", "#eab308", "#ec4899", "#14b8a6", "#ef4444"]

const DIMENSION_LABELS: Record<Dimension, string> = {
  status: "Estat",
  priority: "Prioritat",
  assignee: "Assignat",
  project: "Projecte",
  month: "Mes",
}

const METRIC_LABELS: Record<Metric, string> = {
  count: "Nombre",
  hours: "Hores",
  budget: "Pressupost",
  progress: "Progres mitja",
}

export default function ReportsPage() {
  const tasks = useAppStore((s) => s.tasks)
  const projects = useAppStore((s) => s.projects)
  const [source, setSource] = useState<"tasks" | "projects">("tasks")
  const [dimension, setDimension] = useState<Dimension>("status")
  const [metric, setMetric] = useState<Metric>("count")
  const [chartType, setChartType] = useState<ChartType>("bar")

  const data = useMemo(() => {
    if (source === "tasks") {
      const map: Record<string, { name: string; count: number; hours: number; budget: number; progressSum: number }> = {}
      tasks.forEach((t) => {
        let key: string
        switch (dimension) {
          case "status": key = t.status; break
          case "priority": key = t.priority; break
          case "assignee": key = t.assigneeName || "Sense assignar"; break
          case "project": key = t.projectName || "Sense projecte"; break
          case "month":
            key = t.createdAt ? new Date(t.createdAt).toLocaleDateString("ca-ES", { month: "short", year: "numeric" }) : "N/A"
            break
          default: key = "N/A"
        }
        if (!map[key]) map[key] = { name: key, count: 0, hours: 0, budget: 0, progressSum: 0 }
        map[key].count += 1
        map[key].hours += t.estimatedHours || 0
      })
      return Object.values(map).map((d) => ({
        name: d.name,
        value: metric === "count" ? d.count : metric === "hours" ? d.hours : 0,
      }))
    } else {
      const map: Record<string, { name: string; count: number; hours: number; budget: number; progressSum: number }> = {}
      projects.forEach((p) => {
        let key: string
        switch (dimension) {
          case "status": key = p.status; break
          case "priority": key = p.priority; break
          case "assignee": key = p.managerName || "Sense manager"; break
          case "project": key = p.name; break
          case "month":
            key = new Date(p.startDate).toLocaleDateString("ca-ES", { month: "short", year: "numeric" })
            break
          default: key = "N/A"
        }
        if (!map[key]) map[key] = { name: key, count: 0, hours: 0, budget: 0, progressSum: 0 }
        map[key].count += 1
        map[key].budget += p.budget
        map[key].progressSum += p.progress
      })
      return Object.values(map).map((d) => ({
        name: d.name,
        value:
          metric === "count"
            ? d.count
            : metric === "budget"
            ? d.budget
            : metric === "progress"
            ? Math.round(d.progressSum / Math.max(1, d.count))
            : 0,
      }))
    }
  }, [source, dimension, metric, tasks, projects])

  const total = data.reduce((s, d) => s + d.value, 0)
  const max = Math.max(...data.map((d) => d.value), 0)

  const exportCsv = () => {
    const csv = [
      `${DIMENSION_LABELS[dimension]},${METRIC_LABELS[metric]}`,
      ...data.map((d) => `"${d.name}",${d.value}`),
    ].join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `informe-${source}-${dimension}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const tooltipStyle = {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--popover-foreground)",
  }
  const axisTick = { fill: "var(--muted-foreground)", fontSize: 11 }
  const gridStroke = "var(--border)"
  const accentColor = "var(--primary)"

  const renderChart = () => {
    if (chartType === "bar") {
      return (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="name" tick={axisTick} />
          <YAxis tick={axisTick} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      )
    }
    if (chartType === "line") {
      return (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="name" tick={axisTick} />
          <YAxis tick={axisTick} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke={accentColor} strokeWidth={3} dot={{ fill: accentColor, r: 5 }} />
        </LineChart>
      )
    }
    if (chartType === "area") {
      return (
        <AreaChart data={data}>
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.8} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} />
          <XAxis dataKey="name" tick={axisTick} />
          <YAxis tick={axisTick} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke={accentColor} strokeWidth={2} fill="url(#areaFill)" />
        </AreaChart>
      )
    }
    return (
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={130} label={(d) => `${d.name}: ${d.value}`}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
        <Legend wrapperStyle={{ color: "var(--muted-foreground)" }} />
      </PieChart>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Generador d&apos;informes</h1>
          <p className="text-muted-foreground mt-1">Crea informes dinamics amb qualsevol combinacio</p>
        </div>
        <button
          onClick={exportCsv}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card text-sm text-foreground hover:bg-accent/30"
        >
          <Download className="h-4 w-4" />
          Exportar CSV
        </button>
      </div>

      {/* Configurator */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Settings2 className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Configuracio</span>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Font de dades</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as "tasks" | "projects")}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
            >
              <option value="tasks">Tasques</option>
              <option value="projects">Projectes</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">
              <Filter className="inline h-3 w-3 mr-1" />
              Agrupar per
            </label>
            <select
              value={dimension}
              onChange={(e) => setDimension(e.target.value as Dimension)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
            >
              {(Object.keys(DIMENSION_LABELS) as Dimension[]).map((d) => (
                <option key={d} value={d}>{DIMENSION_LABELS[d]}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Metrica</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value as Metric)}
              className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground"
            >
              <option value="count">Nombre</option>
              {source === "tasks" && <option value="hours">Hores estimades</option>}
              {source === "projects" && <option value="budget">Pressupost</option>}
              {source === "projects" && <option value="progress">Progres mitja</option>}
            </select>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Tipus de grafic</label>
            <div className="grid grid-cols-4 gap-1 bg-background border border-border rounded-lg p-1">
              {[
                { type: "bar" as ChartType, icon: <BarChart3 className="h-4 w-4" /> },
                { type: "line" as ChartType, icon: <LineIcon className="h-4 w-4" /> },
                { type: "area" as ChartType, icon: <TrendingUp className="h-4 w-4" /> },
                { type: "pie" as ChartType, icon: <PieIcon className="h-4 w-4" /> },
              ].map(({ type, icon }) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={cn(
                    "flex items-center justify-center rounded p-1.5 text-xs font-medium transition-colors",
                    chartType === type
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Total</div>
          <div className="text-2xl font-bold text-foreground mt-1">{total.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Grups</div>
          <div className="text-2xl font-bold text-foreground mt-1">{data.length}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Maxim</div>
          <div className="text-2xl font-bold text-foreground mt-1">{max.toLocaleString()}</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Mitjana</div>
          <div className="text-2xl font-bold text-foreground mt-1">
            {data.length > 0 ? Math.round(total / data.length).toLocaleString() : 0}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">
            {METRIC_LABELS[metric]} per {DIMENSION_LABELS[dimension].toLowerCase()}
          </h3>
        </div>
        <div className="h-[400px]">
          {data.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Sense dades
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {renderChart()}
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Data table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
          <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Taula de dades</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/20">
                <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  {DIMENSION_LABELS[dimension]}
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                  {METRIC_LABELS[metric]}
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 w-40">
                  Distribucio
                </th>
              </tr>
            </thead>
            <tbody>
              {data.map((d, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-accent/20">
                  <td className="px-5 py-3 text-sm text-foreground font-medium">{d.name}</td>
                  <td className="px-5 py-3 text-sm text-foreground text-right tabular-nums">
                    {d.value.toLocaleString()}
                  </td>
                  <td className="px-5 py-3 w-40">
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${max > 0 ? (d.value / max) * 100 : 0}%`,
                          backgroundColor: COLORS[i % COLORS.length],
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
