"use client"

import { Toaster } from "sonner"
import { useTheme } from "@/components/theme-provider"

export function ThemedToaster() {
  const { resolvedTheme } = useTheme()
  const theme = (resolvedTheme === "light" ? "light" : "dark") as "light" | "dark"
  return <Toaster theme={theme} position="top-right" richColors closeButton />
}
