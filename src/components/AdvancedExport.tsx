import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { FileArrowDown, FileText, FileCsv, FileCode, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface AdvancedExportProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
}

export function AdvancedExport({ isOpen, onClose, messages }: AdvancedExportProps) {
  const [format, setFormat] = useState<'json' | 'csv' | 'pdf' | 'markdown'>('json')
  const [includeTimestamps, setIncludeTimestamps] = useState(true)
  const [includeMetadata, setIncludeMetadata] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)
  const [exportComplete, setExportComplete] = useState(false)

  const handleExport = async () => {
    if (!messages || messages.length === 0) {
      toast.error('No messages to export')
      return
    }

    setIsExporting(true)
    setExportProgress(0)
    setExportComplete(false)

    await new Promise(resolve => setTimeout(resolve, 200))
    setExportProgress(25)

    let content = ''
    let filename = `sentinel-intel-${Date.now()}`
    let mimeType = 'text/plain'

    const metadata = {
      exportedAt: new Date().toISOString(),
      messageCount: messages.length,
      sessionDuration: 'N/A',
      platform: 'SENTINEL Intelligence Platform'
    }

    await new Promise(resolve => setTimeout(resolve, 300))
    setExportProgress(50)

    switch (format) {
      case 'json':
        content = JSON.stringify({
          ...(includeMetadata ? metadata : {}),
          messages: messages.map(m => ({
            role: m.role,
            content: m.content,
            ...(includeTimestamps ? { timestamp: m.timestamp } : {})
          }))
        }, null, 2)
        filename += '.json'
        mimeType = 'application/json'
        break

      case 'csv':
        const headers = ['Role', 'Content', ...(includeTimestamps ? ['Timestamp'] : [])]
        const rows = messages.map(m => [
          m.role,
          `"${m.content.replace(/"/g, '""')}"`,
          ...(includeTimestamps ? [m.timestamp] : [])
        ])
        content = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
        filename += '.csv'
        mimeType = 'text/csv'
        break

      case 'markdown':
        content = includeMetadata ? `# SENTINEL Intelligence Report\n\n**Exported:** ${new Date().toLocaleString()}\n**Messages:** ${messages.length}\n\n---\n\n` : ''
        content += messages.map(m => {
          const timestamp = includeTimestamps ? ` _(${m.timestamp})_` : ''
          return `## ${m.role === 'user' ? 'QUERY' : 'ANALYSIS'}${timestamp}\n\n${m.content}\n`
        }).join('\n---\n\n')
        filename += '.md'
        mimeType = 'text/markdown'
        break

      case 'pdf':
        content = `SENTINEL INTELLIGENCE REPORT\n\n`
        if (includeMetadata) {
          content += `Exported: ${new Date().toLocaleString()}\n`
          content += `Messages: ${messages.length}\n\n`
          content += `${'='.repeat(60)}\n\n`
        }
        content += messages.map(m => {
          const timestamp = includeTimestamps ? ` [${m.timestamp}]` : ''
          return `${m.role.toUpperCase()}${timestamp}:\n${m.content}\n\n${'-'.repeat(60)}\n`
        }).join('\n')
        filename += '.txt'
        mimeType = 'text/plain'
        break
    }

    await new Promise(resolve => setTimeout(resolve, 400))
    setExportProgress(75)

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)

    await new Promise(resolve => setTimeout(resolve, 300))
    setExportProgress(100)
    setExportComplete(true)

    toast.success(`Exported ${messages.length} messages as ${format.toUpperCase()}`)

    setTimeout(() => {
      setIsExporting(false)
      setExportProgress(0)
      setExportComplete(false)
    }, 1500)
  }

  const formatInfo = {
    json: { icon: FileCode, description: 'Structured data with full metadata' },
    csv: { icon: FileCsv, description: 'Spreadsheet compatible format' },
    markdown: { icon: FileText, description: 'Human-readable documentation' },
    pdf: { icon: FileText, description: 'Print-ready text report' }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold uppercase tracking-wide">
            <FileArrowDown size={24} weight="fill" className="text-primary" />
            Advanced Export
          </DialogTitle>
          <DialogDescription className="font-mono text-xs">
            EXPORT INTELLIGENCE DATA // MULTIPLE FORMATS
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-3">
            <Label className="text-sm font-semibold uppercase tracking-wide">Export Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as any)}>
              {Object.entries(formatInfo).map(([key, { icon: Icon, description }]) => (
                <div
                  key={key}
                  className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:bg-accent/5 transition-colors cursor-pointer"
                  onClick={() => setFormat(key as any)}
                >
                  <RadioGroupItem value={key} id={key} />
                  <Icon size={20} weight="fill" className="text-primary" />
                  <div className="flex-1">
                    <Label htmlFor={key} className="font-mono uppercase text-xs cursor-pointer">
                      {key.toUpperCase()}
                    </Label>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-3 pt-3 border-t border-border">
            <Label className="text-sm font-semibold uppercase tracking-wide">Export Options</Label>
            
            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
              <Checkbox
                id="timestamps"
                checked={includeTimestamps}
                onCheckedChange={(checked) => setIncludeTimestamps(checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="timestamps" className="font-mono text-xs cursor-pointer">
                  INCLUDE TIMESTAMPS
                </Label>
                <p className="text-xs text-muted-foreground">Add temporal context to messages</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent/5 transition-colors">
              <Checkbox
                id="metadata"
                checked={includeMetadata}
                onCheckedChange={(checked) => setIncludeMetadata(checked as boolean)}
              />
              <div className="flex-1">
                <Label htmlFor="metadata" className="font-mono text-xs cursor-pointer">
                  INCLUDE METADATA
                </Label>
                <p className="text-xs text-muted-foreground">Session info and export details</p>
              </div>
            </div>
          </div>

          {isExporting && (
            <div className="space-y-2 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {exportComplete ? 'Complete' : 'Exporting...'}
                </span>
                <span className="text-xs font-mono font-bold text-primary">
                  {exportProgress}%
                </span>
              </div>
              <Progress value={exportProgress} className="h-2" />
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleExport}
              disabled={isExporting || messages.length === 0}
              className="flex-1 gap-2 font-mono uppercase text-sm"
            >
              <AnimatePresence mode="wait">
                {exportComplete ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check size={18} weight="bold" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="download"
                    initial={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <FileArrowDown size={18} weight="fill" />
                  </motion.div>
                )}
              </AnimatePresence>
              {exportComplete ? 'Exported' : isExporting ? 'Exporting...' : 'Export Intelligence'}
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isExporting}
              className="font-mono uppercase text-sm"
            >
              Cancel
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground font-mono">
            {messages.length} MESSAGE{messages.length !== 1 ? 'S' : ''} READY FOR EXPORT
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
