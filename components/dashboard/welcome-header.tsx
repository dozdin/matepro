"use client"

import { useEffect, useState } from "react"
import { useTranslation } from "@/lib/i18n/provider"

export function WelcomeHeader({ firstName }: { firstName: string }) {
  const { t } = useTranslation()
  const [greeting, setGreeting] = useState<string>("")

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting(t("dashboard.goodMorning"))
    else if (hour < 20) setGreeting(t("dashboard.goodAfternoon"))
    else setGreeting(t("dashboard.goodEvening"))
  }, [t])

  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          {greeting ? `${greeting}, ${firstName}!` : `${firstName}`}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t("dashboard.summary")}
        </p>
      </div>
      <div className="text-sm text-muted-foreground bg-card border border-border rounded-lg px-3 py-1.5 flex items-center gap-2">
        <kbd className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded border border-border">
          ⌘K
        </kbd>
        {t("dashboard.commandPalette")}
      </div>
    </div>
  )
}
