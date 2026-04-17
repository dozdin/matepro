"use client"

import * as React from "react"
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  LOCALE_STORAGE_KEY,
  type Locale,
  isLocale,
} from "./config"
import { TRANSLATIONS, type TranslationDict } from "./translations"

type TPath<T, P extends string = ""> = {
  [K in keyof T & string]: T[K] extends string
    ? `${P}${P extends "" ? "" : "."}${K}`
    : TPath<T[K], `${P}${P extends "" ? "" : "."}${K}`>
}[keyof T & string]

export type TranslationKey = TPath<TranslationDict>

type TranslateVars = Record<string, string | number>

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, vars?: TranslateVars) => string
  dict: TranslationDict
  dateLocale: string
}

const I18nContext = React.createContext<I18nContextValue | undefined>(undefined)

function getFromPath(obj: unknown, path: string): string | undefined {
  const parts = path.split(".")
  let current: unknown = obj
  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part]
    } else {
      return undefined
    }
  }
  return typeof current === "string" ? current : undefined
}

function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    const value = vars[key]
    return value === undefined || value === null ? `{${key}}` : String(value)
  })
}

export function I18nProvider({
  children,
  defaultLocale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode
  defaultLocale?: Locale
}) {
  const [locale, setLocaleState] = React.useState<Locale>(defaultLocale)

  // Hydrate locale from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
      if (stored && isLocale(stored)) {
        setLocaleState(stored)
      }
    } catch {
      // ignore storage errors
    }
  }, [])

  // Keep <html lang> in sync for accessibility/SEO
  React.useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = locale
    }
  }, [locale])

  const setLocale = React.useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, next)
    } catch {
      // ignore storage errors
    }
  }, [])

  const dict = TRANSLATIONS[locale] ?? TRANSLATIONS[DEFAULT_LOCALE]

  const t = React.useCallback(
    (key: TranslationKey, vars?: TranslateVars) => {
      const value =
        getFromPath(dict, key) ?? getFromPath(TRANSLATIONS[DEFAULT_LOCALE], key) ?? key
      return interpolate(value, vars)
    },
    [dict],
  )

  const value = React.useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t,
      dict,
      dateLocale: LOCALE_META[locale].dateLocale,
    }),
    [locale, setLocale, t, dict],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const ctx = React.useContext(I18nContext)
  if (!ctx) {
    // Safe fallback so components rendered outside the provider don't crash.
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: ((key: string) => key) as I18nContextValue["t"],
      dict: TRANSLATIONS[DEFAULT_LOCALE],
      dateLocale: LOCALE_META[DEFAULT_LOCALE].dateLocale,
    }
  }
  return ctx
}
