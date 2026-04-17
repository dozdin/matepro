'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Link from 'next/link'
import { Calendar, GripVertical } from 'lucide-react'
import { cn, formatDate, getInitials, getAvatarColor, isOverdue } from '@/lib/utils'
import { PRIORITY_LABELS } from '@/lib/types'

type Task = {
  id: string
  title: string
  project: { id: string; name: string }
  priority: 'baixa' | 'normal' | 'alta' | 'critica'
  assignee?: { id: string; name: string } | null
  dueDate?: Date | null
}

const priorityColors = {
  baixa: 'bg-muted text-muted-foreground',
  normal: 'bg-accent/20 text-accent',
  alta: 'bg-warning/20 text-warning',
  critica: 'bg-destructive/20 text-destructive',
}

export function KanbanCard({ task, isDragging }: { task: Task; isDragging?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const taskOverdue = task.dueDate && isOverdue(task.dueDate)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group rounded-lg border border-border bg-background p-3 transition-all',
        (isDragging || isSortableDragging) && 'rotate-3 shadow-xl opacity-90',
        !isDragging && !isSortableDragging && 'hover:border-primary/30 hover:shadow-sm'
      )}
    >
      {/* Drag handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-1 top-1/2 -translate-y-1/2 cursor-grab rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
      >
        <GripVertical className="h-4 w-4" />
      </div>

      {/* Priority badge */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={cn(
            'rounded-full px-2 py-0.5 text-xs font-medium',
            priorityColors[task.priority]
          )}
        >
          {PRIORITY_LABELS[task.priority]}
        </span>
      </div>

      {/* Title */}
      <Link
        href={`/tasks/${task.id}`}
        className="mt-2 block font-medium hover:text-primary"
      >
        {task.title}
      </Link>

      {/* Project */}
      <Link
        href={`/projects/${task.project.id}`}
        className="mt-1 block text-sm text-muted-foreground hover:text-foreground"
      >
        {task.project.name}
      </Link>

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        {task.dueDate && (
          <span
            className={cn(
              'flex items-center gap-1 text-xs',
              taskOverdue ? 'font-medium text-destructive' : 'text-muted-foreground'
            )}
          >
            <Calendar className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        )}
        {task.assignee && (
          <div
            className={cn(
              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white',
              getAvatarColor(task.assignee.name)
            )}
            title={task.assignee.name}
          >
            {getInitials(task.assignee.name)}
          </div>
        )}
      </div>
    </div>
  )
}
