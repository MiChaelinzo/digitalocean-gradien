import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FilePdf, FileDoc, X, Download, FileText, Sparkle } from '@phosphor-icons/react'
import { queryAISimple } from '@/lib/ai-service'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ReportGeneratorProps {
  isOpen: boolean
  onClose: () => void
  messages: Message[]
}

export function ReportGenerator({ isOpen, onClose, messages }: ReportGeneratorProps) {
  const [reportTitle, setReportTitle] = useState('Intelligence Report')
  const [reportSubtitle, setReportSubtitle] = useState(`Generated on ${new Date().toLocaleDateString()}`)
  const [classification, setClassification] = useState<'unclassified' | 'confidential' | 'secret' | 'top-secret'>('confidential')
  const [includeSummary, setIncludeSummary] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState('')

  const generateSummary = async () => {
    if (messages.length === 0) {
      toast.error('No messages to summarize')
      return
    }

    setIsGenerating(true)
    try {
      const conversationText = messages
        .map(m => `${m.role === 'user' ? 'QUERY' : 'ANALYSIS'}: ${m.content}`)
        .join('\n\n')

      const prompt = `Analyze the following intelligence conversation and generate a concise executive summary (3-4 paragraphs) that highlights:
1. Key threats identified
2. Strategic recommendations
3. Operational priorities
4. Risk assessment

Conversation:
${conversationText}

Format the summary professionally for an intelligence report.`

      const { text: result, provider } = await queryAISimple(prompt)
      console.log(`[SENTINEL] Report summary via ${provider}`)
      setSummary(result)
      toast.success('Summary generated')
    } catch (error) {
      console.error('Error generating summary:', error)
      toast.error('Failed to generate summary')
    } finally {
      setIsGenerating(false)
    }
  }

  const exportReport = (format: 'txt' | 'json' | 'md') => {
    const timestamp = new Date().toISOString().split('T')[0]
    const classificationBanner = `[${classification.toUpperCase()}]`
    
    let content = ''
    let filename = ''
    let mimeType = ''

    if (format === 'txt') {
      content = `${classificationBanner}
${reportTitle}
${reportSubtitle}
${'='.repeat(60)}

${includeSummary && summary ? `EXECUTIVE SUMMARY\n${'-'.repeat(60)}\n${summary}\n\n` : ''}

INTELLIGENCE CONVERSATION
${'-'.repeat(60)}

${messages.map((m, i) => `
[${m.timestamp}] ${m.role.toUpperCase()}
${'-'.repeat(40)}
${m.content}
`).join('\n')}

${classificationBanner}
Report Generated: ${new Date().toLocaleString()}
Classification: ${classification.toUpperCase()}
Total Messages: ${messages.length}
`
      filename = `sentinel-report-${timestamp}.txt`
      mimeType = 'text/plain'
    } else if (format === 'json') {
      content = JSON.stringify({
        metadata: {
          title: reportTitle,
          subtitle: reportSubtitle,
          classification,
          generated: new Date().toISOString(),
          totalMessages: messages.length
        },
        summary: includeSummary ? summary : null,
        messages: messages.map(m => ({
          timestamp: m.timestamp,
          role: m.role,
          content: m.content
        }))
      }, null, 2)
      filename = `sentinel-report-${timestamp}.json`
      mimeType = 'application/json'
    } else if (format === 'md') {
      content = `# ${classificationBanner} ${reportTitle}

**${reportSubtitle}**

---

${includeSummary && summary ? `## Executive Summary\n\n${summary}\n\n---\n\n` : ''}

## Intelligence Conversation

${messages.map((m, i) => `
### ${m.role === 'user' ? '🔍 Query' : '🎯 Analysis'} - ${m.timestamp}

${m.content}

---
`).join('\n')}

## Report Metadata

- **Classification:** ${classification.toUpperCase()}
- **Generated:** ${new Date().toLocaleString()}
- **Total Messages:** ${messages.length}
- **Report ID:** ${`SENT-${Date.now().toString(36).toUpperCase()}`}

${classificationBanner}
`
      filename = `sentinel-report-${timestamp}.md`
      mimeType = 'text/markdown'
    }

    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
    toast.success(`Report exported as ${format.toUpperCase()}`)
  }

  const getClassificationColor = (level: string) => {
    switch (level) {
      case 'unclassified': return 'bg-success/20 text-success border-success/50'
      case 'confidential': return 'bg-primary/20 text-primary border-primary/50'
      case 'secret': return 'bg-warning/20 text-warning border-warning/50'
      case 'top-secret': return 'bg-destructive/20 text-destructive border-destructive/50'
      default: return 'bg-muted text-muted-foreground'
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-4xl max-h-[90vh]"
        >
          <Card className="bg-card/95 backdrop-blur-md border-primary/30">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-primary/20 border border-primary/50 flex items-center justify-center">
                  <FileText size={20} weight="fill" className="text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold uppercase tracking-wide">Intelligence Report Generator</h3>
                  <p className="text-xs text-muted-foreground font-mono">
                    {messages.length} MESSAGES • EXPORT READY
                  </p>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X size={20} />
              </Button>
            </div>

            <ScrollArea className="h-[calc(90vh-200px)]">
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
                      Report Title
                    </label>
                    <Input
                      value={reportTitle}
                      onChange={(e) => setReportTitle(e.target.value)}
                      className="font-mono"
                      placeholder="Intelligence Report Title"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
                      Subtitle / Description
                    </label>
                    <Input
                      value={reportSubtitle}
                      onChange={(e) => setReportSubtitle(e.target.value)}
                      className="font-mono"
                      placeholder="Report subtitle or date"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-mono uppercase text-muted-foreground mb-2 block">
                      Classification Level
                    </label>
                    <Select value={classification} onValueChange={(v) => setClassification(v as typeof classification)}>
                      <SelectTrigger className="font-mono">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unclassified">
                          <span className="flex items-center gap-2">
                            <Badge className={getClassificationColor('unclassified')}>UNCLASSIFIED</Badge>
                          </span>
                        </SelectItem>
                        <SelectItem value="confidential">
                          <span className="flex items-center gap-2">
                            <Badge className={getClassificationColor('confidential')}>CONFIDENTIAL</Badge>
                          </span>
                        </SelectItem>
                        <SelectItem value="secret">
                          <span className="flex items-center gap-2">
                            <Badge className={getClassificationColor('secret')}>SECRET</Badge>
                          </span>
                        </SelectItem>
                        <SelectItem value="top-secret">
                          <span className="flex items-center gap-2">
                            <Badge className={getClassificationColor('top-secret')}>TOP SECRET</Badge>
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t border-border pt-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-xs font-mono uppercase text-muted-foreground">
                        Executive Summary (AI-Generated)
                      </label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={generateSummary}
                        disabled={isGenerating || messages.length === 0}
                        className="gap-2 text-xs font-mono uppercase"
                      >
                        <Sparkle size={14} weight={isGenerating ? 'fill' : 'regular'} />
                        {isGenerating ? 'Generating...' : 'Generate Summary'}
                      </Button>
                    </div>
                    
                    <Textarea
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Click 'Generate Summary' to create an AI-powered executive summary, or write your own..."
                      className="min-h-[200px] font-mono text-sm"
                      disabled={isGenerating}
                    />
                  </div>

                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wide mb-3">Report Preview</h4>
                    <div className="space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Title:</span>
                        <span className="font-semibold">{reportTitle}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Subtitle:</span>
                        <span>{reportSubtitle}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Classification:</span>
                        <Badge className={getClassificationColor(classification)}>
                          {classification.toUpperCase().replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Messages:</span>
                        <span>{messages.length}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">Summary:</span>
                        <span>{summary ? 'Included' : 'Not included'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => exportReport('txt')}
                  disabled={messages.length === 0}
                  className="flex-1 bg-primary hover:bg-primary/90 gap-2 font-mono uppercase text-xs"
                >
                  <FileDoc size={16} weight="fill" />
                  Export TXT
                </Button>
                <Button
                  onClick={() => exportReport('md')}
                  disabled={messages.length === 0}
                  variant="outline"
                  className="flex-1 gap-2 font-mono uppercase text-xs"
                >
                  <FileText size={16} weight="fill" />
                  Export Markdown
                </Button>
                <Button
                  onClick={() => exportReport('json')}
                  disabled={messages.length === 0}
                  variant="outline"
                  className="flex-1 gap-2 font-mono uppercase text-xs"
                >
                  <FilePdf size={16} weight="fill" />
                  Export JSON
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
