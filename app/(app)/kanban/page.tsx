'use client'

import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { KanbanBoard } from '@/components/kanban/kanban-board'
import { CreateTaskModal } from '@/components/modals'
import { useAppStore } from '@/lib/store'
import { toast } from 'sonner'

export default function KanbanPage() {
  const tasks = useAppStore((state) => state.tasks)
  const projects = useAppStore((state) => state.projects)
  const addTask = useAppStore((state) => state.addTask)
  const updateTaskStatus = useAppStore((state) => state.updateTaskStatus)

  const [selectedProject, setSelectedProject] = useState<string>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const tasksByStatus = useMemo(() => {
    const filtered = selectedProject === 'all'
      ? tasks
      : tasks.filter((t) => t.projectId === selectedProject)

    return {
      pendent: filtered
        .filter((t) => t.status === 'pendent')
        .map((t) => ({
          id: t.id,
          title: t.title,
          project: { id: t.projectId, name: t.projectName },
          priority: t.priority,
          assignee: t.assigneeId && t.assigneeName ? { id: t.assigneeId, name: t.assigneeName } : null,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        })),
      en_curs: filtered
        .filter((t) => t.status === 'en_curs')
        .map((t) => ({
          id: t.id,
          title: t.title,
          project: { id: t.projectId, name: t.projectName },
          priority: t.priority,
          assignee: t.assigneeId && t.assigneeName ? { id: t.assigneeId, name: t.assigneeName } : null,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        })),
      revisio: filtered
        .filter((t) => t.status === 'revisio')
        .map((t) => ({
          id: t.id,
          title: t.title,
          project: { id: t.projectId, name: t.projectName },
          priority: t.priority,
          assignee: t.assigneeId && t.assigneeName ? { id: t.assigneeId, name: t.assigneeName } : null,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        })),
      completat: filtered
        .filter((t) => t.status === 'completat')
        .map((t) => ({
          id: t.id,
          title: t.title,
          project: { id: t.projectId, name: t.projectName },
          priority: t.priority,
          assignee: t.assigneeId && t.assigneeName ? { id: t.assigneeId, name: t.assigneeName } : null,
          dueDate: t.dueDate ? new Date(t.dueDate) : null,
        })),
    }
  }, [tasks, selectedProject])

  const handleTaskMove = (taskId: string, newStatus: 'pendent' | 'en_curs' | 'revisio' | 'completat') => {
    updateTaskStatus(taskId, newStatus)
    const task = tasks.find((t) => t.id === taskId)
    if (task && task.status !== newStatus) {
      toast.success(`"${task.title}" mogut a ${newStatus.replace('_', ' ')}`)
    }
  }

  const handleCreateTask = (data: Record<string, unknown>) => {
    const projectId = data.projectId as string
    const project = projects.find((p) => p.id === projectId)
    addTask({
      title: data.title as string,
      description: (data.description as string) || '',
      projectId,
      projectName: project?.name || 'Sense projecte',
      status: 'pendent',
      priority: (data.priority as 'baixa' | 'normal' | 'alta' | 'critica') || 'normal',
      assigneeId: (data.assigneeId as string) || null,
      assigneeName: null,
      dueDate: (data.dueDate as string) || null,
      startDate: null,
      estimatedHours: Number(data.estimatedHours) || 8,
      actualHours: null,
    })
  }

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tauler Kanban</h1>
          <p className="text-muted-foreground">
            Arrossega les tasques per canviar el seu estat
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="h-10 rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Tots els projectes</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Nova Tasca
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-hidden">
        <KanbanBoard initialTasks={tasksByStatus} onTaskMove={handleTaskMove} />
      </div>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
        projectId={selectedProject !== 'all' ? selectedProject : undefined}
      />
    </div>
  )
}
