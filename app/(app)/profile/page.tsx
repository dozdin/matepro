"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import {
  Mail,
  Phone,
  Building,
  Briefcase,
  Calendar,
  Save,
  Camera,
  Key,
  Bell,
  Shield,
  Clock,
  FolderKanban,
  ListTodo,
  CheckSquare,
  MessageSquare,
} from "lucide-react"
import { useAppStore } from "@/lib/store"
import { cn, getInitials, getAvatarColor, formatRelativeTime } from "@/lib/utils"

export default function ProfilePage() {
  const router = useRouter()
  const users = useAppStore((state) => state.users)
  const projects = useAppStore((state) => state.projects)
  const tasks = useAppStore((state) => state.tasks)
  const updateUser = useAppStore((state) => state.updateUser)

  // Default to admin user for demo
  const currentUser = users.find((u) => u.id === "demo-admin") || users[0]

  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [phone, setPhone] = useState(currentUser?.phone || "")
  const [department, setDepartment] = useState(currentUser?.department || "")
  const [saving, setSaving] = useState(false)

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center py-16">
        <p className="text-muted-foreground">Carregant perfil...</p>
      </div>
    )
  }

  const userProjects = projects.filter((p) => p.managerId === currentUser.id)
  const userTasks = tasks.filter((t) => t.assigneeId === currentUser.id)
  const completedTasks = userTasks.filter((t) => t.status === "completat").length
  const activeTasks = userTasks.filter((t) => t.status === "en_curs" || t.status === "pendent").length

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    updateUser(currentUser.id, { name, email, phone, department })
    toast.success("Perfil actualitzat correctament")
    setSaving(false)
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    toast.success("Sessio tancada")
    router.push("/login")
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header Card */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-accent/20" />
        <div className="relative px-6 pb-6">
          <div className="flex items-end gap-4 -mt-12">
            <div className="relative">
              <div
                className={cn(
                  "flex h-24 w-24 items-center justify-center rounded-full border-4 border-card text-3xl font-bold text-white",
                  getAvatarColor(currentUser.name)
                )}
              >
                {getInitials(currentUser.name)}
              </div>
              <button
                onClick={() => toast.info("Funcionalitat disponible en producció")}
                className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Camera className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 pb-2">
              <h1 className="text-2xl font-bold text-foreground">{currentUser.name}</h1>
              <p className="text-muted-foreground">{currentUser.roleLabel} · {currentUser.department}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-destructive/50 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
            >
              Tancar sessio
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <FolderKanban className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userProjects.length}</p>
              <p className="text-xs text-muted-foreground">Projectes</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/20 text-accent">
              <ListTodo className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{activeTasks}</p>
              <p className="text-xs text-muted-foreground">Tasques actives</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/20 text-success">
              <CheckSquare className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedTasks}</p>
              <p className="text-xs text-muted-foreground">Completades</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/20 text-warning">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{userTasks.reduce((acc, t) => acc + (t.actualHours || 0), 0)}h</p>
              <p className="text-xs text-muted-foreground">Hores treballades</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Info */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-lg font-semibold">Informacio personal</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nom complet</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Telefon</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Departament</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-sm font-medium">Rol</label>
              <div className="relative">
                <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  value={currentUser.roleLabel}
                  disabled
                  className="h-10 w-full rounded-lg border border-input bg-muted pl-10 pr-3 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setName(currentUser.name)
                setEmail(currentUser.email)
                setPhone(currentUser.phone)
                setDepartment(currentUser.department)
              }}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted transition-colors"
            >
              Cancel·lar
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              {saving ? "Guardant..." : "Guardar canvis"}
            </button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold">Dades del compte</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Membre des de {new Date(currentUser.createdAt).toLocaleDateString("ca-ES")}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Ultima activitat {formatRelativeTime(currentUser.lastActive)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", currentUser.status === "active" ? "bg-success" : "bg-muted-foreground")} />
                <span className="text-muted-foreground">Estat: <span className="font-medium text-foreground">{currentUser.status === "active" ? "Actiu" : "Inactiu"}</span></span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 font-semibold">Accions ràpides</h3>
            <div className="space-y-2">
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <Key className="h-4 w-4 text-muted-foreground" />
                Canviar contrasenya
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <Bell className="h-4 w-4 text-muted-foreground" />
                Preferencies de notificacions
              </Link>
              <Link
                href="/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <Shield className="h-4 w-4 text-muted-foreground" />
                Seguretat
              </Link>
              <Link
                href="/notifications"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
              >
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Centre de notificacions
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Tasques recents</h2>
        {userTasks.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">No tens tasques assignades</p>
        ) : (
          <div className="space-y-2">
            {userTasks.slice(0, 5).map((task) => (
              <Link
                key={task.id}
                href={`/tasks/${task.id}`}
                className="flex items-center justify-between rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">{task.projectName}</p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-xs font-medium",
                    task.status === "completat" && "bg-success/20 text-success",
                    task.status === "en_curs" && "bg-accent/20 text-accent",
                    task.status === "pendent" && "bg-warning/20 text-warning",
                    task.status === "bloquejat" && "bg-destructive/20 text-destructive",
                    task.status === "revisio" && "bg-primary/20 text-primary"
                  )}
                >
                  {task.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
