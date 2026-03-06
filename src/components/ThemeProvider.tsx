import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type ThemeMode = 'dark' | 'light'
export type ThemeColor = 'blue' | 'emerald' | 'violet' | 'amber' | 'rose' | 'cyan'

interface ThemeContextType {
  mode: ThemeMode
  color: ThemeColor
  setMode: (mode: ThemeMode) => void
  setColor: (color: ThemeColor) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextType | null>(null)

const COLOR_THEMES: Record<ThemeColor, { primary: string; accent: string; primaryHue: number }> = {
  blue: {
    primary: 'oklch(0.35 0.12 240)',
    accent: 'oklch(0.55 0.22 25)',
    primaryHue: 240,
  },
  emerald: {
    primary: 'oklch(0.40 0.15 160)',
    accent: 'oklch(0.50 0.18 85)',
    primaryHue: 160,
  },
  violet: {
    primary: 'oklch(0.38 0.15 290)',
    accent: 'oklch(0.55 0.20 330)',
    primaryHue: 290,
  },
  amber: {
    primary: 'oklch(0.50 0.15 75)',
    accent: 'oklch(0.55 0.22 25)',
    primaryHue: 75,
  },
  rose: {
    primary: 'oklch(0.40 0.18 350)',
    accent: 'oklch(0.50 0.15 290)',
    primaryHue: 350,
  },
  cyan: {
    primary: 'oklch(0.40 0.12 200)',
    accent: 'oklch(0.55 0.15 160)',
    primaryHue: 200,
  },
}

const LIGHT_MODE_OVERRIDES = {
  background: 'oklch(0.97 0.005 240)',
  foreground: 'oklch(0.20 0.01 240)',
  card: 'oklch(1.0 0 0)',
  cardForeground: 'oklch(0.20 0.01 240)',
  popover: 'oklch(0.98 0.005 240)',
  popoverForeground: 'oklch(0.20 0.01 240)',
  secondary: 'oklch(0.93 0.005 240)',
  secondaryForeground: 'oklch(0.20 0.01 240)',
  muted: 'oklch(0.95 0.005 240)',
  mutedForeground: 'oklch(0.45 0.01 240)',
  border: 'oklch(0.88 0.01 240)',
  input: 'oklch(0.92 0.005 240)',
}

const DARK_MODE_OVERRIDES = {
  background: 'oklch(0.15 0.01 240)',
  foreground: 'oklch(0.90 0.005 240)',
  card: 'oklch(0.18 0.01 240)',
  cardForeground: 'oklch(0.90 0.005 240)',
  popover: 'oklch(0.20 0.01 240)',
  popoverForeground: 'oklch(0.90 0.005 240)',
  secondary: 'oklch(0.25 0.01 240)',
  secondaryForeground: 'oklch(0.90 0.005 240)',
  muted: 'oklch(0.22 0.01 240)',
  mutedForeground: 'oklch(0.55 0.01 240)',
  border: 'oklch(0.30 0.01 240)',
  input: 'oklch(0.25 0.01 240)',
}

function applyTheme(mode: ThemeMode, color: ThemeColor) {
  const root = document.documentElement
  const colorTheme = COLOR_THEMES[color]
  const modeOverrides = mode === 'light' ? LIGHT_MODE_OVERRIDES : DARK_MODE_OVERRIDES

  root.style.setProperty('--primary', colorTheme.primary)
  root.style.setProperty('--ring', colorTheme.primary)
  root.style.setProperty('--accent', colorTheme.accent)
  root.style.setProperty('--primary-foreground', 'oklch(1 0 0)')
  root.style.setProperty('--accent-foreground', 'oklch(1 0 0)')

  root.style.setProperty('--background', modeOverrides.background)
  root.style.setProperty('--foreground', modeOverrides.foreground)
  root.style.setProperty('--card', modeOverrides.card)
  root.style.setProperty('--card-foreground', modeOverrides.cardForeground)
  root.style.setProperty('--popover', modeOverrides.popover)
  root.style.setProperty('--popover-foreground', modeOverrides.popoverForeground)
  root.style.setProperty('--secondary', modeOverrides.secondary)
  root.style.setProperty('--secondary-foreground', modeOverrides.secondaryForeground)
  root.style.setProperty('--muted', modeOverrides.muted)
  root.style.setProperty('--muted-foreground', modeOverrides.mutedForeground)
  root.style.setProperty('--border', modeOverrides.border)
  root.style.setProperty('--input', modeOverrides.input)

  root.setAttribute('data-theme-mode', mode)
  root.setAttribute('data-theme-color', color)
}

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem('sentinel-theme-mode') as ThemeMode) || 'dark'
    } catch {
      return 'dark'
    }
  })

  const [color, setColorState] = useState<ThemeColor>(() => {
    try {
      return (localStorage.getItem('sentinel-theme-color') as ThemeColor) || 'blue'
    } catch {
      return 'blue'
    }
  })

  const setMode = useCallback((newMode: ThemeMode) => {
    setModeState(newMode)
    try {
      localStorage.setItem('sentinel-theme-mode', newMode)
    } catch { /* ignore */ }
  }, [])

  const setColor = useCallback((newColor: ThemeColor) => {
    setColorState(newColor)
    try {
      localStorage.setItem('sentinel-theme-color', newColor)
    } catch { /* ignore */ }
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  useEffect(() => {
    applyTheme(mode, color)
  }, [mode, color])

  return (
    <ThemeContext.Provider value={{ mode, color, setMode, setColor, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
