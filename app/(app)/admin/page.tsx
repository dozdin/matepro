"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  Users,
  Settings,
  Shield,
  Activity,
  Edit2,
  Trash2,
  Plus,
  Search,
  Lock,
  Unlock,
  Key,
  Building,
  UserPlus,
  X,
  Save,
  Check,
} from "lucide-react"
import { cn, formatRelativeTime, getInitials, getAvatarColor } from "@/lib/utils"
import { useAppStore, type User } from "@/lib/store"

type AdminTab = "users" | "roles" | "departments" | "settings" | "logs"

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  userCount: number
}

interface Department {
  id: string
  name: string
  description: string
  manager: string
  userCount: number
}

const MOCK_ROLES: Role[] = [
  { id: "1", name: "Administrador", description: "Acces complet al sistema", permissions: ["all"], userCount: 2 },
  { id: "2", name: "Project Manager", description: "Gestio de projectes i equips", permissions: ["projects.manage", "tasks.manage", "team.view", "reports.view"], userCount: 3 },
  { id: "3", name: "Supervisor", description: "Supervisio de tasques i equips", permissions: ["tasks.manage", "team.view", "checklist.manage"], userCount: 5 },
  { id: "4", name: "Operari", description: "Acces basic a tasques assignades", permissions: ["tasks.view", "tasks.update", "checklist.update"], userCount: 15 },
  { id: "5", name: "Administracio", description: "Gestio administrativa i documents", permissions: ["documents.manage", "reports.view", "users.view"], userCount: 2 },
]

const MOCK_DEPARTMENTS: Department[] = [
  { id: "1", name: "Direccio", description: "Direccio general de l'astillero", manager: "Carlos Martinez", userCount: 2 },
  { id: "2", name: "Projectes", description: "Gestio i coordinacio de projectes", manager: "Ana Garcia", userCount: 4 },
  { id: "3", name: "Produccio", description: "Linia de produccio principal", manager: "Miguel Torres", userCount: 8 },
  { id: "4", name: "Carpinteria", description: "Treballs de carpinteria naval", manager: "Marc Puig", userCount: 6 },
  { id: "5", name: "Electricitat", description: "Instal·lacions elèctriques", manager: "Pere Soler", userCount: 4 },
  { id: "6", name: "Pintura", description: "Pintura i acabats", manager: "Anna Vidal", userCount: 5 },
  { id: "7", name: "Administracio", description: "Gestio administrativa", manager: "Laura Fernandez", userCount: 3 },
]

const ACTIVITY_LOGS = [
  { id: "1", action: "Usuari creat", user: "Carlos Martinez", target: "Laura Fernandez", timestamp: new Date(Date.now() - 1000 * 60 * 30) },
  { id: "2", action: "Rol modificat", user: "Carlos Martinez", target: "Supervisor", timestamp: new Date(Date.now() - 1000 * 60 * 60) },
  { id: "3", action: "Usuari desactivat", user: "Ana Garcia", target: "Pedro Lopez", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: "4", action: "Departament creat", user: "Carlos Martinez", target: "Pintura", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24) },
  { id: "5", action: "Permisos actualitzats", user: "Carlos Martinez", target: "Project Manager", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) },
]

const TABS = [
  { id: "users" as AdminTab, label: "Usuaris", icon: Users },
  { id: "roles" as AdminTab, label: "Rols", icon: Shield },
  { id: "departments" as AdminTab, label: "Departaments", icon: Building },
  { id: "logs" as AdminTab, label: "Activitat", icon: Activity },
  { id: "settings" as AdminTab, label: "Configuracio", icon: Settings },
]

function CreateUserModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const addUser = useAppStore((state) => state.addUser)
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "operari" as User["role"],
    roleLabel: "Operari",
    department: "",
    phone: "",
  })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email) {
      toast.error("Si us plau, omple tots els camps obligatoris")
      return
    }
    addUser({
      ...form,
      status: "pending",
      avatarUrl: null,
    })
    toast.success(`Usuari ${form.name} creat correctament`)
    setForm({ name: "", email: "", role: "operari", roleLabel: "Operari", department: "", phone: "" })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-semibold">Nou Usuari</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-muted">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">Nom complet *</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Rol</label>
              <select
                value={form.role}
                onChange={(e) => {
                  const role = e.target.value as User["role"]
                  const labels: Record<User["role"], string> = {
                    admin: "Administrador",
                    cap_projecte: "Project Manager",
                    operari: "Operari",
                    visitant: "Visitant",
                  }
                  setForm({ ...form, role, roleLabel: labels[role] })
                }}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="admin">Administrador</option>
                <option value="cap_projecte">Project Manager</option>
                <option value="operari">Operari</option>
                <option value="visitant">Visitant</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Departament</label>
              <select
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
                className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Sense departament</option>
                {MOCK_DEPARTMENTS.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Telefon</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-4 py-2 text-sm hover:bg-muted"
            >
              Cancel·lar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
            >
              <Check className="h-4 w-4" />
              Crear usuari
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

function UsersTab() {
  const users = useAppStore((state) => state.users)
  const toggleUserStatus = useAppStore((state) => state.toggleUserStatus)
  const deleteUser = useAppStore((state) => state.deleteUser)

  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleToggleStatus = (user: User) => {
    toggleUserStatus(user.id)
    toast.success(`Usuari ${user.status === "active" ? "desactivat" : "activat"}: ${user.name}`)
  }

  const handleDelete = (user: User) => {
    if (confirm(`Estas segur que vols eliminar a ${user.name}?`)) {
      deleteUser(user.id)
      toast.success(`Usuari eliminat: ${user.name}`)
    }
  }

  const handleResetPassword = (user: User) => {
    toast.success(`Email de reset enviat a ${user.email}`)
  }

  const handleEdit = (user: User) => {
    toast.info(`Editant usuari: ${user.name}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cercar usuaris..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="all">Tots els estats</option>
            <option value="active">Actius</option>
            <option value="inactive">Inactius</option>
            <option value="pending">Pendents</option>
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <UserPlus className="h-4 w-4" />
          Nou Usuari
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuari</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rol</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Departament</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estat</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Darrera activitat</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium text-white", getAvatarColor(user.name))}>
                        {getInitials(user.name)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{user.roleLabel}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{user.department}</td>
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        user.status === "active" && "bg-success/10 text-success",
                        user.status === "inactive" && "bg-destructive/10 text-destructive",
                        user.status === "pending" && "bg-warning/10 text-warning"
                      )}
                    >
                      {user.status === "active" && "Actiu"}
                      {user.status === "inactive" && "Inactiu"}
                      {user.status === "pending" && "Pendent"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatRelativeTime(user.lastActive)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(user)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleResetPassword(user)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Reset password"
                      >
                        <Key className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title={user.status === "active" ? "Desactivar" : "Activar"}
                      >
                        {user.status === "active" ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Unlock className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CreateUserModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  )
}

function RolesTab() {
  const handleCreate = () => toast.info("Crear nou rol")
  const handleEdit = (name: string) => toast.info(`Editant rol: ${name}`)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Gestiona els rols i permisos del sistema</p>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nou Rol
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_ROLES.map((role) => (
          <div key={role.id} className="bg-card rounded-lg border border-border p-4 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold text-foreground">{role.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
              </div>
              <button onClick={() => handleEdit(role.name)} className="p-1.5 hover:bg-muted rounded transition-colors">
                <Edit2 className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{role.userCount} usuaris</span>
              <span className="text-muted-foreground">
                {role.permissions.length === 1 && role.permissions[0] === "all"
                  ? "Tots els permisos"
                  : `${role.permissions.length} permisos`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DepartmentsTab() {
  const handleCreate = () => toast.info("Crear nou departament")
  const handleEdit = (name: string) => toast.info(`Editant departament: ${name}`)
  const handleDelete = (name: string) => {
    if (confirm(`Eliminar departament ${name}?`)) {
      toast.success(`Departament ${name} eliminat`)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Gestiona els departaments de l&apos;astillero</p>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Nou Departament
        </button>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Departament</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Descripcio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Responsable</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Membres</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {MOCK_DEPARTMENTS.map((dept) => (
                <tr key={dept.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Building className="h-4 w-4 text-primary" />
                      </div>
                      <span className="font-medium text-foreground">{dept.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{dept.description}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{dept.manager}</td>
                  <td className="px-4 py-3 text-sm text-foreground">{dept.userCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(dept.name)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="h-4 w-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={() => handleDelete(dept.name)}
                        className="p-1.5 hover:bg-muted rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function LogsTab() {
  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Registre d&apos;activitat del sistema</p>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Accio</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Usuari</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Objectiu</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ACTIVITY_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-foreground">
                      <Activity className="h-4 w-4 text-primary" />
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{log.user}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{log.target}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {log.timestamp.toLocaleString("ca-ES")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function SettingsTab() {
  const resetStore = useAppStore((state) => state.resetStore)
  const [companyName, setCompanyName] = useState("MatePro")
  const [timezone, setTimezone] = useState("Europe/Madrid")
  const [language, setLanguage] = useState("Catala")

  const handleSave = () => {
    toast.success("Configuracio guardada correctament")
  }

  const handleResetData = () => {
    if (confirm("Estas segur que vols restablir totes les dades? Aquesta accio no es pot desfer.")) {
      resetStore()
      toast.success("Dades restablertes als valors inicials")
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">Configuracio general del sistema</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            General
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nom de l&apos;astillero
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Zona horària
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Europe/Madrid">Europe/Madrid (UTC+1)</option>
                <option value="Europe/London">Europe/London (UTC+0)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Idioma per defecte
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="Catala">Catala</option>
                <option value="Espanol">Espanol</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Dades i Backup
          </h3>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-sm font-medium">Mode demo</p>
              <p className="text-xs text-muted-foreground mt-1">
                Les dades es guarden al localStorage del navegador
              </p>
            </div>
            <button
              onClick={handleResetData}
              className="w-full px-4 py-2 bg-destructive/10 text-destructive border border-destructive/30 rounded-lg hover:bg-destructive/20 transition-colors"
            >
              Restablir dades demo
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Save className="h-4 w-4" />
          Guardar canvis
        </button>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const users = useAppStore((state) => state.users)
  const [activeTab, setActiveTab] = useState<AdminTab>("users")

  const activeUsers = users.filter((u) => u.status === "active").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel d&apos;Administracio</h1>
        <p className="text-muted-foreground mt-1">
          Gestiona usuaris, rols i configuracio del sistema
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{users.length}</p>
              <p className="text-sm text-muted-foreground">Usuaris totals</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Activity className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{activeUsers}</p>
              <p className="text-sm text-muted-foreground">Usuaris actius</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <Shield className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{MOCK_ROLES.length}</p>
              <p className="text-sm text-muted-foreground">Rols definits</p>
            </div>
          </div>
        </div>
        <div className="bg-card rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Building className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{MOCK_DEPARTMENTS.length}</p>
              <p className="text-sm text-muted-foreground">Departaments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 bg-card border border-border rounded-lg p-1 w-fit overflow-x-auto">
        {TABS.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      <div>
        {activeTab === "users" && <UsersTab />}
        {activeTab === "roles" && <RolesTab />}
        {activeTab === "departments" && <DepartmentsTab />}
        {activeTab === "logs" && <LogsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>
    </div>
  )
}
