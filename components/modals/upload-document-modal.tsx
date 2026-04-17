'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { X, Upload, FileText, Image, File, Trash2 } from 'lucide-react'
import { cn, formatFileSize } from '@/lib/utils'
import { DOCUMENT_CATEGORY_LABELS } from '@/lib/types'
import { useAppStore } from '@/lib/store'

type UploadDocumentModalProps = {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    name: string
    description: string
    category: string
    projectId: string | null
    file: File
  }) => void
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return Image
  return FileText
}

export function UploadDocumentModal({ isOpen, onClose, onSubmit }: UploadDocumentModalProps) {
  const projects = useAppStore((state) => state.projects)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('altre')
  const [projectId, setProjectId] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile || !name.trim()) {
      toast.error('Si us plau, selecciona un fitxer i indica un nom')
      return
    }

    onSubmit({
      name: name.trim(),
      description: description.trim(),
      category,
      projectId: projectId || null,
      file: selectedFile,
    })

    toast.success(`Document "${name}" pujat correctament`)

    // Reset form
    setName('')
    setDescription('')
    setCategory('altre')
    setProjectId('')
    setSelectedFile(null)
    onClose()
  }

  const handleFileSelect = (file: File) => {
    setSelectedFile(file)
    if (!name) {
      setName(file.name.replace(/\.[^/.]+$/, ''))
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  if (!isOpen) return null

  const FileIcon = selectedFile ? getFileIcon(selectedFile.type) : File

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Pujar Document</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* File upload area */}
          {!selectedFile ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 cursor-pointer transition-colors',
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50'
              )}
            >
              <Upload className="h-10 w-10 text-muted-foreground mb-3" />
              <p className="font-medium mb-1">Arrossega un fitxer aquí</p>
              <p className="text-sm text-muted-foreground">
                o fes clic per seleccionar
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileSelect(file)
                }}
              />
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4">
              <div className="rounded-lg bg-primary/20 p-3 text-primary">
                <FileIcon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(selectedFile.size)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-destructive transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Nom del document <span className="text-destructive">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Plànol estructural"
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
              placeholder="Descripció opcional del document..."
              rows={2}
              className="w-full rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Categoria
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            >
              {Object.entries(DOCUMENT_CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Project */}
          <div>
            <label className="block text-sm font-medium mb-1.5">
              Projecte (opcional)
            </label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="h-10 w-full rounded-lg border border-input bg-muted/50 px-3 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            >
              <option value="">General (sense projecte)</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
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
              disabled={!selectedFile || !name.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Pujar Document
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
