'use client'

import { useState, useEffect } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { KanbanColumn } from './kanban-column'
import { KanbanCard } from './kanban-card'
import { TASK_STATUS_LABELS } from '@/lib/types'

type Task = {
  id: string
  title: string
  project: { id: string; name: string }
  priority: 'baixa' | 'normal' | 'alta' | 'critica'
  assignee?: { id: string; name: string } | null
  dueDate?: Date | null
}

type KanbanStatus = 'pendent' | 'en_curs' | 'revisio' | 'completat'

type TasksByStatus = {
  pendent: Task[]
  en_curs: Task[]
  revisio: Task[]
  completat: Task[]
}

interface KanbanBoardProps {
  initialTasks: TasksByStatus
  onTaskMove?: (taskId: string, newStatus: KanbanStatus) => void
}

const columns: { id: KanbanStatus; title: string; color: string }[] = [
  { id: 'pendent', title: TASK_STATUS_LABELS.pendent, color: 'border-t-warning' },
  { id: 'en_curs', title: TASK_STATUS_LABELS.en_curs, color: 'border-t-accent' },
  { id: 'revisio', title: TASK_STATUS_LABELS.revisio, color: 'border-t-violet-500' },
  { id: 'completat', title: TASK_STATUS_LABELS.completat, color: 'border-t-success' },
]

export function KanbanBoard({ initialTasks, onTaskMove }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<TasksByStatus>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  // Sync with parent when initial tasks change (e.g., store updates)
  useEffect(() => {
    setTasks(initialTasks)
  }, [initialTasks])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  function findColumn(taskId: string): KanbanStatus | null {
    for (const [column, columnTasks] of Object.entries(tasks) as [KanbanStatus, Task[]][]) {
      if (columnTasks.find((t) => t.id === taskId)) {
        return column
      }
    }
    return null
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const column = findColumn(active.id as string)
    if (column) {
      const task = tasks[column].find((t) => t.id === active.id)
      if (task) setActiveTask(task)
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumn(activeId)
    const overColumn = columns.find((c) => c.id === overId)
      ? (overId as KanbanStatus)
      : findColumn(overId)

    if (!activeColumn || !overColumn || activeColumn === overColumn) return

    setTasks((prev) => {
      const activeItems = [...prev[activeColumn]]
      const overItems = [...prev[overColumn]]

      const activeIndex = activeItems.findIndex((t) => t.id === activeId)
      const [movedTask] = activeItems.splice(activeIndex, 1)

      const overIndex = overItems.findIndex((t) => t.id === overId)
      if (overIndex === -1) {
        overItems.push(movedTask)
      } else {
        overItems.splice(overIndex, 0, movedTask)
      }

      return {
        ...prev,
        [activeColumn]: activeItems,
        [overColumn]: overItems,
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)

    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeColumn = findColumn(activeId)
    const overColumn = columns.find((c) => c.id === overId)
      ? (overId as KanbanStatus)
      : findColumn(overId)

    if (!activeColumn || !overColumn) return

    if (activeColumn === overColumn) {
      const columnTasks = tasks[activeColumn]
      const activeIndex = columnTasks.findIndex((t) => t.id === activeId)
      const overIndex = columnTasks.findIndex((t) => t.id === overId)

      if (activeIndex !== overIndex) {
        setTasks((prev) => ({
          ...prev,
          [activeColumn]: arrayMove(prev[activeColumn], activeIndex, overIndex),
        }))
      }
    } else {
      // Column changed - persist to store via callback
      if (onTaskMove) {
        onTaskMove(activeId, overColumn)
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            title={column.title}
            color={column.color}
            count={tasks[column.id].length}
          >
            <SortableContext
              items={tasks[column.id].map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks[column.id].map((task) => (
                <KanbanCard key={task.id} task={task} />
              ))}
            </SortableContext>
          </KanbanColumn>
        ))}
      </div>

      <DragOverlay>
        {activeTask ? <KanbanCard task={activeTask} isDragging /> : null}
      </DragOverlay>
    </DndContext>
  )
}
