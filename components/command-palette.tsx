"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAppStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import {
  Search,
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  Columns3,
  Calendar,
  CheckSquare,
  FileText,
  MessageSquare,
  MessagesSquare,
  Bell,
  Activity,
  BarChart3,
  Users,
  Scale,
  Trophy,
  Settings,
  Shield,
  Anchor,
  Command as CommandIcon,
  ArrowRight,
} from "lucide-react"

type CommandItem = {
  id: string
  title: string
  subtitle?: string
  category: string
  href: string
  icon: React.ReactNode
  keywords?: string[]
}

const PAGE_COMMANDS: CommandItem[] = [
  { id: "dashboard", title: "Dashboard", category: "Pagines", href: "/dashboard", icon: <LayoutDashboard className="h-4 w-4" />, keywords: ["inici", "home"] },
  { id: "projects", title: "Projectes", category: "Pagines", href: "/projects", icon: <FolderKanban className="h-4 w-4" /> },
  { id: "tasks", title: "Tasques", category: "Pagines", href: "/tasks", icon: <ListTodo className="h-4 w-4" /> },
  { id: "kanban", title: "Kanban", category: "Pagines", href: "/kanban", icon: <Columns3 className="h-4 w-4" /> },
  { id: "calendar", title: "Calendari", category: "Pagines", href: "/calendar", icon: <Calendar className="h-4 w-4" /> },
  { id: "checklists", title: "Checklists", category: "Pagines", href: "/checklists", icon: <CheckSquare className="h-4 w-4" /> },
  { id: "documents", title: "Documents", category: "Pagines", href: "/documents", icon: <FileText className="h-4 w-4" /> },
  { id: "forum", title: "Forum", category: "Pagines", href: "/forum", icon: <MessagesSquare className="h-4 w-4" /> },
  { id: "chat", title: "Xat", category: "Pagines", href: "/chat", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "activity", title: "Activitat", category: "Analitica", href: "/activity", icon: <Activity className="h-4 w-4" /> },
  { id: "reports", title: "Informes", category: "Analitica", href: "/reports", icon: <BarChart3 className="h-4 w-4" /> },
  { id: "workload", title: "Carrega de treball", category: "Analitica", href: "/workload", icon: <Users className="h-4 w-4" /> },
  { id: "compare", title: "Comparador de projectes", category: "Analitica", href: "/compare", icon: <Scale className="h-4 w-4" /> },
  { id: "achievements", title: "Assoliments", category: "Analitica", href: "/achievements", icon: <Trophy className="h-4 w-4" /> },
  { id: "notifications", title: "Notificacions", category: "Sistema", href: "/notifications", icon: <Bell className="h-4 w-4" /> },
  { id: "settings", title: "Configuracio", category: "Sistema", href: "/settings", icon: <Settings className="h-4 w-4" /> },
  { id: "admin", title: "Panel Admin", category: "Sistema", href: "/admin", icon: <Shield className="h-4 w-4" /> },
]

export function CommandPalette() {
  const router = useRouter()
  const projects = useAppStore((s) => s.projects)
  const tasks = useAppStore((s) => s.tasks)
  const users = useAppStore((s) => s.users)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  // Toggle with Cmd/Ctrl + K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((v) => !v)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (open) {
      setQuery("")
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  const allCommands = useMemo<CommandItem[]>(() => {
    const projectCommands: CommandItem[] = projects.map((p) => ({
      id: `project-${p.id}`,
      title: p.name,
      subtitle: `${p.code} • ${p.clientName}`,
      category: "Projectes",
      href: `/projects/${p.id}`,
      icon: <Anchor className="h-4 w-4" />,
      keywords: [p.code, p.clientName, p.status],
    }))
    const taskCommands: CommandItem[] = tasks.slice(0, 40).map((t) => ({
      id: `task-${t.id}`,
      title: t.title,
      subtitle: `${t.projectName || ""} • ${t.priority}`,
      category: "Tasques",
      href: `/tasks/${t.id}`,
      icon: <ListTodo className="h-4 w-4" />,
      keywords: [t.status, t.priority, t.assigneeName || ""],
    }))
    const userCommands: CommandItem[] = users.slice(0, 10).map((u) => ({
      id: `user-${u.id}`,
      title: u.name,
      subtitle: `${u.roleLabel} • ${u.department}`,
      category: "Persones",
      href: `/workload`,
      icon: <Users className="h-4 w-4" />,
      keywords: [u.email, u.role],
    }))

    return [...PAGE_COMMANDS, ...projectCommands, ...taskCommands, ...userCommands]
  }, [projects, tasks, users])

  const filtered = useMemo(() => {
    if (!query.trim()) return allCommands.slice(0, 30)
    const q = query.toLowerCase()
    return allCommands
      .filter((c) => {
        const haystack = `${c.title} ${c.subtitle || ""} ${(c.keywords || []).join(" ")}`.toLowerCase()
        return haystack.includes(q)
      })
      .slice(0, 40)
  }, [allCommands, query])

  const grouped = useMemo(() => {
    const g: Record<string, CommandItem[]> = {}
    filtered.forEach((c) => {
      if (!g[c.category]) g[c.category] = []
      g[c.category].push(c)
    })
    return g
  }, [filtered])

  useEffect(() => {
    setSelectedIndex(0)
  }, [query])

  const go = (item: CommandItem) => {
    router.push(item.href)
    setOpen(false)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((i) => Math.min(filtered.length - 1, i + 1))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((i) => Math.max(0, i - 1))
    } else if (e.key === "Enter" && filtered[selectedIndex]) {
      e.preventDefault()
      go(filtered[selectedIndex])
    }
  }

  if (!open) return null

  let runningIndex = -1

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setOpen(false)} />

      <div className="relative w-full max-w-xl bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
        {/* Search */}
        <div className="flex items-center gap-3 px-4 border-b border-border">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Cerca projectes, tasques, persones o pagines..."
            className="flex-1 bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <kbd className="font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border text-muted-foreground">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
              Sense resultats per &quot;{query}&quot;
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="mb-2">
                <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {category}
                </div>
                {items.map((item) => {
                  runningIndex++
                  const isSelected = runningIndex === selectedIndex
                  return (
                    <button
                      key={item.id}
                      onClick={() => go(item)}
                      onMouseEnter={() => setSelectedIndex(filtered.findIndex((f) => f.id === item.id))}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                        isSelected ? "bg-primary/15 text-foreground" : "text-foreground hover:bg-accent/30"
                      )}
                    >
                      <div className={cn("flex-shrink-0", isSelected ? "text-primary" : "text-muted-foreground")}>
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-xs text-muted-foreground truncate">{item.subtitle}</div>
                        )}
                      </div>
                      {isSelected && <ArrowRight className="h-3.5 w-3.5 text-primary flex-shrink-0" />}
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-muted/20 text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-card px-1 py-0.5 rounded border border-border">&uarr;</kbd>
              <kbd className="font-mono bg-card px-1 py-0.5 rounded border border-border">&darr;</kbd>
              Navega
            </span>
            <span className="flex items-center gap-1">
              <kbd className="font-mono bg-card px-1 py-0.5 rounded border border-border">&#x21B5;</kbd>
              Obre
            </span>
          </div>
          <div className="flex items-center gap-1">
            <CommandIcon className="h-3 w-3" />
            <span>{filtered.length} resultats</span>
          </div>
        </div>
      </div>
    </div>
  )
}
