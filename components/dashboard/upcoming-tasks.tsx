'use client'

import Link from 'next/link'
import { ArrowRight, Clock, AlertTriangle, CheckCircle2, ListTodo } from 'lucide-react'
import { cn, getInitials, getAvatarColor } from '@/lib/utils'
import { TASK_STATUS_LABELS } from '@/lib/types'
import { useAppStore } from '@/lib/store'

const statusIcons = {
  pendent: Clock,
  en_curs: Clock,
  revisio: Clock,
  completat: CheckCircle2,
  bloquejat: AlertTriangle,
}

const priorityColors: Record<string, string> = {
  baixa: 'border-l-muted-foreground',
  normal: 'border-l-accent',
  alta: 'border-l-warning',
  critica: 'border-l-destructive',
}

function formatShortDate(iso: string | null) {
  if (!iso) return 'Sense data'
  const d = new Date(iso)
  const months = ['Gen', 'Feb', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Oct', 'Nov', 'Des']
  return `${d.getDate()} ${months[d.getMonth()]}`
}

export function UpcomingTasks() {
  const allTasks = useAppStore((state) => state.tasks)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const tasks = allTasks
    .filter((t) => t.status !== 'completat')
    .sort((a, b) => {
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
    .slice(0, 5)

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h2 className="font-semibold">Tasques Properes</h2>
        <Link
          href="/tasks"
          className="flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Veure totes
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <ListTodo className="h-10 w-10 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No hi ha tasques pendents</p>
        </div>
      ) : (
        <div className="divide-y divide-border">
          {tasks.map((task) => {
            const StatusIcon = statusIcons[task.status] || Clock
            const isOverdue = task.dueDate ? new Date(task.dueDate) < today : false
            return (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className={cn(
                  'flex items-center gap-3 border-l-4 p-4 transition-colors hover:bg-muted/50',
                  priorityColors[task.priority] || priorityColors.normal
                )}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                    task.status === 'completat'
                      ? 'bg-success/20 text-success'
                      : task.status === 'bloquejat'
                      ? 'bg-destructive/20 text-destructive'
                      : isOverdue
                      ? 'bg-destructive/20 text-destructive'
                      : 'bg-accent/20 text-accent'
                  )}
                >
                  <StatusIcon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{task.title}</h3>
                  <div className="mt-0.5 flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="truncate">{task.projectName}</span>
                    <span>•</span>
                    <span className={isOverdue ? 'text-destructive font-medium' : ''}>
                      {isOverdue && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                      {formatShortDate(task.dueDate)}
                    </span>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <span
                    className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      task.status === 'en_curs'
                        ? 'bg-accent/20 text-accent'
                        : task.status === 'pendent'
                        ? 'bg-warning/20 text-warning'
                        : task.status === 'completat'
                        ? 'bg-success/20 text-success'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {TASK_STATUS_LABELS[task.status] || task.status}
                  </span>
                  {task.assigneeName && (
                    <div
                      className={cn(
                        'flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium text-white',
                        getAvatarColor(task.assigneeName)
                      )}
                      title={task.assigneeName}
                    >
                      {getInitials(task.assigneeName)}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
