"use client"

import { useMemo } from "react"
import { useAppStore } from "@/lib/store"
import { CircleDot } from "lucide-react"

const STATUS_COLORS: Record<string, string> = {
  pendent: "#94a3b8",
  en_curs: "#3b82f6",
  revisio: "#a855f7",
  completat: "#10b981",
  bloquejat: "#ef4444",
}

const PRIORITY_SIZES: Record<string, number> = {
  baixa: 20,
  normal: 32,
  alta: 44,
  critica: 56,
}

// Deterministic pseudo-random layout based on index
function layout(index: number, width: number, height: number, radius: number) {
  const cols = Math.ceil(Math.sqrt((width * height) / (radius * radius * 4)))
  const rows = Math.ceil(24 / cols)
  const colW = width / cols
  const rowH = height / rows
  const col = index % cols
  const row = Math.floor(index / cols)
  // Add pseudo-random jitter
  const jitterX = (Math.sin(index * 7.3) * 0.5 + 0.5) * colW * 0.3
  const jitterY = (Math.sin(index * 13.7) * 0.5 + 0.5) * rowH * 0.3
  return {
    x: Math.max(radius + 5, Math.min(width - radius - 5, col * colW + colW / 2 + jitterX - colW * 0.15)),
    y: Math.max(radius + 5, Math.min(height - radius - 5, row * rowH + rowH / 2 + jitterY - rowH * 0.15)),
  }
}

export function TaskBubbles() {
  const tasks = useAppStore((s) => s.tasks)
  const activeTasks = useMemo(
    () => tasks.filter((t) => t.status !== "completat").slice(0, 18),
    [tasks]
  )

  const width = 420
  const height = 260

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <CircleDot className="h-5 w-5 text-accent" />
        <h3 className="font-semibold text-foreground">Mapa de tasques</h3>
        <span className="text-xs text-muted-foreground ml-auto">Mida = prioritat</span>
      </div>

      <div className="relative bg-muted/10 rounded-lg overflow-hidden" style={{ height }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          {activeTasks.map((task, i) => {
            const size = PRIORITY_SIZES[task.priority] || 32
            const pos = layout(i, width, height, size / 2)
            const color = STATUS_COLORS[task.status] || "#94a3b8"
            return (
              <g key={task.id}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={size / 2}
                  fill={color}
                  fillOpacity={0.3}
                  stroke={color}
                  strokeWidth={1.5}
                  className="transition-all hover:fill-opacity-50 cursor-pointer"
                />
                {size >= 40 && (
                  <text
                    x={pos.x}
                    y={pos.y + 3}
                    textAnchor="middle"
                    fontSize={9}
                    fill="white"
                    fontWeight="600"
                    className="pointer-events-none"
                  >
                    {task.title.slice(0, 10)}
                  </text>
                )}
                <title>
                  {task.title} · {task.priority} · {task.status}
                </title>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-3 flex-wrap text-xs">
        {Object.entries(STATUS_COLORS).map(([key, color]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color, opacity: 0.6 }} />
            <span className="text-muted-foreground capitalize">{key.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
