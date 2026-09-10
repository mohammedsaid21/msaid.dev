import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { ar } from './ar'
import { en } from './en'
import type { Dictionary, Locale } from './types'

const dictionaries: Record<Locale, Dictionary> = { en, ar }
const STORAGE_KEY = 'ms-locale'

function readLocale(): Locale {
  try {
    const params = new URLSearchParams(window.location.search)
    const query = params.get('lang')
    if (query === 'ar' || query === 'en') return query
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'ar' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  if (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('ar')) {
    return 'ar'
  }
  return 'en'
}

interface LocaleContextValue {
  locale: Locale
  dir: 'rtl' | 'ltr'
  t: Dictionary
  setLocale: (locale: Locale) => void
  toggle: () => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readLocale)
  const dir: 'rtl' | 'ltr' = locale === 'ar' ? 'rtl' : 'ltr'

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
  }, [])

  const toggle = useCallback(() => {
    setLocaleState((current) => (current === 'ar' ? 'en' : 'ar'))
  }, [])

  useLayoutEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
    try {
      localStorage.setItem(STORAGE_KEY, locale)
    } catch {
      /* ignore */
    }
  }, [locale, dir])

  const value = useMemo(
    () => ({ locale, dir, t: dictionaries[locale], setLocale, toggle }),
    [locale, dir, setLocale, toggle],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
