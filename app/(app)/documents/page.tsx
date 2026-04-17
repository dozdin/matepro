'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Search,
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  File as FileIcon,
  MoreVertical,
  Download,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn, formatDate, formatFileSize, getInitials, getAvatarColor } from '@/lib/utils'
import { UploadDocumentModal } from '@/components/modals'
import { useAppStore } from '@/lib/store'

const CATEGORY_LABELS: Record<string, string> = {
  plans: 'Plànols',
  contracts: 'Contractes',
  reports: 'Informes',
  photos: 'Fotos',
  videos: 'Videos',
  other: 'Altres',
}

const categoryColors: Record<string, string> = {
  plans: 'bg-blue-500/20 text-blue-500',
  contracts: 'bg-emerald-500/20 text-emerald-500',
  reports: 'bg-violet-500/20 text-violet-500',
  photos: 'bg-pink-500/20 text-pink-500',
  videos: 'bg-orange-500/20 text-orange-500',
  other: 'bg-muted text-muted-foreground',
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith('image/')) return ImageIcon
  if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return FileSpreadsheet
  if (mimeType === 'application/pdf') return FileText
  return FileIcon
}

export default function DocumentsPage() {
  const documents = useAppStore((state) => state.documents)
  const projects = useAppStore((state) => state.projects)
  const addDocument = useAppStore((state) => state.addDocument)
  const deleteDocument = useAppStore((state) => state.deleteDocument)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const q = searchQuery.toLowerCase().trim()
        const matchesSearch =
          !q ||
          doc.name.toLowerCase().includes(q) ||
          doc.description.toLowerCase().includes(q) ||
          (doc.projectName || '').toLowerCase().includes(q)
        const matchesCategory = !selectedCategory || doc.category === selectedCategory
        return matchesSearch && matchesCategory
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [documents, searchQuery, selectedCategory])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    documents.forEach((d) => {
      counts[d.category] = (counts[d.category] || 0) + 1
    })
    return counts
  }, [documents])

  const totalSize = documents.reduce((sum, d) => sum + d.size, 0)

  const handleUpload = (data: {
    name: string
    description: string
    category: string
    projectId: string | null
    file: File
  }) => {
    const project = projects.find((p) => p.id === data.projectId)
    addDocument({
      name: data.name,
      description: data.description,
      category: data.category as 'plans' | 'contracts' | 'reports' | 'photos' | 'videos' | 'other',
      projectId: data.projectId,
      projectName: project?.name || null,
      size: data.file.size,
      mimeType: data.file.type,
      uploadedBy: 'Carlos Martinez',
      tags: [],
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Eliminar el document "${name}"?`)) {
      deleteDocument(id)
      toast.success('Document eliminat')
      setOpenMenuId(null)
    }
  }

  const handleDownload = (name: string) => {
    toast.success(`Descarregant ${name}`)
    setOpenMenuId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-muted-foreground">
            Gestiona tots els documents dels projectes
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" />
          Pujar Document
        </button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Total Documents</p>
          <p className="text-2xl font-bold">{documents.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Planols</p>
          <p className="text-2xl font-bold text-blue-500">{categoryCounts.plans || 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Informes</p>
          <p className="text-2xl font-bold text-violet-500">{categoryCounts.reports || 0}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-sm text-muted-foreground">Espai total</p>
          <p className="text-2xl font-bold">{formatFileSize(totalSize)}</p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cercar documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 w-full rounded-lg border border-input bg-muted/50 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              'shrink-0 rounded-lg border px-3 py-2 text-sm font-medium',
              !selectedCategory
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:text-foreground'
            )}
          >
            Totes
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={cn(
                'shrink-0 rounded-lg border px-3 py-2 text-sm font-medium',
                selectedCategory === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Documents table */}
      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border border-border bg-card">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
            <FileIcon className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">Cap document trobat</h3>
          <p className="text-muted-foreground mb-4">
            {documents.length === 0
              ? 'Encara no hi ha documents. Puja el primer!'
              : 'No hi ha documents que coincideixin amb els filtres'}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Nom</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Categoria</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Projecte</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Pujat per</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden md:table-cell">Mida</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground hidden lg:table-cell">Data</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Accions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredDocuments.map((doc) => {
                  const Icon = getFileIcon(doc.mimeType)
                  return (
                    <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="shrink-0 rounded-lg bg-muted p-2">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">{doc.name}</p>
                            {doc.description && (
                              <p className="text-xs text-muted-foreground truncate">
                                {doc.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span
                          className={cn(
                            'rounded-full px-2 py-1 text-xs font-medium',
                            categoryColors[doc.category]
                          )}
                        >
                          {CATEGORY_LABELS[doc.category]}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        {doc.projectName ? (
                          <span className="text-sm">{doc.projectName}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn(
                              'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium text-white',
                              getAvatarColor(doc.uploadedBy)
                            )}
                          >
                            {getInitials(doc.uploadedBy)}
                          </div>
                          <span className="text-sm truncate max-w-32">{doc.uploadedBy}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {formatFileSize(doc.size)}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(new Date(doc.createdAt))}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === doc.id ? null : doc.id)}
                          className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {openMenuId === doc.id && (
                          <div className="absolute top-10 right-4 z-10 w-40 rounded-lg border border-border bg-card shadow-lg py-1">
                            <button
                              onClick={() => handleDownload(doc.name)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted"
                            >
                              <Download className="h-4 w-4" />
                              Descarregar
                            </button>
                            <button
                              onClick={() => handleDelete(doc.id, doc.name)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-muted"
                            >
                              <Trash2 className="h-4 w-4" />
                              Eliminar
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleUpload}
      />
    </div>
  )
}
