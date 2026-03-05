import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { X, Keyboard } from '@phosphor-icons/react'
import { motion } from 'framer-motion'

interface KeyboardShortcutsProps {
  onClose: () => void
}

const shortcuts = [
  { key: 'Enter', description: 'Send message', context: 'Chat input focused' },
  { key: 'Shift + Enter', description: 'New line in message', context: 'Chat input focused' },
  { key: 'Ctrl/Cmd + N', description: 'New intelligence session', context: 'Anytime' },
  { key: 'Ctrl/Cmd + H', description: 'View session history', context: 'Anytime' },
  { key: 'Ctrl/Cmd + K', description: 'Show keyboard shortcuts', context: 'Anytime' },
  { key: 'Ctrl/Cmd + E', description: 'Export current session', context: 'With messages' },
  { key: 'Ctrl/Cmd + M', description: 'Toggle voice input', context: 'Anytime' },
  { key: 'Ctrl/Cmd + 1', description: 'Switch to Intelligence tab', context: 'Anytime' },
  { key: 'Ctrl/Cmd + 2', description: 'Switch to 3D Globe tab', context: 'Anytime' },
  { key: 'Ctrl/Cmd + 3', description: 'Switch to Threats tab', context: 'Anytime' },
  { key: 'Ctrl/Cmd + 4', description: 'Switch to Predictions tab', context: 'Anytime' },
  { key: 'Esc', description: 'Close dialogs/modals', context: 'Dialog open' },
]

export function KeyboardShortcuts({ onClose }: KeyboardShortcutsProps) {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-primary/20 border border-primary flex items-center justify-center">
                <Keyboard size={20} weight="fill" className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold uppercase tracking-wide">Keyboard Shortcuts</h2>
                <p className="text-xs text-muted-foreground font-mono">
                  EFFICIENCY COMMANDS FOR POWER OPERATORS
                </p>
              </div>
            </div>
            <Button size="sm" variant="outline" onClick={onClose}>
              <X size={16} />
            </Button>
          </div>

          <div className="space-y-2">
            {shortcuts.map((shortcut, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">{shortcut.description}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {shortcut.context}
                  </div>
                </div>
                <Badge variant="outline" className="font-mono text-xs px-3 py-1">
                  {shortcut.key}
                </Badge>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-xs text-muted-foreground font-mono leading-relaxed">
              <strong className="text-foreground">PRO TIP:</strong> Use Ctrl (Windows/Linux) or Cmd (macOS) for all shortcuts. Press Esc to dismiss any dialog or close this panel.
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}
