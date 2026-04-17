'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { AIEstimateButton } from './ai-estimate-button'
import { useAppStore } from '@/lib/store'

interface CreateTaskModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TaskFormData) => void
  projectId?: string
}

interface TaskFormData {
  title: string
  description: string
  projectId: string
  priority: 'baixa' | 'normal' | 'alta' | 'critica'
  assigneeId: string
  dueDate: string
  estimatedHours: number
}

export function CreateTaskModal({ isOpen, onClose, onSubmit, projectId }: CreateTaskModalProps) {
  const projects = useAppStore((state) => state.projects)
  const users = useAppStore((state) => state.users)
  const [formData, setFormData] = useState<Partial<TaskFormData>>({
    priority: 'normal',
    projectId: projectId || '',
    estimatedHours: 8,
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.projectId) {
      toast.error('Si us plau, omple els camps obligatoris')
      return
    }
    onSubmit(formData as TaskFormData)
    toast.success(`Tasca "${formData.title}" creada correctament`)
    onClose()
    setFormData({ priority: 'normal', projectId: projectId || '', estimatedHours: 8 })
  }

  const updateField = (field: keyof TaskFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Nova Tasca</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Títol de la tasca *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Ex: Reparació del casc"
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Descripció</label>
            <textarea
              rows={3}
              value={formData.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder="Descriu la tasca..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Projecte *</label>
            <select
              required
              value={formData.projectId || ''}
              onChange={(e) => updateField('projectId', e.target.value)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Selecciona un projecte...</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Prioritat *</label>
              <select
                required
                value={formData.priority || 'normal'}
                onChange={(e) => updateField('priority', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="baixa">Baixa</option>
                <option value="normal">Normal</option>
                <option value="alta">Alta</option>
                <option value="critica">Crítica</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1.5">Assignar a *</label>
              <select
                required
                value={formData.assigneeId || ''}
                onChange={(e) => updateField('assigneeId', e.target.value)}
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="">Selecciona...</option>
                {users
                  .filter((u) => u.status === 'active')
                  .map((u) => (
                    <option key={u.id} value={u.id}>{u.name} ({u.roleLabel})</option>
                  ))}
              </select>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium mb-1.5">Data límit *</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={formData.dueDate || ''}
                  onChange={(e) => updateField('dueDate', e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1.5">Hores estimades</label>
              <input
                type="number"
                min={1}
                value={formData.estimatedHours || ''}
                onChange={(e) => updateField('estimatedHours', parseInt(e.target.value))}
                placeholder="8"
                className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          <AIEstimateButton
            title={formData.title || ''}
            description={formData.description || ''}
            priority={formData.priority || 'normal'}
            onEstimate={(hours) => updateField('estimatedHours', hours)}
          />

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Crear Tasca
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
