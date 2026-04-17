'use client'

import { use, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Calendar,
  Users,
  FileText,
  Edit,
  MoreHorizontal,
  CheckCircle2,
  Circle,
  AlertCircle,
  Plus,
  Trash2,
  ChevronRight,
  FolderKanban,
} from 'lucide-react'
import { cn, formatDate, formatRelativeTime, getInitials, getAvatarColor } from '@/lib/utils'
import {
  PROJECT_STATUS_LABELS,
  TASK_STATUS_LABELS,
  PRIORITY_LABELS,
} from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { CreateTaskModal } from '@/components/modals'

const statusColors: Record<string, string> = {
  pendent: 'bg-warning/20 text-warning',
  en_curs: 'bg-accent/20 text-accent',
  revisio: 'bg-violet-500/20 text-violet-500',
  completat: 'bg-success/20 text-success',
  bloquejat: 'bg-destructive/20 text-destructive',
}

const priorityColors: Record<string, string> = {
  baixa: 'bg-muted text-muted-foreground',
  normal: 'bg-accent/20 text-accent',
  alta: 'bg-warning/20 text-warning',
  critica: 'bg-destructive/20 text-destructive',
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const project = useAppStore((state) => state.projects.find((p) => p.id === id))
  const allTasks = useAppStore((state) => state.tasks)
  const allDocuments = useAppStore((state) => state.documents)
  const allChecklists = useAppStore((state) => state.checklists)
  const addTask = useAppStore((state) => state.addTask)
  const updateTaskStatus = useAppStore((state) => state.updateTaskStatus)
  const deleteProject = useAppStore((state) => state.deleteProject)
  const updateProject = useAppStore((state) => state.updateProject)

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'team' | 'documents' | 'activity'>('overview')
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  const projectTasks = useMemo(
    () => allTasks.filter((t) => t.projectId === id),
    [allTasks, id]
  )
  const projectDocuments = useMemo(
    () => allDocuments.filter((d) => d.projectId === id),
    [allDocuments, id]
  )
  const projectChecklists = useMemo(
    () => allChecklists.filter((c) => c.projectId === id),
    [allChecklists, id]
  )

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <FolderKanban className="h-12 w-12 text-muted-foreground mb-3" />
        <h2 className="text-xl font-semibold mb-2">Projecte no trobat</h2>
        <p className="text-muted-foreground mb-4">
          Aquest projecte no existeix o ha estat eliminat
        </p>
        <button
          onClick={() => router.push('/projects')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Tornar a projectes
        </button>
      </div>
    )
  }

  const completedTasks = projectTasks.filter((t) => t.status === 'completat').length
  const totalTasks = projectTasks.length
  const taskProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const handleCreateTask = (data: Record<string, unknown>) => {
    addTask({
      title: data.title as string,
      description: (data.description as string) || '',
      projectId: project.id,
      projectName: project.name,
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

  const handleDeleteProject = () => {
    if (confirm(`Eliminar el projecte "${project.name}" i totes les seves tasques?`)) {
      deleteProject(project.id)
      toast.success('Projecte eliminat')
      router.push('/projects')
    }
  }

  const handleToggleStatus = () => {
    const newStatus = project.status === 'en_curs' ? 'pausat' : 'en_curs'
    updateProject(project.id, { status: newStatus })
    toast.success(`Projecte ${newStatus === 'en_curs' ? 'reactivat' : 'pausat'}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1">
          <Link
            href="/projects"
            className="mt-1 rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-muted-foreground">{project.id}</span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  project.status === 'en_curs'
                    ? 'bg-accent/20 text-accent'
                    : project.status === 'completat'
                    ? 'bg-success/20 text-success'
                    : 'bg-warning/20 text-warning'
                )}
              >
                {PROJECT_STATUS_LABELS[project.status as keyof typeof PROJECT_STATUS_LABELS]}
              </span>
              <span
                className={cn(
                  'rounded-full px-2 py-0.5 text-xs font-medium',
                  priorityColors[project.priority]
                )}
              >
                {PRIORITY_LABELS[project.priority]}
              </span>
            </div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="mt-1 text-muted-foreground">{project.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleStatus}
            className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
            {project.status === 'en_curs' ? 'Pausar' : 'Reactivar'}
          </button>
          <button
            onClick={handleDeleteProject}
            className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
            title="Eliminar projecte"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Progres</p>
          <p className="text-2xl font-bold">{project.progress}%</p>
          <div className="mt-2 h-1.5 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tasques</p>
          <p className="text-2xl font-bold">
            {completedTasks} / {totalTasks}
          </p>
          <p className="text-xs text-muted-foreground mt-2">{taskProgress}% completat</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Pressupost</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat('ca-ES', {
              style: 'currency',
              currency: 'EUR',
              maximumFractionDigits: 0,
            }).format(project.budget)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {Math.round((project.spent / Math.max(project.budget, 1)) * 100)}% usat
          </p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Equip</p>
          <p className="text-2xl font-bold">{project.teamSize}</p>
          <p className="text-xs text-muted-foreground mt-2">Membres assignats</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex gap-1 overflow-x-auto">
          {[
            { id: 'overview', label: 'Resum' },
            { id: 'tasks', label: `Tasques (${totalTasks})` },
            { id: 'team', label: 'Equip' },
            { id: 'documents', label: `Documents (${projectDocuments.length})` },
            { id: 'activity', label: 'Activitat' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'shrink-0 px-4 py-2 text-sm font-medium border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Client info */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-4">Informacio del client</h3>
              <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-muted-foreground">Nom</dt>
                  <dd className="font-medium">{project.clientName}</dd>
                </div>
                <div>
                  <dt className="text-sm text-muted-foreground">Manager</dt>
                  <dd className="font-medium">{project.managerName}</dd>
                </div>
              </dl>
            </div>

            {/* Checklists */}
            {projectChecklists.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Checklists</h3>
                  <Link
                    href="/checklists"
                    className="text-sm text-primary hover:underline"
                  >
                    Veure totes
                  </Link>
                </div>
                <div className="space-y-2">
                  {projectChecklists.slice(0, 3).map((cl) => {
                    const total = cl.items.length
                    const done = cl.items.filter((i) => i.completed).length
                    return (
                      <Link
                        key={cl.id}
                        href={`/checklists/${cl.id}`}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <CheckCircle2
                          className={cn(
                            'h-5 w-5',
                            done === total && total > 0 ? 'text-success' : 'text-muted-foreground'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{cl.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {done}/{total} items
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {/* Dates */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold mb-4">Dates</h3>
              <dl className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Inici</dt>
                    <dd className="font-medium">{formatDate(new Date(project.startDate))}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                  <div>
                    <dt className="text-sm text-muted-foreground">Final estimat</dt>
                    <dd className="font-medium">{formatDate(new Date(project.endDate))}</dd>
                  </div>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Nova tasca
            </button>
          </div>
          {projectTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border bg-card">
              <Circle className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                Encara no hi ha tasques en aquest projecte
              </p>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {projectTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors"
                >
                  <button
                    onClick={() =>
                      updateTaskStatus(
                        task.id,
                        task.status === 'completat' ? 'pendent' : 'completat'
                      )
                    }
                    className="shrink-0"
                  >
                    {task.status === 'completat' ? (
                      <CheckCircle2 className="h-5 w-5 text-success" />
                    ) : task.status === 'bloquejat' ? (
                      <AlertCircle className="h-5 w-5 text-destructive" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground hover:text-primary" />
                    )}
                  </button>
                  <Link href={`/tasks/${task.id}`} className="flex-1 min-w-0">
                    <p
                      className={cn(
                        'font-medium',
                        task.status === 'completat' && 'line-through text-muted-foreground'
                      )}
                    >
                      {task.title}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          statusColors[task.status]
                        )}
                      >
                        {TASK_STATUS_LABELS[task.status]}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 text-xs font-medium',
                          priorityColors[task.priority]
                        )}
                      >
                        {PRIORITY_LABELS[task.priority]}
                      </span>
                      {task.dueDate && (
                        <span className="text-xs text-muted-foreground">
                          {formatDate(new Date(task.dueDate))}
                        </span>
                      )}
                    </div>
                  </Link>
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
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'team' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-6">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium text-white',
                getAvatarColor(project.managerName)
              )}
            >
              {getInitials(project.managerName)}
            </div>
            <div>
              <p className="font-medium">{project.managerName}</p>
              <p className="text-sm text-muted-foreground">Project Manager</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground text-center py-4">
            Gestio de l&apos;equip disponible en la pagina d&apos;Admin
          </p>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-3">
          {projectDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center rounded-xl border border-border bg-card">
              <FileText className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Cap document pujat a aquest projecte
              </p>
              <Link
                href="/documents"
                className="text-sm text-primary hover:underline"
              >
                Anar a documents
              </Link>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              {projectDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-4 hover:bg-muted/30"
                >
                  <FileText className="h-5 w-5 text-muted-foreground shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.uploadedBy} · {formatDate(new Date(doc.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Activitat recent</h3>
          <div className="space-y-4">
            {projectTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-start gap-3">
                <div className="rounded-full bg-accent/20 text-accent p-1.5 mt-0.5">
                  <Edit className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{task.assigneeName || 'Usuari'}</span>{' '}
                    ha actualitzat la tasca{' '}
                    <Link
                      href={`/tasks/${task.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {task.title}
                    </Link>
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {formatRelativeTime(new Date(task.updatedAt))}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        projectId={project.id}
      />
    </div>
  )
}
