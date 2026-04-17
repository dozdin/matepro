"use client"

import { useEffect, useRef, useState } from "react"
import { Languages, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { LOCALES, LOCALE_META } from "@/lib/i18n/config"
import { useTranslation } from "@/lib/i18n/provider"

export function LanguageToggle() {
  const { locale, setLocale, t } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label={t("header.changeLanguage")}
        title={t("header.changeLanguage")}
      >
        <Languages className="h-5 w-5" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-popover p-1 shadow-lg">
          {LOCALES.map((code) => {
            const meta = LOCALE_META[code]
            const isActive = locale === code
            return (
              <button
                key={code}
                onClick={() => {
                  setLocale(code)
                  setOpen(false)
                }}
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                  isActive && "bg-muted font-medium",
                )}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {meta.flag}
                </span>
                <span className="flex-1 text-left">{meta.nativeLabel}</span>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
