"use client"

import { useEffect } from "react"
import {
  X,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  FolderKanban,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { CalendarEvent } from "@/lib/store"

type EventType = CalendarEvent["type"]

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meeting: "Reunio",
  delivery: "Entrega",
  task: "Tasca",
  holiday: "Festiu",
  other: "Altre",
}

const EVENT_TYPE_STYLES: Record<EventType, { dot: string; text: string; bg: string; border: string }> = {
  meeting: {
    dot: "bg-primary",
    text: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
  },
  delivery: {
    dot: "bg-[color:var(--chart-3)]",
    text: "text-[color:var(--chart-3)]",
    bg: "bg-[color:var(--chart-3)]/10",
    border: "border-[color:var(--chart-3)]/30",
  },
  task: {
    dot: "bg-accent",
    text: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/30",
  },
  holiday: {
    dot: "bg-destructive",
    text: "text-destructive",
    bg: "bg-destructive/10",
    border: "border-destructive/30",
  },
  other: {
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    bg: "bg-muted",
    border: "border-border",
  },
}

function formatDateLong(d: Date) {
  return d.toLocaleDateString("ca-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function formatTime(d: Date) {
  return d.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" })
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

interface EventDetailModalProps {
  isOpen: boolean
  event: CalendarEvent | null
  projectName?: string | null
  onClose: () => void
  onEdit: () => void
  onDelete: () => void
}

export function EventDetailModal({
  isOpen,
  event,
  projectName,
  onClose,
  onEdit,
  onDelete,
}: EventDetailModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [isOpen, onClose])

  if (!isOpen || !event) return null

  const start = new Date(event.startDate)
  const end = new Date(event.endDate || event.startDate)
  const style = EVENT_TYPE_STYLES[event.type]
  const typeLabel = EVENT_TYPE_LABELS[event.type]
  const multiDay = !sameDay(start, end)

  const handleConfirmDelete = () => {
    if (window.confirm("Segur que vols eliminar aquest esdeveniment?")) {
      onDelete()
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in-0"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-detail-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Colored header strip */}
        <div className={cn("h-1.5 w-full", style.dot)} />

        {/* Header */}
        <div className="flex items-start gap-3 px-6 pt-5 pb-4">
          <div className={cn("mt-1 h-3 w-3 rounded-full flex-shrink-0", style.dot)} aria-hidden />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={cn(
                  "inline-flex items-center text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                  style.bg,
                  style.text,
                  style.border,
                )}
              >
                {typeLabel}
              </span>
              {event.allDay && (
                <span className="text-[11px] font-medium text-muted-foreground border border-border rounded-full px-2 py-0.5">
                  Tot el dia
                </span>
              )}
            </div>
            <h2
              id="event-detail-title"
              className="text-xl font-semibold text-foreground leading-tight text-balance"
            >
              {event.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="flex-shrink-0 rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Tancar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 pb-4 space-y-3">
          {/* Date / Time */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm">
              <div className="font-medium text-foreground capitalize">
                {formatDateLong(start)}
              </div>
              {multiDay && (
                <div className="text-muted-foreground mt-0.5 capitalize">
                  fins a {formatDateLong(end)}
                </div>
              )}
              {!event.allDay && (
                <div className="flex items-center gap-1.5 text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span className="tabular-nums">
                    {formatTime(start)} - {formatTime(end)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="text-sm text-foreground">{event.location}</span>
            </div>
          )}

          {/* Project */}
          {event.projectId && (
            <Link
              href={`/projects/${event.projectId}`}
              onClick={onClose}
              className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <FolderKanban className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 text-sm text-foreground">
                {projectName || "Projecte"}
              </span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          )}

          {/* Description */}
          {event.description && (
            <div className="pt-1">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                Descripcio
              </div>
              <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                {event.description}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-2 border-t border-border px-6 py-3 bg-muted/30">
          <button
            onClick={handleConfirmDelete}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Eliminar
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              Tancar
            </button>
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
