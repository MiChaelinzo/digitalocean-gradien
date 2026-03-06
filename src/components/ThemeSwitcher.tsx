import { useTheme, type ThemeColor } from '@/components/ThemeProvider'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sun, Moon } from '@phosphor-icons/react'
import { useState, useRef, useEffect } from 'react'

const COLOR_OPTIONS: { value: ThemeColor; label: string; swatch: string }[] = [
  { value: 'blue', label: 'Blue', swatch: 'bg-blue-500' },
  { value: 'emerald', label: 'Emerald', swatch: 'bg-emerald-500' },
  { value: 'violet', label: 'Violet', swatch: 'bg-violet-500' },
  { value: 'amber', label: 'Amber', swatch: 'bg-amber-500' },
  { value: 'rose', label: 'Rose', swatch: 'bg-rose-500' },
  { value: 'cyan', label: 'Cyan', swatch: 'bg-cyan-500' },
]

export function ThemeSwitcher() {
  const { mode, color, setColor, toggleMode } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className="relative" ref={panelRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="gap-2 text-xs font-mono uppercase"
        title="Theme Settings"
      >
        {mode === 'dark' ? <Moon size={16} weight="fill" /> : <Sun size={16} weight="fill" />}
        <span className="hidden xl:inline">Theme</span>
      </Button>

      {isOpen && (
        <Card className="absolute right-0 top-full mt-2 p-4 w-56 z-50 bg-card/95 backdrop-blur-xl border-border shadow-xl">
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Mode
              </p>
              <div className="flex gap-2">
                <Button
                  variant={mode === 'dark' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('dark')}
                  className="flex-1 gap-1.5 text-xs font-mono"
                >
                  <Moon size={14} weight="fill" />
                  Dark
                </Button>
                <Button
                  variant={mode === 'light' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMode('light')}
                  className="flex-1 gap-1.5 text-xs font-mono"
                >
                  <Sun size={14} weight="fill" />
                  Light
                </Button>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-2">
                Accent Color
              </p>
              <div className="grid grid-cols-3 gap-2">
                {COLOR_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setColor(option.value)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-md border transition-all ${
                      color === option.value
                        ? 'border-primary bg-primary/10 ring-1 ring-primary'
                        : 'border-border hover:border-muted-foreground/30'
                    }`}
                    title={option.label}
                  >
                    <div className={`w-5 h-5 rounded-full ${option.swatch}`} />
                    <span className="text-[10px] font-mono">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
