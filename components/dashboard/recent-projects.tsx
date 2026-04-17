'use client'

import Link from 'next/link'
import { ArrowRight, MoreHorizontal, FolderKanban } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types'
import { useAppStore } from '@/lib/store'

const statusColors: Record<string, string> = {
  planificacio: 'bg-warning/20 text-warning',
  en_curs: 'bg-accent/20 text-accent',
  pausat: 'bg-muted text-muted-foreground',
  completat: 'bg-success/20 text-success',
  cancelat: 'bg-destructive/20 text-destructive',
}

const priorityColors: Record<string, string> = {
  baixa: 'bg-muted text-muted-foreground',
  normal: 'bg-accent/20 text-accent',
  alta: 'bg-warning/20 text-warning',
  critica: 'bg-destructive/20 text-destructive',
}

function formatDate(isoDate: string) {
  const d = new Date(isoDate)
  const months = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des']
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

export function RecentProjects() {
  const allProjects = useAppStore((state) => state.projects)
  const projects = [...allProjects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold">Projectes Recents</h2>
        <Link
          href="/projects"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Veure tots
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FolderKanban className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No hi ha projectes encara</p>
          <Link
            href="/projects"
            className="mt-2 text-sm text-primary hover:underline"
          >
            Crear el primer projecte
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{project.name}</h3>
                  <span
                    className={cn(
                      'shrink-0 rounded-full px-2 py-0.5 text-xs font-medium',
                      priorityColors[project.priority] || priorityColors.normal
                    )}
                  >
                    {PRIORITY_LABELS[project.priority] || project.priority}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="truncate">{project.clientName}</span>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium">{project.progress}%</span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-2">
                <span
                  className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    statusColors[project.status] || statusColors.en_curs
                  )}
                >
                  {PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS] || project.status}
                </span>
                <span className="text-xs text-muted-foreground">{formatDate(project.endDate)}</span>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
