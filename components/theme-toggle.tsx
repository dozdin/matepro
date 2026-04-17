"use client"

import { useState, useRef, useEffect } from "react"
import { Moon, Sun, Monitor } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type ThemeValue = "light" | "dark" | "system"

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  const current: ThemeValue = (theme as ThemeValue) ?? "dark"
  const isDark = mounted ? resolvedTheme === "dark" : true

  const options: { value: ThemeValue; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Clar", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Fosc", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "Sistema", icon: <Monitor className="h-4 w-4" /> },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        aria-label="Canviar tema"
        title="Canviar tema"
      >
        {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-40 rounded-lg border border-border bg-popover p-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value)
                setOpen(false)
              }}
              className={cn(
                "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted",
                current === opt.value && "bg-muted font-medium",
              )}
            >
              {opt.icon}
              <span>{opt.label}</span>
              {current === opt.value && <span className="ml-auto text-xs text-primary">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
