'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ProjectFormData) => void
}

interface ProjectFormData {
  name: string
  code: string
  description: string
  clientName: string
  clientEmail: string
  clientPhone: string
  boatModel: string
  boatYear: number
  priority: 'baixa' | 'normal' | 'alta' | 'critica'
  startDate: string
  estimatedEndDate: string
  budget: number
  managerId: string
}

const managers = [
  { id: 'usr_pm_001', name: 'Jordi García' },
  { id: 'usr_pm_002', name: 'Marta López' },
]

export function CreateProjectModal({ isOpen, onClose, onSubmit }: CreateProjectModalProps) {
  const [formData, setFormData] = useState<Partial<ProjectFormData>>({
    priority: 'normal',
    boatYear: new Date().getFullYear(),
  })
  const [step, setStep] = useState(1)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.code) {
      toast.error('Si us plau, omple els camps obligatoris')
      return
    }
    onSubmit(formData as ProjectFormData)
    toast.success(`Projecte "${formData.name}" creat correctament`)
    onClose()
    setFormData({ priority: 'normal', boatYear: new Date().getFullYear() })
    setStep(1)
  }

  const updateField = (field: keyof ProjectFormData, value: string | number) => {
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
          <div>
            <h2 className="text-xl font-semibold">Nou Projecte</h2>
            <p className="text-sm text-muted-foreground">Pas {step} de 3</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Progress */}
        <div className="flex gap-2 px-6 pt-4">
          {[1, 2, 3].map(s => (
            <div
              key={s}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                s <= step ? 'bg-primary' : 'bg-muted'
              )}
            />
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Project Info */}
          {step === 1 && (
            <div className="p-6 space-y-4">
              <h3 className="font-medium text-lg mb-4">Informació del Projecte</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Nom del projecte *</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="Ex: Restauració Velero 12m"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Codi del projecte *</label>
                  <input
                    type="text"
                    required
                    value={formData.code || ''}
                    onChange={(e) => updateField('code', e.target.value)}
                    placeholder="Ex: PRJ-2024-001"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
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
                
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Descripció</label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Descriu el projecte..."
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Client & Boat */}
          {step === 2 && (
            <div className="p-6 space-y-4">
              <h3 className="font-medium text-lg mb-4">Client i Embarcació</h3>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1.5">Nom del client *</label>
                  <input
                    type="text"
                    required
                    value={formData.clientName || ''}
                    onChange={(e) => updateField('clientName', e.target.value)}
                    placeholder="Ex: Família Martínez"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Email del client</label>
                  <input
                    type="email"
                    value={formData.clientEmail || ''}
                    onChange={(e) => updateField('clientEmail', e.target.value)}
                    placeholder="client@email.com"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Telèfon</label>
                  <input
                    type="tel"
                    value={formData.clientPhone || ''}
                    onChange={(e) => updateField('clientPhone', e.target.value)}
                    placeholder="+34 612 345 678"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Model d&apos;embarcació *</label>
                  <input
                    type="text"
                    required
                    value={formData.boatModel || ''}
                    onChange={(e) => updateField('boatModel', e.target.value)}
                    placeholder="Ex: Velero 12m"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Any de l&apos;embarcació</label>
                  <input
                    type="number"
                    min={1900}
                    max={new Date().getFullYear()}
                    value={formData.boatYear || ''}
                    onChange={(e) => updateField('boatYear', parseInt(e.target.value))}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Planning */}
          {step === 3 && (
            <div className="p-6 space-y-4">
              <h3 className="font-medium text-lg mb-4">Planificació</h3>
              
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
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Data d&apos;entrega estimada *</label>
                  <input
                    type="date"
                    required
                    value={formData.estimatedEndDate || ''}
                    onChange={(e) => updateField('estimatedEndDate', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Pressupost (€) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.budget || ''}
                    onChange={(e) => updateField('budget', parseInt(e.target.value))}
                    placeholder="75000"
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1.5">Cap de Projecte *</label>
                  <select
                    required
                    value={formData.managerId || ''}
                    onChange={(e) => updateField('managerId', e.target.value)}
                    className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  >
                    <option value="">Selecciona...</option>
                    {managers.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border p-6">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors"
            >
              {step > 1 ? 'Anterior' : 'Cancel·lar'}
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Següent
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                Crear Projecte
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
