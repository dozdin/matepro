"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useTheme } from "@/components/theme-provider"
import { 
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Key,
  Mail,
  Smartphone,
  Moon,
  Sun,
  Monitor,
  Save,
  Camera
} from "lucide-react"
import { cn } from "@/lib/utils"

type SettingsTab = "profile" | "notifications" | "security" | "appearance" | "language"

const TABS = [
  { id: "profile" as SettingsTab, label: "Perfil", icon: User },
  { id: "notifications" as SettingsTab, label: "Notificaciones", icon: Bell },
  { id: "security" as SettingsTab, label: "Seguridad", icon: Shield },
  { id: "appearance" as SettingsTab, label: "Apariencia", icon: Palette },
  { id: "language" as SettingsTab, label: "Idioma", icon: Globe },
]

function ProfileTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Informacion personal</h3>
        <p className="text-sm text-muted-foreground">Actualiza tu informacion de perfil</p>
      </div>

      <div className="flex items-start gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
            T
          </div>
          <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors">
            <Camera className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Nombre
            </label>
            <input
              type="text"
              defaultValue="Tu Nombre"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Apellidos
            </label>
            <input
              type="text"
              defaultValue="Usuario"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Email
            </label>
            <input
              type="email"
              defaultValue="tu.email@astillero.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Telefono
            </label>
            <input
              type="tel"
              defaultValue="+34 600 000 000"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Cargo / Rol
            </label>
            <input
              type="text"
              defaultValue="Usuario"
              disabled
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              Departamento
            </label>
            <input
              type="text"
              defaultValue="General"
              disabled
              className="w-full px-4 py-2 bg-muted border border-border rounded-lg text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function NotificationsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Preferencias de notificaciones</h3>
        <p className="text-sm text-muted-foreground">Configura como quieres recibir las notificaciones</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Notificaciones por email
          </h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Tareas asignadas</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Menciones en foro</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Mensajes directos</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Recordatorios de calendario</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Resumen semanal</span>
              <input type="checkbox" className="w-4 h-4 accent-primary" />
            </label>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            Notificaciones push
          </h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Mensajes de chat</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Alertas de seguridad</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">Actualizaciones de proyectos</span>
              <input type="checkbox" className="w-4 h-4 accent-primary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Seguridad de la cuenta</h3>
        <p className="text-sm text-muted-foreground">Gestiona la seguridad de tu cuenta</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            Cambiar contrasena
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Contrasena actual
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nueva contrasena
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Confirmar nueva contrasena
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Actualizar contrasena
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            Autenticacion de dos factores
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            Anade una capa extra de seguridad a tu cuenta
          </p>
          <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
            Configurar 2FA
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4">Sesiones activas</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">Este dispositivo</p>
                <p className="text-xs text-muted-foreground">Chrome en Windows - Ultima actividad: Ahora</p>
              </div>
              <span className="px-2 py-1 text-xs bg-success/15 text-success rounded-full">Actual</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const current = mounted ? (theme as "light" | "dark" | "system") : "dark"

  const applyTheme = (value: "light" | "dark" | "system") => {
    setTheme(value)
    toast.success(
      value === "light"
        ? "Tema clar activat"
        : value === "dark"
          ? "Tema fosc activat"
          : "Tema del sistema activat",
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Apariencia</h3>
        <p className="text-sm text-muted-foreground">Personaliza el aspecto de la aplicacion</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-4">Tema</h4>
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={() => applyTheme("light")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
              current === "light"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <Sun className="h-6 w-6" />
            <span className="text-sm">Claro</span>
          </button>
          <button
            onClick={() => applyTheme("dark")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
              current === "dark"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <Moon className="h-6 w-6" />
            <span className="text-sm">Oscuro</span>
          </button>
          <button
            onClick={() => applyTheme("system")}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-lg border transition-colors",
              current === "system"
                ? "border-primary bg-primary/10"
                : "border-border hover:border-muted-foreground/50"
            )}
          >
            <Monitor className="h-6 w-6" />
            <span className="text-sm">Sistema</span>
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-4">Color de acento</h4>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-offset-background ring-blue-600" />
          <button className="w-8 h-8 rounded-full bg-orange-500 hover:ring-2 ring-offset-2 ring-offset-background ring-orange-500 transition-all" />
          <button className="w-8 h-8 rounded-full bg-green-500 hover:ring-2 ring-offset-2 ring-offset-background ring-green-500 transition-all" />
          <button className="w-8 h-8 rounded-full bg-purple-500 hover:ring-2 ring-offset-2 ring-offset-background ring-purple-500 transition-all" />
          <button className="w-8 h-8 rounded-full bg-red-500 hover:ring-2 ring-offset-2 ring-offset-background ring-red-500 transition-all" />
        </div>
      </div>
    </div>
  )
}

function LanguageTab() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">Idioma y region</h3>
        <p className="text-sm text-muted-foreground">Configura tus preferencias de idioma</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Idioma de la interfaz
          </label>
          <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Espanol (Espana)</option>
            <option>Catalan</option>
            <option>English (US)</option>
            <option>English (UK)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Formato de fecha
          </label>
          <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Formato de hora
          </label>
          <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>24 horas (14:30)</option>
            <option>12 horas (2:30 PM)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Primer dia de la semana
          </label>
          <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>Lunes</option>
            <option>Domingo</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success("Configuracio guardada correctament")
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Configuracio</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona les teves preferencies personals
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? "Guardant..." : "Guardar canvis"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-48 shrink-0">
          <nav className="space-y-1">
            {TABS.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-card rounded-lg border border-border p-6">
          {activeTab === "profile" && <ProfileTab />}
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "appearance" && <AppearanceTab />}
          {activeTab === "language" && <LanguageTab />}
        </div>
      </div>
    </div>
  )
}
