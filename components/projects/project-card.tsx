'use client'

import Link from 'next/link'
import { Calendar, Users, MoreVertical, ExternalLink } from 'lucide-react'
import { cn, formatDate, getInitials, getAvatarColor } from '@/lib/utils'
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types'

type Project = {
  id: string
  name: string
  code: string
  description?: string | null
  clientName?: string | null
  boatModel?: string | null
  status: 'planificacio' | 'en_curs' | 'pausat' | 'completat' | 'cancelat'
  priority: 'baixa' | 'normal' | 'alta' | 'critica'
  progress: number
  startDate?: Date | null
  estimatedEndDate?: Date | null
  manager?: { id: string; name: string } | null
  tasksCount: number
  completedTasksCount: number
}

const statusColors = {
  planificacio: 'bg-warning/20 text-warning border-warning/30',
  en_curs: 'bg-accent/20 text-accent border-accent/30',
  pausat: 'bg-muted text-muted-foreground border-muted',
  completat: 'bg-success/20 text-success border-success/30',
  cancelat: 'bg-destructive/20 text-destructive border-destructive/30',
}

const priorityIndicator = {
  baixa: 'bg-muted-foreground',
  normal: 'bg-accent',
  alta: 'bg-warning',
  critica: 'bg-destructive',
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group relative flex flex-col rounded-xl border border-border bg-card transition-all hover:border-primary/30 hover:shadow-lg"
    >
      {/* Priority indicator */}
      <div
        className={cn(
          'absolute left-0 top-4 h-8 w-1 rounded-r-full',
          priorityIndicator[project.priority]
        )}
      />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-muted-foreground">
                {project.code}
              </span>
              <span
                className={cn(
                  'rounded-full border px-2 py-0.5 text-xs font-medium',
                  statusColors[project.status]
                )}
              >
                {PROJECT_STATUS_LABELS[project.status]}
              </span>
            </div>
            <h3 className="mt-2 font-semibold text-foreground group-hover:text-primary truncate">
              {project.name}
            </h3>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault()
              // Menu logic
            }}
            className="shrink-0 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-opacity hover:bg-muted hover:text-foreground group-hover:opacity-100"
          >
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>

        {/* Description */}
        {project.description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {project.description}
          </p>
        )}

        {/* Client & Boat */}
        {(project.clientName || project.boatModel) && (
          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            {project.clientName && (
              <span className="text-muted-foreground">
                <Users className="mr-1 inline h-3.5 w-3.5" />
                {project.clientName}
              </span>
            )}
            {project.boatModel && (
              <span className="text-muted-foreground">{project.boatModel}</span>
            )}
          </div>
        )}

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progrés</span>
            <span className="font-medium">{project.progress.toFixed(0)}%</span>
          </div>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                project.progress === 100
                  ? 'bg-success'
                  : project.progress >= 75
                  ? 'bg-accent'
                  : project.progress >= 50
                  ? 'bg-primary'
                  : project.progress >= 25
                  ? 'bg-warning'
                  : 'bg-muted-foreground'
              )}
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.estimatedEndDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {project.completedTasksCount}/{project.tasksCount} tasques
            </span>
            {project.manager && (
              <div
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white',
                  getAvatarColor(project.manager.name)
                )}
                title={project.manager.name}
              >
                {getInitials(project.manager.name)}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
