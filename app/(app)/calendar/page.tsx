"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Search,
} from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAppStore } from "@/lib/store"
import type { CalendarEvent } from "@/lib/store"
import { CreateEventModal, FORM_TO_STORE_TYPE } from "@/components/modals/create-event-modal"
import type { EventFormData } from "@/components/modals/create-event-modal"
import { EventDetailModal } from "@/components/modals/event-detail-modal"

const DAYS_SHORT = ["Dl", "Dt", "Dc", "Dj", "Dv", "Ds", "Dg"]
const DAYS_LONG = ["Dilluns", "Dimarts", "Dimecres", "Dijous", "Divendres", "Dissabte", "Diumenge"]
const MONTHS = [
  "Gener", "Febrer", "Marc", "Abril", "Maig", "Juny",
  "Juliol", "Agost", "Setembre", "Octubre", "Novembre", "Desembre",
]

type ViewMode = "month" | "week" | "day"
type EventType = CalendarEvent["type"]

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meeting: "Reunio",
  delivery: "Entrega",
  task: "Tasca",
  holiday: "Festiu",
  other: "Altre",
}

const EVENT_TYPE_STYLES: Record<EventType, { bg: string; dot: string; text: string; border: string; solid: string }> = {
  meeting: {
    bg: "bg-primary/15 hover:bg-primary/25",
    dot: "bg-primary",
    text: "text-primary",
    border: "border-l-primary",
    solid: "bg-primary",
  },
  delivery: {
    bg: "bg-[color:var(--chart-3)]/15 hover:bg-[color:var(--chart-3)]/25",
    dot: "bg-[color:var(--chart-3)]",
    text: "text-[color:var(--chart-3)]",
    border: "border-l-[color:var(--chart-3)]",
    solid: "bg-[color:var(--chart-3)]",
  },
  task: {
    bg: "bg-accent/15 hover:bg-accent/25",
    dot: "bg-accent",
    text: "text-accent",
    border: "border-l-accent",
    solid: "bg-accent",
  },
  holiday: {
    bg: "bg-destructive/15 hover:bg-destructive/25",
    dot: "bg-destructive",
    text: "text-destructive",
    border: "border-l-destructive",
    solid: "bg-destructive",
  },
  other: {
    bg: "bg-muted hover:bg-muted/80",
    dot: "bg-muted-foreground",
    text: "text-muted-foreground",
    border: "border-l-muted-foreground",
    solid: "bg-muted-foreground",
  },
}

interface CalendarItem {
  id: string
  sourceId: string
  title: string
  start: Date
  end: Date
  type: EventType
  allDay: boolean
  isTask: boolean
  taskId?: string
  description: string
  projectId?: string | null
  location?: string
}

// ---------------- date helpers ----------------
function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
function addDays(d: Date, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function getMondayOf(d: Date) {
  const x = startOfDay(d)
  const day = (x.getDay() + 6) % 7
  return addDays(x, -day)
}
function formatISODate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}
function formatTime(d: Date) {
  return d.toLocaleTimeString("ca-ES", { hour: "2-digit", minute: "2-digit" })
}

// ---------------- page ----------------
export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<ViewMode>("month")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null)
  const [viewingEvent, setViewingEvent] = useState<CalendarEvent | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [dragOverDate, setDragOverDate] = useState<string | null>(null)
  const [draggedId, setDraggedId] = useState<string | null>(null)

  const events = useAppStore((state) => state.events)
  const tasks = useAppStore((state) => state.tasks)
  const projects = useAppStore((state) => state.projects)
  const addEvent = useAppStore((state) => state.addEvent)
  const updateEvent = useAppStore((state) => state.updateEvent)
  const deleteEvent = useAppStore((state) => state.deleteEvent)

  // Normalize events + tasks
  const calendarItems = useMemo<CalendarItem[]>(() => {
    const q = searchQuery.trim().toLowerCase()
    const evItems: CalendarItem[] = events.map((e) => ({
      id: e.id,
      sourceId: e.id,
      title: e.title,
      start: new Date(e.startDate),
      end: new Date(e.endDate || e.startDate),
      type: e.type,
      allDay: Boolean(e.allDay),
      isTask: false,
      description: e.description || "",
      projectId: e.projectId,
      location: e.location,
    }))
    const taskItems: CalendarItem[] = tasks
      .filter((t) => t.dueDate)
      .map((t) => {
        const d = new Date(t.dueDate!)
        return {
          id: `task_${t.id}`,
          sourceId: t.id,
          title: t.title,
          start: d,
          end: d,
          type: "task" as const,
          allDay: true,
          isTask: true,
          taskId: t.id,
          description: t.description || "",
          projectId: t.projectId,
        }
      })
    const all = [...evItems, ...taskItems]
    if (!q) return all
    return all.filter((i) => i.title.toLowerCase().includes(q) || i.description.toLowerCase().includes(q))
  }, [events, tasks, searchQuery])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const today = new Date()

  // ---------------- navigation ----------------
  const goPrev = () => {
    if (view === "month") setCurrentDate(new Date(year, month - 1, 1))
    else if (view === "week") setCurrentDate(addDays(currentDate, -7))
    else setCurrentDate(addDays(currentDate, -1))
  }
  const goNext = () => {
    if (view === "month") setCurrentDate(new Date(year, month + 1, 1))
    else if (view === "week") setCurrentDate(addDays(currentDate, 7))
    else setCurrentDate(addDays(currentDate, 1))
  }
  const goToday = () => setCurrentDate(new Date())

  // ---------------- CRUD ----------------
  const openCreate = (date?: Date) => {
    setEditingEvent(null)
    setSelectedDate(date ?? new Date())
    setIsModalOpen(true)
  }

  const openDetail = (item: CalendarItem) => {
    if (item.isTask) return // tasks open in tasks page, handled separately
    const ev = events.find((e) => e.id === item.sourceId)
    if (ev) setViewingEvent(ev)
  }

  const openEditFromDetail = () => {
    if (!viewingEvent) return
    setEditingEvent(viewingEvent)
    setViewingEvent(null)
    setSelectedDate(null)
    setIsModalOpen(true)
  }

  const deleteFromDetail = () => {
    if (!viewingEvent) return
    deleteEvent(viewingEvent.id)
    toast.success("Esdeveniment eliminat")
    setViewingEvent(null)
  }

  const handleSubmit = (data: EventFormData) => {
    const startDate = data.allDay
      ? `${data.startDate}T00:00:00`
      : `${data.startDate}T${data.startTime}:00`
    const endDate = data.allDay
      ? `${data.endDate}T23:59:59`
      : `${data.endDate}T${data.endTime}:00`

    const payload = {
      title: data.title,
      description: data.description,
      type: FORM_TO_STORE_TYPE[data.type],
      startDate,
      endDate,
      allDay: data.allDay,
      location: data.location,
      projectId: data.projectId || null,
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, payload)
    } else {
      addEvent(payload)
    }
  }

  const handleDelete = (id: string) => {
    deleteEvent(id)
  }

  // ---------------- drag & drop (month view only) ----------------
  const onDragStart = (e: React.DragEvent, item: CalendarItem) => {
    if (item.isTask) {
      e.preventDefault()
      return
    }
    setDraggedId(item.id)
    e.dataTransfer.setData("text/plain", item.id)
    e.dataTransfer.effectAllowed = "move"
  }
  const onDragOverDay = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDragOverDate(formatISODate(date))
  }
  const onDropDay = (e: React.DragEvent, date: Date) => {
    e.preventDefault()
    const id = e.dataTransfer.getData("text/plain") || draggedId
    setDragOverDate(null)
    setDraggedId(null)
    if (!id) return
    const ev = events.find((x) => x.id === id)
    if (!ev) return
    const oldStart = new Date(ev.startDate)
    const oldEnd = new Date(ev.endDate || ev.startDate)
    const delta = startOfDay(date).getTime() - startOfDay(oldStart).getTime()
    const newStart = new Date(oldStart.getTime() + delta)
    const newEnd = new Date(oldEnd.getTime() + delta)
    updateEvent(id, {
      startDate: newStart.toISOString(),
      endDate: newEnd.toISOString(),
    })
    toast.success(`"${ev.title}" mogut al ${date.toLocaleDateString("ca-ES", { day: "numeric", month: "short" })}`)
  }

  // ---------------- stats & upcoming ----------------
  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return calendarItems
      .filter((i) => i.end >= now)
      .sort((a, b) => a.start.getTime() - b.start.getTime())
      .slice(0, 6)
  }, [calendarItems])

  const monthStats = useMemo(() => {
    const monthStart = new Date(year, month, 1)
    const monthEnd = new Date(year, month + 1, 0, 23, 59, 59)
    const inMonth = calendarItems.filter((i) => i.end >= monthStart && i.start <= monthEnd)
    const byType: Record<string, number> = {}
    inMonth.forEach((i) => {
      byType[i.type] = (byType[i.type] || 0) + 1
    })
    return { total: inMonth.length, byType }
  }, [calendarItems, year, month])

  // ---------------- header title per view ----------------
  const headerTitle = useMemo(() => {
    if (view === "month") return `${MONTHS[month]} ${year}`
    if (view === "day") {
      return `${currentDate.getDate()} ${MONTHS[currentDate.getMonth()]} ${currentDate.getFullYear()}`
    }
    const weekStart = getMondayOf(currentDate)
    const weekEnd = addDays(weekStart, 6)
    const sameMonth = weekStart.getMonth() === weekEnd.getMonth()
    if (sameMonth) {
      return `${weekStart.getDate()} - ${weekEnd.getDate()} ${MONTHS[weekStart.getMonth()]} ${weekStart.getFullYear()}`
    }
    return `${weekStart.getDate()} ${MONTHS[weekStart.getMonth()]} - ${weekEnd.getDate()} ${MONTHS[weekEnd.getMonth()]}`
  }, [view, month, year, currentDate])

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground tracking-tight">Calendari</h1>
            <p className="text-sm text-muted-foreground">
              {monthStats.total} {monthStats.total === 1 ? "esdeveniment" : "esdeveniments"} aquest mes
            </p>
          </div>
        </div>
        <button
          onClick={() => openCreate(new Date())}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nou esdeveniment
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1">
          <button onClick={goPrev} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Anterior">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <h2 className="text-base font-semibold min-w-[220px] text-center tabular-nums">{headerTitle}</h2>
          <button onClick={goNext} className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Seguent">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button onClick={goToday} className="ml-2 rounded-lg border border-border px-3 py-1 text-xs font-medium hover:bg-muted">
            Avui
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cercar..."
              className="h-8 w-40 rounded-lg border border-input bg-background pl-8 pr-2 text-xs focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-muted p-0.5">
            {(["month", "week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {v === "month" ? "Mes" : v === "week" ? "Setmana" : "Dia"}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_280px]">
        {/* Calendar view */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          {view === "month" && (
            <MonthView
              baseDate={currentDate}
              items={calendarItems}
              today={today}
              selectedDate={selectedDate}
              dragOverDate={dragOverDate}
              draggedId={draggedId}
              onDayClick={(d) => openCreate(d)}
                onEventClick={openDetail}
              onDragStart={onDragStart}
              onDragOverDay={onDragOverDay}
              onDragLeaveDay={() => setDragOverDate(null)}
              onDropDay={onDropDay}
            />
          )}
          {view === "week" && (
            <TimeGridView
              days={Array.from({ length: 7 }, (_, i) => addDays(getMondayOf(currentDate), i))}
              items={calendarItems}
              today={today}
              onSlotClick={(d) => openCreate(d)}
                onEventClick={openDetail}
            />
          )}
          {view === "day" && (
            <TimeGridView
              days={[startOfDay(currentDate)]}
              items={calendarItems}
              today={today}
              onSlotClick={(d) => openCreate(d)}
                onEventClick={openDetail}
            />
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
            <MiniMonth
              baseDate={currentDate}
              items={calendarItems}
              onPick={(d) => {
                setCurrentDate(d)
                if (view === "month") setSelectedDate(d)
              }}
            />
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-sm">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Proxims esdeveniments
            </h3>
            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-muted-foreground py-3 text-center">
                No hi ha esdeveniments proxims
              </p>
            ) : (
              <div className="space-y-1.5">
                {upcomingEvents.map((event) => {
                  const styles = EVENT_TYPE_STYLES[event.type]
                  const project = projects.find((p) => p.id === event.projectId)
                  const isMultiDay = !sameDay(event.start, event.end)
                  return (
                    <div
                      key={event.id}
                      className="group relative flex items-start gap-2.5 p-2 rounded-lg border border-transparent transition-colors hover:bg-muted/50 hover:border-border cursor-pointer"
                      onClick={() => (event.isTask ? null : openDetail(event))}
                    >
                      <div className={cn("h-full w-1 rounded-full self-stretch shrink-0", styles.solid)} />
                      <div className="flex-1 min-w-0">
                        {event.isTask ? (
                          <Link href={`/tasks/${event.taskId}`} className="text-xs font-semibold hover:text-primary block leading-tight truncate">
                            {event.title}
                          </Link>
                        ) : (
                          <p className="text-xs font-semibold leading-tight truncate">{event.title}</p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                          <Clock className="h-3 w-3 shrink-0" />
                          <span className="tabular-nums">
                            {event.start.toLocaleDateString("ca-ES", { day: "numeric", month: "short" })}
                            {!event.allDay && <>, {formatTime(event.start)}</>}
                            {isMultiDay && <> - {event.end.toLocaleDateString("ca-ES", { day: "numeric", month: "short" })}</>}
                          </span>
                        </div>
                        {project && (
                          <div className="flex items-center gap-1 mt-0.5 text-[10px] text-muted-foreground">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate">{project.name}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
            <h3 className="font-semibold mb-3 text-sm">Resum del mes</h3>
            <div className="space-y-1.5">
              {(Object.keys(EVENT_TYPE_LABELS) as EventType[]).map((key) => {
                const count = monthStats.byType[key] || 0
                const styles = EVENT_TYPE_STYLES[key]
                return (
                  <div key={key} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-2.5 w-2.5 rounded-sm", styles.solid)} />
                      <span className="text-foreground">{EVENT_TYPE_LABELS[key]}</span>
                    </div>
                    <span className="text-muted-foreground tabular-nums font-medium">{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedDate(null)
          setEditingEvent(null)
        }}
        onSubmit={handleSubmit}
        selectedDate={selectedDate || undefined}
        event={editingEvent}
        onDelete={handleDelete}
      />

      <EventDetailModal
        isOpen={Boolean(viewingEvent)}
        event={viewingEvent}
        projectName={
          viewingEvent?.projectId
            ? projects.find((p) => p.id === viewingEvent.projectId)?.name ?? null
            : null
        }
        onClose={() => setViewingEvent(null)}
        onEdit={openEditFromDetail}
        onDelete={deleteFromDetail}
      />
    </div>
  )
}

// ---------------- Month view ----------------
interface MonthViewProps {
  baseDate: Date
  items: CalendarItem[]
  today: Date
  selectedDate: Date | null
  dragOverDate: string | null
  draggedId: string | null
  onDayClick: (d: Date) => void
  onEventClick: (item: CalendarItem) => void
  onDragStart: (e: React.DragEvent, item: CalendarItem) => void
  onDragOverDay: (e: React.DragEvent, date: Date) => void
  onDragLeaveDay: () => void
  onDropDay: (e: React.DragEvent, date: Date) => void
}

function MonthView({
  baseDate,
  items,
  today,
  selectedDate,
  dragOverDate,
  draggedId,
  onDayClick,
  onEventClick,
  onDragStart,
  onDragOverDay,
  onDragLeaveDay,
  onDropDay,
}: MonthViewProps) {
  const year = baseDate.getFullYear()
  const month = baseDate.getMonth()
  const gridStart = getMondayOf(new Date(year, month, 1))
  const weeks = useMemo(() => {
    const result: Date[][] = []
    for (let w = 0; w < 6; w++) {
      const row: Date[] = []
      for (let d = 0; d < 7; d++) row.push(addDays(gridStart, w * 7 + d))
      result.push(row)
    }
    return result
  }, [gridStart])

  type Lane = { item: CalendarItem; startCol: number; endCol: number; startsBefore: boolean; endsAfter: boolean }
  const weekLanes = useMemo(() => {
    const result: Lane[][][] = []
    for (const week of weeks) {
      const weekStart = week[0]
      const weekEnd = addDays(week[6], 1)
      const laneGrid: (string | null)[][] = []
      const lanes: Lane[] = []
      const inWeek = items.filter((it) => {
        const s = startOfDay(it.start)
        const e = startOfDay(it.end)
        return e >= weekStart && s < weekEnd
      })
      inWeek.sort((a, b) => {
        const da = a.end.getTime() - a.start.getTime()
        const db = b.end.getTime() - b.start.getTime()
        if (db !== da) return db - da
        return a.start.getTime() - b.start.getTime()
      })
      for (const it of inWeek) {
        const s = startOfDay(it.start)
        const e = startOfDay(it.end)
        const startCol = Math.max(0, Math.round((s.getTime() - weekStart.getTime()) / 86400000))
        const endCol = Math.min(6, Math.round((e.getTime() - weekStart.getTime()) / 86400000))
        const startsBefore = s < weekStart
        const endsAfter = e >= weekEnd
        let laneIdx = 0
        while (true) {
          if (!laneGrid[laneIdx]) laneGrid[laneIdx] = Array(7).fill(null)
          let free = true
          for (let c = startCol; c <= endCol; c++) {
            if (laneGrid[laneIdx][c] !== null) {
              free = false
              break
            }
          }
          if (free) {
            for (let c = startCol; c <= endCol; c++) laneGrid[laneIdx][c] = it.id
            break
          }
          laneIdx++
        }
        lanes.push({ item: it, startCol, endCol, startsBefore, endsAfter })
      }
      const perWeek: Lane[][] = []
      laneGrid.forEach((row, idx) => {
        const seen = new Set<string>()
        perWeek[idx] = []
        for (let c = 0; c < 7; c++) {
          const id = row[c]
          if (!id || seen.has(id)) continue
          seen.add(id)
          const lane = lanes.find((l) => l.item.id === id && l.startCol <= c && l.endCol >= c)
          if (lane) perWeek[idx].push(lane)
        }
      })
      result.push(perWeek)
    }
    return result
  }, [weeks, items])

  return (
    <>
      <div className="grid grid-cols-7 border-b border-border bg-muted/50">
        {DAYS_SHORT.map((day, i) => (
          <div
            key={day}
            className={cn(
              "px-2 py-2.5 text-center text-[11px] font-semibold uppercase tracking-wider",
              i >= 5 ? "text-muted-foreground/70" : "text-muted-foreground",
            )}
            title={DAYS_LONG[i]}
          >
            {day}
          </div>
        ))}
      </div>
      <div className="divide-y divide-border">
        {weeks.map((week, wi) => {
          const lanesForWeek = weekLanes[wi] || []
          const maxShown = 3
          const hasOverflow = lanesForWeek.length > maxShown
          return (
            <div key={wi} className="relative">
              <div className="grid grid-cols-7 min-h-[120px]">
                {week.map((d, di) => {
                  const isCurrentMonth = d.getMonth() === month
                  const isWeekend = di >= 5
                  const isTodayCell = sameDay(d, today)
                  const isSelected = selectedDate && sameDay(d, selectedDate)
                  const iso = formatISODate(d)
                  const isDropTarget = dragOverDate === iso
                  const overflowCount = hasOverflow
                    ? lanesForWeek.slice(maxShown).filter((row) => row.some((l) => l.startCol <= di && l.endCol >= di)).length
                    : 0
                  return (
                    <div
                      key={di}
                      onDragOver={(e) => onDragOverDay(e, d)}
                      onDragLeave={onDragLeaveDay}
                      onDrop={(e) => onDropDay(e, d)}
                      className={cn(
                        "group relative border-r border-border last:border-r-0 transition-colors",
                        !isCurrentMonth && "bg-muted/30",
                        isCurrentMonth && isWeekend && "bg-muted/20",
                        isSelected && "bg-accent/10",
                        isDropTarget && "bg-primary/10 ring-1 ring-inset ring-primary/40",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => onDayClick(d)}
                        className="flex w-full items-start justify-between p-1.5 text-left hover:bg-accent/5 transition-colors"
                        aria-label={`${d.getDate()} ${MONTHS[d.getMonth()]}`}
                      >
                        <div
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full text-sm tabular-nums transition-colors",
                            isTodayCell && "bg-primary text-primary-foreground font-bold shadow-sm",
                            !isTodayCell && isCurrentMonth && "font-semibold text-foreground",
                            !isCurrentMonth && "font-normal text-muted-foreground/50",
                          )}
                        >
                          {d.getDate()}
                        </div>
                        {overflowCount > 0 && (
                          <span className="text-[10px] font-medium text-muted-foreground px-1 py-0.5 rounded-full bg-muted">
                            +{overflowCount}
                          </span>
                        )}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Lane overlay */}
              <div className="pointer-events-none absolute inset-0 grid grid-cols-7 pt-9">
                {lanesForWeek.slice(0, maxShown).map((laneRow, li) => (
                  <div key={li} className="col-span-7 grid grid-cols-7 relative" style={{ marginTop: li === 0 ? 0 : "2px" }}>
                    {laneRow.map((lane) => {
                      const styles = EVENT_TYPE_STYLES[lane.item.type]
                      const spans = lane.endCol - lane.startCol + 1
                      const isDragging = draggedId === lane.item.id
                      return (
                        <div
                          key={lane.item.id}
                          draggable={!lane.item.isTask}
                          onDragStart={(e) => onDragStart(e, lane.item)}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (lane.item.isTask && lane.item.taskId) {
                              window.location.href = `/tasks/${lane.item.taskId}`
                            } else {
                              onEventClick(lane.item)
                            }
                          }}
                          title={lane.item.title}
                          className={cn(
                            "pointer-events-auto h-5 text-[11px] font-medium truncate flex items-center gap-1 px-1.5 mx-0.5 cursor-pointer transition-all border-l-2",
                            styles.bg,
                            styles.text,
                            styles.border,
                            lane.startsBefore && "rounded-l-none border-l-0 pl-0.5",
                            !lane.startsBefore && "rounded-l-md",
                            lane.endsAfter && "rounded-r-none",
                            !lane.endsAfter && "rounded-r-md",
                            isDragging && "opacity-40",
                          )}
                          style={{ gridColumn: `${lane.startCol + 1} / span ${spans}` }}
                        >
                          {lane.startsBefore && <span className="text-[10px] opacity-60 shrink-0">&laquo;</span>}
                          {!lane.item.allDay && !lane.startsBefore && (
                            <span className="text-[10px] tabular-nums opacity-70 shrink-0">{formatTime(lane.item.start)}</span>
                          )}
                          <span className="truncate">{lane.item.title}</span>
                          {lane.endsAfter && <span className="text-[10px] opacity-60 ml-auto shrink-0">&raquo;</span>}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ---------------- Time grid (Week + Day) ----------------
const HOURS = Array.from({ length: 24 }, (_, i) => i)
const SLOT_HEIGHT = 48 // px per hour
const START_HOUR = 0
const END_HOUR = 24
const VISIBLE_HOURS = END_HOUR - START_HOUR

interface TimeGridViewProps {
  days: Date[]
  items: CalendarItem[]
  today: Date
  onSlotClick: (d: Date) => void
  onEventClick: (item: CalendarItem) => void
}

function TimeGridView({ days, items, today, onSlotClick, onEventClick }: TimeGridViewProps) {
  const isDay = days.length === 1

  // All-day bars per day
  const allDayByDay = useMemo(() => {
    return days.map((d) => {
      const sod = startOfDay(d)
      const eod = addDays(sod, 1)
      return items.filter((it) => {
        if (!it.allDay && !(it.end.getTime() - it.start.getTime() >= 86400000)) return false
        return startOfDay(it.start) < eod && startOfDay(it.end) >= sod
      })
    })
  }, [days, items])

  // Timed events per day
  const timedByDay = useMemo(() => {
    return days.map((d) => {
      const sod = startOfDay(d)
      const eod = addDays(sod, 1)
      return items
        .filter((it) => !it.allDay && it.start < eod && it.end > sod)
        .sort((a, b) => a.start.getTime() - b.start.getTime())
    })
  }, [days, items])

  // Current time indicator
  const now = new Date()
  const nowMinutes = now.getHours() * 60 + now.getMinutes()
  const nowTop = ((nowMinutes - START_HOUR * 60) / 60) * SLOT_HEIGHT

  return (
    <div className="flex flex-col">
      {/* Day headers */}
      <div className="grid border-b border-border bg-muted/50" style={{ gridTemplateColumns: `64px repeat(${days.length}, 1fr)` }}>
        <div className="border-r border-border" />
        {days.map((d, i) => {
          const isTodayCell = sameDay(d, today)
          return (
            <div
              key={i}
              className={cn(
                "flex flex-col items-center justify-center py-2 border-r border-border last:border-r-0",
                isTodayCell && "bg-primary/5",
              )}
            >
              <span className={cn("text-[11px] font-semibold uppercase tracking-wider", isTodayCell ? "text-primary" : "text-muted-foreground")}>
                {DAYS_SHORT[(d.getDay() + 6) % 7]}
              </span>
              <span className={cn("mt-0.5 flex h-7 items-center justify-center rounded-full px-2 text-sm tabular-nums", isTodayCell ? "bg-primary text-primary-foreground font-bold" : "text-foreground font-semibold")}>
                {d.getDate()} {isDay && MONTHS[d.getMonth()]}
              </span>
            </div>
          )
        })}
      </div>

      {/* All-day bar */}
      {allDayByDay.some((a) => a.length > 0) && (
        <div className="grid border-b border-border" style={{ gridTemplateColumns: `64px repeat(${days.length}, 1fr)` }}>
          <div className="border-r border-border flex items-center justify-end pr-2 py-1">
            <span className="text-[10px] uppercase text-muted-foreground tracking-wider">Tot dia</span>
          </div>
          {allDayByDay.map((dayEvents, di) => (
            <div key={di} className="border-r border-border last:border-r-0 p-1 space-y-1 min-h-[36px]">
              {dayEvents.slice(0, 3).map((it) => {
                const styles = EVENT_TYPE_STYLES[it.type]
                return (
                  <button
                    key={it.id}
                    onClick={() => (it.isTask && it.taskId ? (window.location.href = `/tasks/${it.taskId}`) : onEventClick(it))}
                    className={cn(
                      "w-full text-left rounded-md border-l-2 px-1.5 py-0.5 text-[11px] font-medium truncate",
                      styles.bg,
                      styles.text,
                      styles.border,
                    )}
                    title={it.title}
                  >
                    {it.title}
                  </button>
                )
              })}
              {dayEvents.length > 3 && (
                <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} mes</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Scrollable time grid */}
      <div className="relative overflow-y-auto max-h-[640px]">
        <div className="grid" style={{ gridTemplateColumns: `64px repeat(${days.length}, 1fr)` }}>
          {/* Hour column */}
          <div className="border-r border-border">
            {HOURS.slice(START_HOUR, END_HOUR).map((h) => (
              <div key={h} className="relative" style={{ height: SLOT_HEIGHT }}>
                <span className="absolute right-2 top-0 -translate-y-1/2 text-[10px] text-muted-foreground tabular-nums bg-card px-1">
                  {h === 0 ? "" : `${String(h).padStart(2, "0")}:00`}
                </span>
              </div>
            ))}
          </div>

          {/* Day columns */}
          {days.map((d, di) => {
            const isTodayCell = sameDay(d, today)
            const timed = timedByDay[di]
            // Overlap layout: simple column-based
            const layouts = layoutTimedEvents(timed)
            return (
              <div key={di} className={cn("relative border-r border-border last:border-r-0", isTodayCell && "bg-primary/5")}>
                {/* Hour slots (clickable) */}
                {HOURS.slice(START_HOUR, END_HOUR).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => {
                      const slot = new Date(d)
                      slot.setHours(h, 0, 0, 0)
                      onSlotClick(slot)
                    }}
                    className="block w-full border-b border-border/60 hover:bg-accent/5 transition-colors"
                    style={{ height: SLOT_HEIGHT }}
                    aria-label={`${d.toLocaleDateString("ca-ES")} ${h}:00`}
                  />
                ))}

                {/* Current time line */}
                {isTodayCell && nowTop >= 0 && nowTop <= VISIBLE_HOURS * SLOT_HEIGHT && (
                  <div
                    className="pointer-events-none absolute left-0 right-0 z-20 flex items-center"
                    style={{ top: nowTop }}
                  >
                    <div className="h-2 w-2 rounded-full bg-destructive -translate-x-1" />
                    <div className="h-px flex-1 bg-destructive" />
                  </div>
                )}

                {/* Events */}
                {layouts.map(({ item, top, height, left, width }) => {
                  const styles = EVENT_TYPE_STYLES[item.type]
                  return (
                    <button
                      key={item.id}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (item.isTask && item.taskId) {
                          window.location.href = `/tasks/${item.taskId}`
                        } else {
                          onEventClick(item)
                        }
                      }}
                      className={cn(
                        "absolute overflow-hidden rounded-md border-l-2 text-left px-1.5 py-1 text-[11px] transition-shadow hover:shadow-md z-10",
                        styles.bg,
                        styles.text,
                        styles.border,
                      )}
                      style={{
                        top,
                        height: Math.max(height, 20),
                        left: `calc(${left * 100}% + 2px)`,
                        width: `calc(${width * 100}% - 4px)`,
                      }}
                      title={item.title}
                    >
                      <div className="font-semibold truncate">{item.title}</div>
                      <div className="text-[10px] opacity-70 truncate">
                        {formatTime(item.start)} - {formatTime(item.end)}
                      </div>
                      {item.location && <div className="text-[10px] opacity-60 truncate">{item.location}</div>}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

interface TimedLayout {
  item: CalendarItem
  top: number
  height: number
  left: number
  width: number
}

function layoutTimedEvents(items: CalendarItem[]): TimedLayout[] {
  // Overlap grouping: each item gets a column within its overlap cluster
  type Slot = { item: CalendarItem; col: number; end: number }
  const sorted = [...items].sort((a, b) => a.start.getTime() - b.start.getTime())
  const clusters: Slot[][] = []
  let current: Slot[] = []
  let currentEnd = 0
  for (const it of sorted) {
    const start = it.start.getTime()
    const end = it.end.getTime()
    if (start >= currentEnd && current.length > 0) {
      clusters.push(current)
      current = []
      currentEnd = 0
    }
    // assign smallest col not in use
    const usedCols = new Set(current.filter((s) => s.end > start).map((s) => s.col))
    let col = 0
    while (usedCols.has(col)) col++
    current.push({ item: it, col, end })
    currentEnd = Math.max(currentEnd, end)
  }
  if (current.length > 0) clusters.push(current)

  const out: TimedLayout[] = []
  for (const cluster of clusters) {
    const cols = Math.max(1, ...cluster.map((s) => s.col + 1))
    for (const s of cluster) {
      const startMin = s.item.start.getHours() * 60 + s.item.start.getMinutes()
      const endMin = s.item.end.getHours() * 60 + s.item.end.getMinutes() || startMin + 30
      const duration = Math.max(endMin - startMin, 20)
      const top = ((startMin - START_HOUR * 60) / 60) * SLOT_HEIGHT
      const height = (duration / 60) * SLOT_HEIGHT
      out.push({
        item: s.item,
        top,
        height,
        left: s.col / cols,
        width: 1 / cols,
      })
    }
  }
  return out
}

// ---------------- Mini month ----------------
interface MiniMonthProps {
  baseDate: Date
  items: CalendarItem[]
  onPick: (d: Date) => void
}

function MiniMonth({ baseDate, items, onPick }: MiniMonthProps) {
  const [viewDate, setViewDate] = useState(baseDate)
  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const gridStart = getMondayOf(new Date(year, month, 1))
  const today = new Date()

  const days = useMemo(() => {
    const arr: Date[] = []
    for (let i = 0; i < 42; i++) arr.push(addDays(gridStart, i))
    return arr
  }, [gridStart])

  const busyDays = useMemo(() => {
    const set = new Set<string>()
    items.forEach((it) => {
      let d = startOfDay(it.start)
      const e = startOfDay(it.end)
      while (d <= e) {
        set.add(formatISODate(d))
        d = addDays(d, 1)
      }
    })
    return set
  }, [items])

  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <button
          onClick={() => setViewDate(new Date(year, month - 1, 1))}
          className="p-1 rounded hover:bg-muted text-muted-foreground"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-3 w-3" />
        </button>
        <h3 className="text-xs font-semibold text-foreground">
          {MONTHS[month]} {year}
        </h3>
        <button
          onClick={() => setViewDate(new Date(year, month + 1, 1))}
          className="p-1 rounded hover:bg-muted text-muted-foreground"
          aria-label="Seguent"
        >
          <ChevronRight className="h-3 w-3" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 text-[10px] text-muted-foreground text-center mb-1">
        {DAYS_SHORT.map((d) => (
          <div key={d} className="py-0.5 font-medium">
            {d[0]}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d, i) => {
          const isCurrentMonth = d.getMonth() === month
          const isTodayCell = sameDay(d, today)
          const isBusy = busyDays.has(formatISODate(d))
          return (
            <button
              key={i}
              onClick={() => onPick(d)}
              className={cn(
                "relative aspect-square flex items-center justify-center text-[11px] rounded tabular-nums transition-colors",
                !isCurrentMonth && "text-muted-foreground/40",
                isCurrentMonth && !isTodayCell && "text-foreground hover:bg-muted",
                isTodayCell && "bg-primary text-primary-foreground font-bold",
              )}
            >
              {d.getDate()}
              {isBusy && !isTodayCell && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
