'use client'

import { useState } from 'react'
import { Filter, X } from 'lucide-react'
import { PROJECT_STATUS_LABELS, PRIORITY_LABELS } from '@/lib/types'

export function ProjectFilters() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedPriority, setSelectedPriority] = useState<string[]>([])

  const activeFiltersCount = selectedStatus.length + selectedPriority.length

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const togglePriority = (priority: string) => {
    setSelectedPriority((prev) =>
      prev.includes(priority) ? prev.filter((p) => p !== priority) : [...prev, priority]
    )
  }

  const clearFilters = () => {
    setSelectedStatus([])
    setSelectedPriority([])
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
      >
        <Filter className="h-4 w-4" />
        Filtres
        {activeFiltersCount > 0 && (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs text-primary-foreground">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-border bg-popover p-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Filtres</h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Netejar
                </button>
              )}
            </div>

            {/* Status filter */}
            <div className="mb-4">
              <p className="mb-2 text-sm font-medium text-muted-foreground">Estat</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PROJECT_STATUS_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => toggleStatus(key)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedStatus.includes(key)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority filter */}
            <div>
              <p className="mb-2 text-sm font-medium text-muted-foreground">Prioritat</p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(PRIORITY_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => togglePriority(key)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedPriority.includes(key)
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
