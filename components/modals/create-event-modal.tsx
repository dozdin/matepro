'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { X, Trash2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'
import type { CalendarEvent } from '@/lib/store'

export type EventFormType = 'reunio' | 'entrega' | 'revisio' | 'festiu' | 'altre'

const EVENT_TYPE_LABELS: Record<EventFormType, string> = {
  reunio: 'Reunio',
  entrega: 'Entrega',
  revisio: 'Revisio',
  festiu: 'Festiu',
  altre: 'Altre',
}

const STORE_TO_FORM_TYPE: Record<string, EventFormType> = {
  meeting: 'reunio',
  delivery: 'entrega',
  task: 'revisio',
  holiday: 'festiu',
  other: 'altre',
}

const FORM_TO_STORE_TYPE: Record<EventFormType, CalendarEvent['type']> = {
  reunio: 'meeting',
  entrega: 'delivery',
  revisio: 'task',
  festiu: 'holiday',
  altre: 'other',
}

export interface EventFormData {
  title: string
  description: string
  type: EventFormType
  projectId?: string
  location: string
  startDate: string
  startTime: string
  endDate: string
  endTime: string
  allDay: boolean
}

interface CreateEventModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: EventFormData) => void
  selectedDate?: Date
  event?: CalendarEvent | null
  onDelete?: (id: string) => void
}

function formatDateForInput(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function formatTimeForInput(date: Date) {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

export function CreateEventModal({
  isOpen,
  onClose,
  onSubmit,
  selectedDate,
  event,
  onDelete,
}: CreateEventModalProps) {
  const projects = useAppStore((state) => state.projects)
  const isEditing = Boolean(event)

  const buildInitialState = (): Partial<EventFormData> => {
    if (event) {
      const s = new Date(event.startDate)
      const e = new Date(event.endDate || event.startDate)
      return {
        title: event.title,
        description: event.description || '',
        type: STORE_TO_FORM_TYPE[event.type] || 'altre',
        projectId: event.projectId || '',
        location: event.location || '',
        allDay: event.allDay,
        startDate: formatDateForInput(s),
        endDate: formatDateForInput(e),
        startTime: formatTimeForInput(s),
        endTime: formatTimeForInput(e),
      }
    }
    const base = selectedDate ? formatDateForInput(selectedDate) : ''
    return {
      title: '',
      description: '',
      type: 'reunio',
      projectId: '',
      location: '',
      allDay: false,
      startDate: base,
      endDate: base,
      startTime: '09:00',
      endTime: '10:00',
    }
  }

  const [formData, setFormData] = useState<Partial<EventFormData>>(buildInitialState)

  // Reset form whenever modal opens / event / date change
  useEffect(() => {
    if (isOpen) setFormData(buildInitialState())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, event?.id, selectedDate?.toString()])

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title?.trim() || !formData.startDate || !formData.endDate) {
      toast.error('Completa els camps obligatoris')
      return
    }
    // Sanity: end >= start
    const startKey = `${formData.startDate}T${formData.allDay ? '00:00' : formData.startTime}`
    const endKey = `${formData.endDate}T${formData.allDay ? '23:59' : formData.endTime}`
    if (new Date(endKey) < new Date(startKey)) {
      toast.error('La data de fi no pot ser anterior a la data d\u2019inici')
      return
    }
    onSubmit(formData as EventFormData)
    toast.success(
      isEditing
        ? `Esdeveniment "${formData.title}" actualitzat`
        : `Esdeveniment "${formData.title}" creat`,
    )
    onClose()
  }

  const handleDelete = () => {
    if (!event || !onDelete) return
    if (confirm(`Eliminar l\u2019esdeveniment "${event.title}"?`)) {
      onDelete(event.id)
      toast.success('Esdeveniment eliminat')
      onClose()
    }
  }

  const updateField = <K extends keyof EventFormData>(field: K, value: EventFormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [field]: value }
      // If start changes and end is earlier, bump end
      if (field === 'startDate' && next.endDate && next.endDate < (value as string)) {
        next.endDate = value as string
      }
      return next
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <h2 className="text-lg font-semibold">
            {isEditing ? 'Editar esdeveniment' : 'Nou esdeveniment'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tancar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Titol *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ex: Reunio d'equip"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Descripcio</label>
            <textarea
              rows={2}
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Afegeix mes detalls..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Tipus *</label>
              <select
                required
                value={formData.type || 'reunio'}
                onChange={(e) => updateField('type', e.target.value as EventFormType)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {Object.entries(EVENT_TYPE_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Projecte</label>
              <select
                value={formData.projectId || ''}
                onChange={(e) => updateField('projectId', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Cap (general)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Ubicacio</label>
            <input
              type="text"
              value={formData.location || ''}
              onChange={(e) => updateField('location', e.target.value)}
              placeholder="Ex: Sala de reunions, drassana 2..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          <label className="flex items-center gap-2 select-none">
            <input
              type="checkbox"
              checked={formData.allDay || false}
              onChange={(e) => updateField('allDay', e.target.checked)}
              className="h-4 w-4 rounded border-input bg-background"
            />
            <span className="text-sm font-medium">Tot el dia</span>
          </label>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Data d&apos;inici *</label>
              <input
                type="date"
                required
                value={formData.startDate || ''}
                onChange={(e) => updateField('startDate', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            {!formData.allDay && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Hora d&apos;inici</label>
                <input
                  type="time"
                  value={formData.startTime || '09:00'}
                  onChange={(e) => updateField('startTime', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Data de fi *</label>
              <input
                type="date"
                required
                value={formData.endDate || ''}
                onChange={(e) => updateField('endDate', e.target.value)}
                min={formData.startDate}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            {!formData.allDay && (
              <div>
                <label className="block text-sm font-medium mb-1.5">Hora de fi</label>
                <input
                  type="time"
                  value={formData.endTime || '10:00'}
                  onChange={(e) => updateField('endTime', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-border">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
              >
                Cancel&middot;lar
              </button>
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                {isEditing ? 'Guardar canvis' : 'Crear esdeveniment'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export { FORM_TO_STORE_TYPE }
