'use client'

import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { Plus } from 'lucide-react'

type KanbanColumnProps = {
  id: string
  title: string
  color: string
  count: number
  children: React.ReactNode
}

export function KanbanColumn({ id, title, color, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full w-80 shrink-0 flex-col rounded-xl border-t-4 bg-card',
        color,
        isOver && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">{title}</h3>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
            {count}
          </span>
        </div>
        <button className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Cards container */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {children}
        {count === 0 && (
          <div className="flex h-24 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
            Cap tasca
          </div>
        )}
      </div>
    </div>
  )
}
