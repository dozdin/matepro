'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X, Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '@/lib/store'

type CreateChecklistModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    description: string
    projectId: string
    items: string[]
  }) => void
}

export function CreateChecklistModal({ isOpen, onClose, onSubmit }: CreateChecklistModalProps) {
  const projects = useAppStore((state) => state.projects)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [projectId, setProjectId] = useState('')
  const [items, setItems] = useState<string[]>([''])
  const [newItem, setNewItem] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !projectId) {
      toast.error('Si us plau, omple els camps obligatoris')
      return
    }

    const validItems = items.filter(item => item.trim())
    
    onSubmit({
      name: name.trim(),
      description: description.trim(),
      projectId,
      items: validItems,
    })

    toast.success(`Checklist "${name}" creada amb ${validItems.length} items`)

    // Reset form
    setName('')
    setDescription('')
    setProjectId('')
    setItems([''])
    onClose()
  }

  const addItem = () => {
    if (newItem.trim()) {
      setItems(prev => [...prev, newItem.trim()])
      setNewItem('')
    }
  }

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, value: string) => {
    setItems(prev => prev.map((item, i) => i === index ? value : item))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-4">
          <h2 className="text-lg font-semibold">Nova Checklist</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Nom <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Checklist manteniment motor"
              required
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Descripció
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descripció de la checklist..."
              rows={2}
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Projecte <span className="text-destructive">*</span>
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">Selecciona un projecte</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Items */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Elements inicials
            </label>
            <div className="space-y-2">
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => updateItem(index, e.target.value)}
                    placeholder={`Element ${index + 1}`}
                    className="h-9 flex-1 rounded-lg border border-input bg-muted/50 px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addItem()
                    }
                  }}
                  placeholder="Afegir element..."
                  className="h-9 flex-1 rounded-lg border border-dashed border-input bg-transparent px-3 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none"
                />
                <button
                  type="button"
                  onClick={addItem}
                  disabled={!newItem.trim()}
                  className="rounded-lg p-2 text-primary hover:bg-primary/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm font-medium hover:bg-muted transition-colors"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              disabled={!name.trim() || !projectId}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Crear Checklist
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
