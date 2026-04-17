'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Plus, Search, CheckSquare, Square, MoreVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate, getInitials, getAvatarColor, calculateProgress } from '@/lib/utils'
import { CreateChecklistModal } from '@/components/modals'
import { useAppStore } from '@/lib/store'

export default function ChecklistsPage() {
  const checklists = useAppStore((state) => state.checklists)
  const projects = useAppStore((state) => state.projects)
  const addChecklist = useAppStore((state) => state.addChecklist)
  const deleteChecklist = useAppStore((state) => state.deleteChecklist)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filteredChecklists = useMemo(() => {
    return checklists
      .filter((c) => {
        const q = searchQuery.toLowerCase().trim()
        if (!q) return true
        return (
          c.name.toLowerCase().includes(q) ||
          (c.projectName?.toLowerCase() || '').includes(q)
        )
      })
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
  }, [checklists, searchQuery])

  const handleCreateChecklist = (data: {
    name: string
    description: string
    projectId: string
    items: string[]
  }) => {
    const project = projects.find((p) => p.id === data.projectId)
    addChecklist({
      name: data.name,
      projectId: data.projectId || null,
      projectName: project?.name || null,
      items: data.items.map((text) => ({
        id: `chki_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        text,
        completed: false,
        completedAt: null,
        completedBy: null,
        notes: '',
      })),
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Eliminar la checklist "${name}"?`)) {
      deleteChecklist(id)
      toast.success('Checklist eliminada')
      setOpenMenuId(null)
    }
  }

  const stats = useMemo(() => {
    return {
      total: checklists.length,
      inProgress: checklists.filter((c) => {
        const completed = c.items.filter((i) => i.completed).length
        return completed > 0 && completed < c.items.length
      }).length,
      completed: checklists.filter(
        (c) => c.items.length > 0 && c.items.every((i) => i.completed)
      ).length,
    }
  }, [checklists])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Checklists</h1>
          <p className="text-muted-foreground">
            Llistes de verificacio per a tasques i projectes
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Nova Checklist
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">En Progres</p>
          <p className="text-2xl font-bold text-accent">{stats.inProgress}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Completades</p>
          <p className="text-2xl font-bold text-success">{stats.completed}</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cercar checklists..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        />
      </div>

      {/* Checklists grid */}
      {filteredChecklists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <CheckSquare className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Cap checklist trobada</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? 'No hi ha checklists que coincideixin amb la cerca'
              : 'Crea la teva primera checklist'}
          </p>
          {searchQuery ? (
            <button
              onClick={() => setSearchQuery('')}
              className="text-primary hover:underline text-sm"
            >
              Esborrar cerca
            </button>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-primary hover:underline text-sm"
            >
              Crear checklist
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredChecklists.map((checklist) => {
            const itemsCompleted = checklist.items.filter((i) => i.completed).length
            const itemsTotal = checklist.items.length
            const progress = calculateProgress(itemsCompleted, itemsTotal)
            const isComplete = progress === 100 && itemsTotal > 0

            return (
              <div
                key={checklist.id}
                className="relative group rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-lg"
              >
                <Link href={`/checklists/${checklist.id}`} className="block">
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        'rounded-lg p-2',
                        isComplete
                          ? 'bg-success/20 text-success'
                          : 'bg-primary/20 text-primary'
                      )}
                    >
                      {isComplete ? (
                        <CheckSquare className="h-5 w-5" />
                      ) : (
                        <Square className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3 font-semibold group-hover:text-primary">
                    {checklist.name}
                  </h3>

                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    {checklist.projectName ? (
                      <span>{checklist.projectName}</span>
                    ) : (
                      <span className="italic">Sense projecte</span>
                    )}
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progres</span>
                      <span className="font-medium">
                        {itemsCompleted}/{itemsTotal}
                      </span>
                    </div>
                    <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          'h-full rounded-full transition-all',
                          isComplete ? 'bg-success' : 'bg-primary'
                        )}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(checklist.updatedAt))}
                    </span>
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white',
                        getAvatarColor('Usuari')
                      )}
                    >
                      {getInitials('Usuari')}
                    </div>
                  </div>
                </Link>

                <button
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setOpenMenuId(openMenuId === checklist.id ? null : checklist.id)
                  }}
                  className="absolute top-4 right-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>

                {openMenuId === checklist.id && (
                  <div className="absolute top-12 right-4 z-10 w-40 rounded-lg border border-border bg-card shadow-lg">
                    <button
                      onClick={() => handleDelete(checklist.id, checklist.name)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted rounded-lg"
                    >
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Create Checklist Modal */}
      <CreateChecklistModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateChecklist}
      />
    </div>
  )
}
