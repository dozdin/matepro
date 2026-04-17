'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'

interface CreateThreadModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ThreadFormData) => void
}

interface ThreadFormData {
  title: string
  content: string
  categoryId: string
}

const categories = [
  { id: 'general', name: 'General', color: 'bg-blue-500' },
  { id: 'tecnico', name: 'Tècnic', color: 'bg-orange-500' },
  { id: 'proyectos', name: 'Projectes', color: 'bg-green-500' },
  { id: 'materiales', name: 'Materials', color: 'bg-purple-500' },
  { id: 'seguridad', name: 'Seguretat', color: 'bg-red-500' },
  { id: 'off-topic', name: 'Off-Topic', color: 'bg-gray-500' },
]

export function CreateThreadModal({ isOpen, onClose, onSubmit }: CreateThreadModalProps) {
  const [formData, setFormData] = useState<Partial<ThreadFormData>>({
    categoryId: 'general',
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.content) {
      toast.error('Si us plau, omple el titol i el contingut')
      return
    }
    onSubmit(formData as ThreadFormData)
    toast.success('Tema creat correctament')
    onClose()
    setFormData({ categoryId: 'general' })
  }

  const updateField = (field: keyof ThreadFormData, value: string) => {
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
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between border-b border-border bg-card p-6">
          <h2 className="text-xl font-semibold">Nou Tema</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Categoria *</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => updateField('categoryId', cat.id)}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    formData.categoryId === cat.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Títol *</label>
            <input
              type="text"
              required
              value={formData.title || ''}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder="Escriu un títol descriptiu..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1.5">Contingut *</label>
            <textarea
              required
              rows={8}
              value={formData.content || ''}
              onChange={(e) => updateField('content', e.target.value)}
              placeholder="Escriu el contingut del teu tema..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Pots utilitzar Markdown per formatar el text
            </p>
          </div>

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
              Publicar Tema
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
