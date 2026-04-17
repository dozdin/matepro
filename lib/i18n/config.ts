export const LOCALES = ["ca", "en", "fr", "it", "de"] as const

export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "ca"

export const LOCALE_STORAGE_KEY = "matepro-locale"

export interface LocaleMeta {
  code: Locale
  label: string
  nativeLabel: string
  flag: string
  dateLocale: string
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  ca: {
    code: "ca",
    label: "Catalan",
    nativeLabel: "Català",
    flag: "🇦🇩",
    dateLocale: "ca-ES",
  },
  en: {
    code: "en",
    label: "English",
    nativeLabel: "English",
    flag: "🇬🇧",
    dateLocale: "en-GB",
  },
  fr: {
    code: "fr",
    label: "French",
    nativeLabel: "Français",
    flag: "🇫🇷",
    dateLocale: "fr-FR",
  },
  it: {
    code: "it",
    label: "Italian",
    nativeLabel: "Italiano",
    flag: "🇮🇹",
    dateLocale: "it-IT",
  },
  de: {
    code: "de",
    label: "German",
    nativeLabel: "Deutsch",
    flag: "🇩🇪",
    dateLocale: "de-DE",
  },
}

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value)
}
