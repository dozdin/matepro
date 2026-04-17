'use client'

import * as React from 'react'

type Theme = 'light' | 'dark' | 'system'
type ResolvedTheme = 'light' | 'dark'

interface ThemeContextValue {
  theme: Theme
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const STORAGE_KEY = 'theme'
const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved: ResolvedTheme = theme === 'system' ? getSystemTheme() : theme
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  root.style.colorScheme = resolved
  return resolved
}

interface ThemeProviderProps {
  children: React.ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({ children, defaultTheme = 'dark' }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(defaultTheme)
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>('dark')

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    const stored = (typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null) as Theme | null
    const initial = stored ?? defaultTheme
    setThemeState(initial)
    setResolvedTheme(applyTheme(initial))
  }, [defaultTheme])

  // Listen to system theme changes when in "system" mode
  React.useEffect(() => {
    if (theme !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => setResolvedTheme(applyTheme('system'))
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [theme])

  const setTheme = React.useCallback((next: Theme) => {
    setThemeState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore quota / private-mode errors
    }
    setResolvedTheme(applyTheme(next))
  }, [])

  const value = React.useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) {
    // Fallback for components rendered outside of the provider (e.g. during tests)
    return {
      theme: 'dark' as Theme,
      resolvedTheme: 'dark' as ResolvedTheme,
      setTheme: () => {},
    }
  }
  return ctx
}
