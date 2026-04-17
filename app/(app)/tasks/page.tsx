'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, Calendar, User } from 'lucide-react'
import { TasksTable } from '@/components/tasks/tasks-table'
import { CreateTaskModal } from '@/components/modals'
import { useAppStore } from '@/lib/store'

export default function TasksPage() {
  const tasks = useAppStore((state) => state.tasks)
  const projects = useAppStore((state) => state.projects)
  const addTask = useAppStore((state) => state.addTask)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [assigneeFilter, setAssigneeFilter] = useState<string>('all')

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((t) => {
        const q = searchQuery.toLowerCase().trim()
        const matchesSearch = !q ||
          t.title.toLowerCase().includes(q) ||
          t.projectName.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q)
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter
        const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter
        const matchesAssignee = assigneeFilter === 'all' || t.assigneeId === assigneeFilter
        return matchesSearch && matchesStatus && matchesPriority && matchesAssignee
      })
      .sort((a, b) => {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      })
  }, [tasks, searchQuery, statusFilter, priorityFilter, assigneeFilter])

  const stats = useMemo(() => ({
    total: tasks.length,
    pendent: tasks.filter((t) => t.status === 'pendent').length,
    en_curs: tasks.filter((t) => t.status === 'en_curs').length,
    completat: tasks.filter((t) => t.status === 'completat').length,
  }), [tasks])

  // Build unique assignees
  const assignees = useMemo(() => {
    const map = new Map<string, string>()
    tasks.forEach((t) => {
      if (t.assigneeId && t.assigneeName) map.set(t.assigneeId, t.assigneeName)
    })
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }))
  }, [tasks])

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
      assigneeName: assignees.find((a) => a.id === data.assigneeId)?.name || null,
      dueDate: (data.dueDate as string) || null,
      startDate: null,
      estimatedHours: Number(data.estimatedHours) || 8,
      actualHours: null,
    })
  }

  // Adapt tasks for TasksTable component
  const adaptedTasks = useMemo(() => {
    return filteredTasks.map((t) => {
      const project = projects.find((p) => p.id === t.projectId)
      return {
        id: t.id,
        title: t.title,
        project: {
          id: t.projectId,
          name: project?.name || t.projectName,
          code: t.projectId.toUpperCase(),
        },
        status: t.status,
        priority: t.priority,
        assignee: t.assigneeId && t.assigneeName ? { id: t.assigneeId, name: t.assigneeName } : null,
        dueDate: t.dueDate ? new Date(t.dueDate) : null,
        estimatedHours: t.estimatedHours,
        actualHours: t.actualHours,
      }
    })
  }, [filteredTasks, projects])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasques</h1>
          <p className="text-muted-foreground">
            Gestiona totes les tasques dels projectes
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nova Tasca
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">En Curs</p>
          <p className="text-2xl font-bold text-accent">{stats.en_curs}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pendents</p>
          <p className="text-2xl font-bold text-warning">{stats.pendent}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completades</p>
          <p className="text-2xl font-bold text-success">{stats.completat}</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cercar tasques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Tots els estats</option>
            <option value="pendent">Pendent</option>
            <option value="en_curs">En Curs</option>
            <option value="revisio">Revisio</option>
            <option value="completat">Completat</option>
            <option value="bloquejat">Bloquejat</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Prioritat</option>
            <option value="critica">Critica</option>
            <option value="alta">Alta</option>
            <option value="normal">Normal</option>
            <option value="baixa">Baixa</option>
          </select>
          <select
            value={assigneeFilter}
            onChange={(e) => setAssigneeFilter(e.target.value)}
            className="h-10 rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="all">Assignat a</option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tasks table */}
      {adaptedTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Cap tasca trobada</h3>
          <p className="text-muted-foreground mb-4">
            {tasks.length === 0 ? 'Encara no hi ha tasques. Crea\'n la primera!' : 'Prova amb altres filtres'}
          </p>
          {(searchQuery || statusFilter !== 'all' || priorityFilter !== 'all' || assigneeFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
                setPriorityFilter('all')
                setAssigneeFilter('all')
              }}
              className="text-primary hover:underline text-sm"
            >
              Esborrar filtres
            </button>
          )}
        </div>
      ) : (
        <TasksTable tasks={adaptedTasks} />
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  )
}
