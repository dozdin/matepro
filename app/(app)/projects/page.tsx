'use client'

import { useState, useMemo } from 'react'
import { Plus, Search, LayoutGrid, List } from 'lucide-react'
import { ProjectCard } from '@/components/projects/project-card'
import { CreateProjectModal } from '@/components/modals'
import { useAppStore } from '@/lib/store'

type StatusFilter = 'all' | 'planificacio' | 'en_curs' | 'pausat' | 'completat' | 'cancelat'

const STATUS_FILTER_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Tots' },
  { value: 'planificacio', label: 'Planificacio' },
  { value: 'en_curs', label: 'En curs' },
  { value: 'pausat', label: 'Pausat' },
  { value: 'completat', label: 'Completat' },
  { value: 'cancelat', label: 'Cancelat' },
]

export default function ProjectsPage() {
  const projects = useAppStore((state) => state.projects)
  const addProject = useAppStore((state) => state.addProject)
  const tasks = useAppStore((state) => state.tasks)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (statusFilter !== 'all' && p.status !== statusFilter) return false
        const q = searchQuery.toLowerCase().trim()
        if (!q) return true
        return (
          p.name.toLowerCase().includes(q) ||
          p.clientName.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [projects, searchQuery, statusFilter])

  const getTaskCounts = (projectId: string) => {
    const projectTasks = tasks.filter((t) => t.projectId === projectId)
    return {
      tasksCount: projectTasks.length,
      completedTasksCount: projectTasks.filter((t) => t.status === 'completat').length,
    }
  }

  const handleCreateProject = (data: Record<string, unknown>) => {
    addProject({
      name: data.name as string,
      clientName: (data.clientName as string) || 'Sense client',
      status: 'planificacio',
      priority: (data.priority as 'baixa' | 'normal' | 'alta' | 'critica') || 'normal',
      progress: 0,
      budget: Number(data.budget) || 0,
      spent: 0,
      startDate: (data.startDate as string) || new Date().toISOString().slice(0, 10),
      endDate: (data.estimatedEndDate as string) || new Date().toISOString().slice(0, 10),
      description: (data.description as string) || '',
      teamSize: 1,
      managerId: 'demo-manager',
      managerName: 'Ana Garcia',
    })
  }

  const stats = useMemo(() => ({
    total: projects.length,
    en_curs: projects.filter((p) => p.status === 'en_curs').length,
    planificacio: projects.filter((p) => p.status === 'planificacio').length,
    completat: projects.filter((p) => p.status === 'completat').length,
  }), [projects])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projectes</h1>
          <p className="text-muted-foreground">
            Gestiona tots els projectes de l&apos;astillero
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nou Projecte
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
          <p className="text-sm text-muted-foreground">Planificacio</p>
          <p className="text-2xl font-bold text-warning">{stats.planificacio}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completats</p>
          <p className="text-2xl font-bold text-success">{stats.completat}</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cercar projectes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`shrink-0 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                statusFilter === opt.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <div className="flex rounded-lg border border-border p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`rounded-md p-2 ${viewMode === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`rounded-md p-2 ${viewMode === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Cap projecte trobat</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || statusFilter !== 'all'
              ? 'No hi ha projectes que coincideixin amb els filtres'
              : 'Encara no hi ha projectes. Crea&apos;n el primer!'}
          </p>
          {(searchQuery || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setStatusFilter('all')
              }}
              className="text-primary hover:underline text-sm"
            >
              Esborrar filtres
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const { tasksCount, completedTasksCount } = getTaskCounts(project.id)
            return (
              <ProjectCard
                key={project.id}
                project={{
                  id: project.id,
                  name: project.name,
                  code: project.id.toUpperCase(),
                  description: project.description,
                  clientName: project.clientName,
                  boatModel: null,
                  status: project.status,
                  priority: project.priority,
                  progress: project.progress,
                  startDate: new Date(project.startDate),
                  estimatedEndDate: new Date(project.endDate),
                  manager: { id: project.managerId, name: project.managerName },
                  tasksCount,
                  completedTasksCount,
                }}
              />
            )
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Projecte</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Client</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Estat</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Progres</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Pressupost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredProjects.map((project) => (
                <tr
                  key={project.id}
                  onClick={() => (window.location.href = `/projects/${project.id}`)}
                  className="cursor-pointer hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium">{project.name}</div>
                    <div className="text-xs text-muted-foreground">{project.id}</div>
                  </td>
                  <td className="px-4 py-3 text-sm">{project.clientName}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-accent/10 text-accent px-2 py-0.5 text-xs font-medium">
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 w-20 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {new Intl.NumberFormat('ca-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(project.budget)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}
