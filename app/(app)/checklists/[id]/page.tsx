'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Plus,
  CheckSquare,
  Square,
  Trash2,
  Save,
  X,
  CheckCircle,
} from 'lucide-react'
import {
  cn,
  formatDate,
  getInitials,
  getAvatarColor,
  calculateProgress,
} from '@/lib/utils'
import { useAppStore } from '@/lib/store'

const CURRENT_USER_NAME = 'Carlos Martinez'

export default function ChecklistDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const checklist = useAppStore((state) => state.checklists.find((c) => c.id === id))
  const addItem = useAppStore((state) => state.addChecklistItem)
  const toggleItem = useAppStore((state) => state.toggleChecklistItem)
  const deleteItem = useAppStore((state) => state.deleteChecklistItem)
  const updateItem = useAppStore((state) => state.updateChecklistItem)
  const deleteChecklist = useAppStore((state) => state.deleteChecklist)

  const [newItemText, setNewItemText] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  if (!checklist) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-12 w-12 text-muted-foreground mb-3" />
        <h2 className="text-xl font-semibold mb-2">Checklist no trobada</h2>
        <p className="text-muted-foreground mb-4">Aquesta checklist no existeix o ha estat eliminada</p>
        <button
          onClick={() => router.push('/checklists')}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
        >
          Tornar a checklists
        </button>
      </div>
    )
  }

  const itemsTotal = checklist.items.length
  const itemsCompleted = checklist.items.filter((i) => i.completed).length
  const progress = calculateProgress(itemsCompleted, itemsTotal)
  const isComplete = progress === 100 && itemsTotal > 0

  const handleAddItem = () => {
    if (!newItemText.trim()) return
    addItem(checklist.id, newItemText.trim())
    setNewItemText('')
    toast.success('Item afegit')
  }

  const handleToggle = (itemId: string) => {
    toggleItem(checklist.id, itemId, CURRENT_USER_NAME)
  }

  const handleDeleteItem = (itemId: string) => {
    deleteItem(checklist.id, itemId)
    toast.success('Item eliminat')
  }

  const handleSaveEdit = (itemId: string) => {
    if (!editText.trim()) return
    updateItem(checklist.id, itemId, { text: editText.trim() })
    setEditingId(null)
    setEditText('')
    toast.success('Item actualitzat')
  }

  const handleDeleteChecklist = () => {
    if (confirm(`Eliminar la checklist "${checklist.name}"?`)) {
      deleteChecklist(checklist.id)
      toast.success('Checklist eliminada')
      router.push('/checklists')
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/checklists"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Tornar a checklists
      </Link>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isComplete && (
                <span className="inline-flex items-center gap-1 rounded-full bg-success/20 text-success px-2 py-0.5 text-xs font-medium">
                  <CheckSquare className="h-3 w-3" />
                  Completada
                </span>
              )}
              {checklist.projectName && (
                <span className="inline-flex items-center gap-1 rounded-full bg-accent/20 text-accent px-2 py-0.5 text-xs font-medium">
                  {checklist.projectName}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold">{checklist.name}</h1>
            <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white',
                    getAvatarColor(CURRENT_USER_NAME)
                  )}
                >
                  {getInitials(CURRENT_USER_NAME)}
                </div>
                <span>Creat per Usuari</span>
              </div>
              <span>•</span>
              <span>{formatDate(new Date(checklist.createdAt))}</span>
            </div>
          </div>
          <button
            onClick={handleDeleteChecklist}
            className="rounded-lg p-2 text-destructive hover:bg-destructive/10"
            title="Eliminar checklist"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progres</span>
            <span className="font-medium">
              {itemsCompleted} de {itemsTotal} completats ({progress}%)
            </span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                isComplete ? 'bg-success' : 'bg-primary'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Add new item */}
      <div className="rounded-xl border border-border bg-card p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleAddItem()
            }}
            placeholder="Afegir un nou item..."
            className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
          <button
            onClick={handleAddItem}
            disabled={!newItemText.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Afegir
          </button>
        </div>
      </div>

      {/* Items */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {checklist.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Square className="h-10 w-10 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              Encara no hi ha items. Afegeix el primer!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {checklist.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'flex items-center gap-3 p-4 transition-colors hover:bg-muted/30',
                  item.completed && 'bg-muted/20'
                )}
              >
                <button
                  onClick={() => handleToggle(item.id)}
                  className={cn(
                    'shrink-0 flex h-6 w-6 items-center justify-center rounded border-2 transition-colors',
                    item.completed
                      ? 'bg-success border-success text-white'
                      : 'border-border hover:border-primary'
                  )}
                >
                  {item.completed && <CheckSquare className="h-4 w-4" />}
                </button>

                {editingId === item.id ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(item.id)
                        if (e.key === 'Escape') {
                          setEditingId(null)
                          setEditText('')
                        }
                      }}
                      autoFocus
                      className="flex-1 px-2 py-1 bg-background border border-border rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="rounded p-1.5 text-success hover:bg-success/10"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null)
                        setEditText('')
                      }}
                      className="rounded p-1.5 text-muted-foreground hover:bg-muted"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => {
                      setEditingId(item.id)
                      setEditText(item.text)
                    }}
                    className="flex-1 min-w-0 cursor-pointer"
                  >
                    <p
                      className={cn(
                        'text-sm',
                        item.completed && 'line-through text-muted-foreground'
                      )}
                    >
                      {item.text}
                    </p>
                    {item.completed && item.completedBy && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Completat per {item.completedBy}
                        {item.completedAt && ` · ${formatDate(new Date(item.completedAt))}`}
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="shrink-0 rounded-lg p-1.5 text-destructive opacity-0 hover:bg-destructive/10 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
