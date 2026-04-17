'use client'

import Link from 'next/link'
import { MoreHorizontal, ExternalLink, CheckCircle2, Clock, AlertTriangle } from 'lucide-react'
import { cn, formatDate, getInitials, getAvatarColor, isOverdue } from '@/lib/utils'
import { TASK_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types'

type Task = {
  id: string
  title: string
  project: { id: string; name: string; code: string }
  status: 'pendent' | 'en_curs' | 'revisio' | 'completat' | 'bloquejat'
  priority: 'baixa' | 'normal' | 'alta' | 'critica'
  assignee?: { id: string; name: string } | null
  dueDate?: Date | null
  estimatedHours?: number | null
  actualHours?: number | null
}

const statusColors = {
  pendent: 'bg-warning/20 text-warning',
  en_curs: 'bg-accent/20 text-accent',
  revisio: 'bg-violet-500/20 text-violet-500',
  completat: 'bg-success/20 text-success',
  bloquejat: 'bg-destructive/20 text-destructive',
}

const priorityColors = {
  baixa: 'bg-muted text-muted-foreground',
  normal: 'bg-accent/20 text-accent',
  alta: 'bg-warning/20 text-warning',
  critica: 'bg-destructive/20 text-destructive',
}

export function TasksTable({ tasks }: { tasks: Task[] }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Tasca
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Projecte
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Estat
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Prioritat
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Assignat
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Data Límit
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                Hores
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                Accions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tasks.map((task) => {
              const taskOverdue = task.dueDate && isOverdue(task.dueDate) && task.status !== 'completat'
              return (
                <tr key={task.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-medium hover:text-primary hover:underline"
                    >
                      {task.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/projects/${task.project.id}`}
                      className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <span className="font-mono text-xs">{task.project.code}</span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
                        statusColors[task.status]
                      )}
                    >
                      {task.status === 'completat' && <CheckCircle2 className="h-3 w-3" />}
                      {task.status === 'en_curs' && <Clock className="h-3 w-3" />}
                      {task.status === 'bloquejat' && <AlertTriangle className="h-3 w-3" />}
                      {TASK_STATUS_LABELS[task.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'rounded-full px-2 py-1 text-xs font-medium',
                        priorityColors[task.priority]
                      )}
                    >
                      {PRIORITY_LABELS[task.priority]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white',
                            getAvatarColor(task.assignee.name)
                          )}
                        >
                          {getInitials(task.assignee.name)}
                        </div>
                        <span className="text-sm">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        'text-sm',
                        taskOverdue ? 'font-medium text-destructive' : 'text-muted-foreground'
                      )}
                    >
                      {taskOverdue && <AlertTriangle className="mr-1 inline h-3 w-3" />}
                      {formatDate(task.dueDate)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-sm text-muted-foreground">
                      {task.actualHours ?? '-'} / {task.estimatedHours ?? '-'}h
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
