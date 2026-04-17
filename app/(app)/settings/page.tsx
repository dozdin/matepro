"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useTheme } from "@/components/theme-provider"
import { useTranslation } from "@/lib/i18n/provider"
import { LOCALES, LOCALE_META, type Locale } from "@/lib/i18n/config"
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

function ProfileTab() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("settings.profileTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("settings.profileSubtitle")}</p>
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
              {t("settings.firstName")}
            </label>
            <input
              type="text"
              defaultValue="Tu Nombre"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("settings.lastName")}
            </label>
            <input
              type="text"
              defaultValue="Usuario"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("settings.email")}
            </label>
            <input
              type="email"
              defaultValue="tu.email@astillero.com"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("settings.phone")}
            </label>
            <input
              type="tel"
              defaultValue="+34 600 000 000"
              className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="col-span-2">
            <label className="block text-sm font-medium text-foreground mb-1">
              {t("settings.role")}
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
              {t("settings.department")}
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
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("settings.notifTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("settings.notifSubtitle")}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            {t("settings.emailNotifs")}
          </h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifAssignedTasks")}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifForumMentions")}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifDirectMessages")}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifCalendarReminders")}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifWeeklyDigest")}</span>
              <input type="checkbox" className="w-4 h-4 accent-primary" />
            </label>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-primary" />
            {t("settings.pushNotifs")}
          </h4>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifChatMessages")}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifSecurityAlerts")}</span>
              <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
            </label>
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">{t("settings.notifProjectUpdates")}</span>
              <input type="checkbox" className="w-4 h-4 accent-primary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

function SecurityTab() {
  const { t } = useTranslation()
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("settings.securityTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("settings.securitySubtitle")}</p>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Key className="h-4 w-4 text-primary" />
            {t("settings.changePassword")}
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("settings.currentPassword")}
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("settings.newPassword")}
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                {t("settings.confirmPassword")}
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              {t("settings.updatePassword")}
            </button>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4 flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            {t("settings.twoFactor")}
          </h4>
          <p className="text-sm text-muted-foreground mb-4">
            {t("settings.twoFactorDesc")}
          </p>
          <button className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors">
            {t("settings.setupTwoFactor")}
          </button>
        </div>

        <div className="bg-card rounded-lg border border-border p-4">
          <h4 className="font-medium text-foreground mb-4">{t("settings.activeSessions")}</h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{t("settings.thisDevice")}</p>
                <p className="text-xs text-muted-foreground">{t("settings.lastActivityNow")}</p>
              </div>
              <span className="px-2 py-1 text-xs bg-success/15 text-success rounded-full">{t("settings.currentSession")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AppearanceTab() {
  const { theme, setTheme } = useTheme()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const current = mounted ? (theme as "light" | "dark" | "system") : "dark"

  const applyTheme = (value: "light" | "dark" | "system") => {
    setTheme(value)
    toast.success(
      value === "light"
        ? t("theme.lightActivated")
        : value === "dark"
          ? t("theme.darkActivated")
          : t("theme.systemActivated"),
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("settings.appearanceTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("settings.appearanceSubtitle")}</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-4">{t("settings.theme")}</h4>
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
            <span className="text-sm">{t("theme.light")}</span>
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
            <span className="text-sm">{t("theme.dark")}</span>
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
            <span className="text-sm">{t("theme.system")}</span>
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border p-4">
        <h4 className="font-medium text-foreground mb-4">{t("settings.accentColor")}</h4>
        <div className="flex items-center gap-3">
          <button aria-label="Blue" className="w-8 h-8 rounded-full bg-blue-600 ring-2 ring-offset-2 ring-offset-background ring-blue-600" />
          <button aria-label="Orange" className="w-8 h-8 rounded-full bg-orange-500 hover:ring-2 ring-offset-2 ring-offset-background ring-orange-500 transition-all" />
          <button aria-label="Green" className="w-8 h-8 rounded-full bg-green-500 hover:ring-2 ring-offset-2 ring-offset-background ring-green-500 transition-all" />
          <button aria-label="Red" className="w-8 h-8 rounded-full bg-red-500 hover:ring-2 ring-offset-2 ring-offset-background ring-red-500 transition-all" />
        </div>
      </div>
    </div>
  )
}

function LanguageTab() {
  const { t, locale, setLocale } = useTranslation()

  const handleLocaleChange = (value: Locale) => {
    setLocale(value)
    toast.success(t("settings.saved"))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">{t("settings.languageTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("settings.languageSubtitle")}</p>
      </div>

      <div className="bg-card rounded-lg border border-border p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("settings.interfaceLanguage")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {LOCALES.map((code) => {
              const meta = LOCALE_META[code]
              const isActive = locale === code
              return (
                <button
                  key={code}
                  type="button"
                  onClick={() => handleLocaleChange(code)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg border text-left transition-colors",
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-muted-foreground/50 bg-background",
                  )}
                >
                  <span className="text-2xl" aria-hidden="true">{meta.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground">{meta.nativeLabel}</div>
                    <div className="text-xs text-muted-foreground">{meta.label}</div>
                  </div>
                  {isActive && (
                    <span className="text-xs font-medium text-primary">●</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("settings.dateFormat")}
          </label>
          <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
            <option>YYYY-MM-DD</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("settings.timeFormat")}
          </label>
          <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>{t("settings.time24")}</option>
            <option>{t("settings.time12")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            {t("settings.firstDayOfWeek")}
          </label>
          <select className="w-full px-4 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option>{t("settings.monday")}</option>
            <option>{t("settings.sunday")}</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default function SettingsPage() {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile")
  const [saving, setSaving] = useState(false)

  const TABS = [
    { id: "profile" as SettingsTab, label: t("settings.tabProfile"), icon: User },
    { id: "notifications" as SettingsTab, label: t("settings.tabNotifications"), icon: Bell },
    { id: "security" as SettingsTab, label: t("settings.tabSecurity"), icon: Shield },
    { id: "appearance" as SettingsTab, label: t("settings.tabAppearance"), icon: Palette },
    { id: "language" as SettingsTab, label: t("settings.tabLanguage"), icon: Globe },
  ]

  const handleSave = async () => {
    setSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 600))
    toast.success(t("settings.saved"))
    setSaving(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t("settings.title")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("settings.subtitle")}
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saving ? t("common.saving") : t("settings.saveChanges")}
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
